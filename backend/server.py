from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import pyotp
import base64
import io
import qrcode
import stripe

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'gig_zipfinder')]

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == '_id':
                result['_id'] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            else:
                result[key] = value
        return result
    return doc

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder')

# Admin secret for JWT-like tokens
ADMIN_SECRET = os.environ.get('ADMIN_SECRET_KEY', 'admin_secret_key_2025')

# Create the main app
app = FastAPI(title="Gig ZipFinder API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class ZipCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    zip_code: str
    city: str
    state: str
    app_name: str  # spark, doordash, instacart
    is_active: bool = True
    availability_score: int = Field(default=80, ge=0, le=100)  # Higher = more likely available
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    source: str = "manual"  # manual, ai_search
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))

class ZipCodeCreate(BaseModel):
    zip_code: str
    city: str
    state: str
    app_name: str
    availability_score: int = 80

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    stripe_payment_intent_id: Optional[str] = None
    user_id: str
    app_name: str
    amount: int = 500  # $5.00 in cents
    currency: str = "usd"
    status: str = "pending"  # pending, succeeded, failed
    terms_accepted: bool = False
    terms_accepted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentCreate(BaseModel):
    user_id: str
    app_name: str
    terms_accepted: bool

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password_hash: str
    totp_secret: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminCreate(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str
    totp_code: str

class AdminToken(BaseModel):
    token: str
    expires_at: datetime

class Guide(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    app_name: str  # spark, doordash, instacart, google_voice
    title_en: str
    title_es: str
    content_en: str
    content_es: str
    order: int = 0
    is_active: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GuideCreate(BaseModel):
    app_name: str
    title_en: str
    title_es: str
    content_en: str
    content_es: str
    order: int = 0

class TermsConditions(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_en: str
    content_es: str
    version: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def generate_token(admin_id: str) -> str:
    data = f"{admin_id}:{datetime.utcnow().isoformat()}:{ADMIN_SECRET}"
    return hashlib.sha256(data.encode()).hexdigest()

async def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    session = await db.admin_sessions.find_one({"token": token, "expires_at": {"$gt": datetime.utcnow()}})
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return session["admin_id"]

# ============== STRIPE ROUTES ==============

@api_router.get("/stripe/config")
async def get_stripe_config():
    """Get Stripe publishable key"""
    return {"publishable_key": STRIPE_PUBLISHABLE_KEY}

@api_router.post("/stripe/create-payment-intent")
async def create_payment_intent(payment: PaymentCreate):
    """Create a Stripe payment intent for $5"""
    if not payment.terms_accepted:
        raise HTTPException(status_code=400, detail="Terms and conditions must be accepted")
    
    try:
        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=500,  # $5.00 in cents
            currency="usd",
            automatic_payment_methods={"enabled": True},
            metadata={
                "user_id": payment.user_id,
                "app_name": payment.app_name
            }
        )
        
        # Save payment record
        payment_record = Payment(
            stripe_payment_intent_id=intent.id,
            user_id=payment.user_id,
            app_name=payment.app_name,
            terms_accepted=True,
            terms_accepted_at=datetime.utcnow()
        )
        await db.payments.insert_one(payment_record.dict())
        
        return {
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/stripe/confirm-payment/{payment_intent_id}")
async def confirm_payment(payment_intent_id: str):
    """Confirm payment was successful and return zip codes"""
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == "succeeded":
            # Update payment record
            await db.payments.update_one(
                {"stripe_payment_intent_id": payment_intent_id},
                {"$set": {"status": "succeeded"}}
            )
            
            # Get app name from payment
            payment = await db.payments.find_one({"stripe_payment_intent_id": payment_intent_id})
            if payment:
                # Return zip codes for the app
                zip_codes = await db.zip_codes.find({
                    "app_name": payment["app_name"],
                    "is_active": True,
                    "expires_at": {"$gt": datetime.utcnow()}
                }).sort("availability_score", -1).limit(5).to_list(5)
                
                return {
                    "status": "succeeded",
                    "app_name": payment["app_name"],
                    "zip_codes": zip_codes
                }
        
        return {"status": intent.status}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

class CheckoutSessionRequest(BaseModel):
    user_id: str
    app_name: str
    terms_accepted: bool

@api_router.post("/stripe/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    """Create a Stripe Checkout Session for web payments"""
    try:
        # Get base URL from environment or use default
        base_url = os.environ.get('FRONTEND_URL', 'https://gigzipfinder.app')
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'GIG ZipFinder - {request.app_name.title()} Package',
                        'description': f'5 Hot Zip Codes + {request.app_name.title()} Guide + Google Voice Guide',
                    },
                    'unit_amount': 500,  # $5.00 in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{base_url}/results?payment=success&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{base_url}/payment?payment=cancelled',
            metadata={
                'user_id': request.user_id,
                'app_name': request.app_name,
                'terms_accepted': str(request.terms_accepted)
            }
        )
        
        # Save payment record
        payment = Payment(
            user_id=request.user_id,
            amount=5.00,
            currency="usd",
            app_name=request.app_name,
            status="pending",
            stripe_payment_intent_id=session.payment_intent if session.payment_intent else session.id,
            terms_accepted=request.terms_accepted
        )
        await db.payments.insert_one(payment.dict())
        
        return {
            "checkout_url": session.url,
            "session_id": session.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/stripe/verify-checkout/{session_id}")
async def verify_checkout_session(session_id: str):
    """Verify a Stripe Checkout Session payment status"""
    try:
        # Retrieve the checkout session
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            # Update payment record in database
            await db.payments.update_one(
                {"stripe_payment_intent_id": session_id},
                {"$set": {"status": "succeeded"}}
            )
            
            # Also try to update by payment_intent if available
            if session.payment_intent:
                await db.payments.update_one(
                    {"stripe_payment_intent_id": session.payment_intent},
                    {"$set": {"status": "succeeded"}}
                )
            
            return {
                "status": "succeeded",
                "payment_status": session.payment_status,
                "customer_email": session.customer_details.email if session.customer_details else None
            }
        else:
            return {
                "status": session.payment_status,
                "payment_status": session.payment_status
            }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/stripe/check-payment-by-email/{email}")
async def check_payment_by_email(email: str, app_name: str):
    """Check if a payment exists for an email and app"""
    try:
        # Search for recent checkout sessions with this email
        sessions = stripe.checkout.Session.list(
            limit=10,
            expand=['data.payment_intent']
        )
        
        for session in sessions.data:
            if (session.customer_details and 
                session.customer_details.email == email and
                session.payment_status == 'paid'):
                metadata = session.metadata or {}
                if metadata.get('app_name', '').lower() == app_name.lower():
                    return {
                        "found": True,
                        "status": "succeeded",
                        "session_id": session.id
                    }
        
        return {"found": False, "status": "not_found"}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/stripe/check-payment-by-user/{user_id}")
async def check_payment_by_user_id(user_id: str, app_name: str):
    """Check if a payment exists for a user_id and app"""
    try:
        # First check our database for payments
        payment = await db.payments.find_one({
            "user_id": user_id,
            "app_name": app_name.lower(),
            "status": "succeeded"
        })
        
        if payment:
            return {
                "found": True,
                "status": "succeeded",
                "payment_id": payment.get("id"),
                "stripe_payment_intent_id": payment.get("stripe_payment_intent_id")
            }
        
        # Also search Stripe sessions by metadata
        sessions = stripe.checkout.Session.list(
            limit=10,
            expand=['data.payment_intent']
        )
        
        for session in sessions.data:
            if session.payment_status == 'paid':
                metadata = session.metadata or {}
                if (metadata.get('user_id') == user_id and 
                    metadata.get('app_name', '').lower() == app_name.lower()):
                    return {
                        "found": True,
                        "status": "succeeded",
                        "session_id": session.id
                    }
        
        return {"found": False, "status": "not_found"}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== ZIP CODES ROUTES ==============

@api_router.get("/zip-codes/{app_name}")
async def get_zip_codes_by_app(app_name: str, limit: int = 5):
    """Get active zip codes for a specific app (requires payment verification)"""
    zip_codes = await db.zip_codes.find({
        "app_name": app_name.lower(),
        "is_active": True,
        "expires_at": {"$gt": datetime.utcnow()}
    }).sort("availability_score", -1).limit(limit).to_list(limit)
    
    return serialize_doc(zip_codes)

@api_router.get("/zip-codes")
async def get_all_zip_codes():
    """Get all zip codes (admin only)"""
    zip_codes = await db.zip_codes.find().to_list(1000)
    return serialize_doc(zip_codes)

@api_router.post("/zip-codes", dependencies=[Depends(verify_admin_token)])
async def create_zip_code(zip_data: ZipCodeCreate):
    """Create a new zip code (admin only)"""
    zip_code = ZipCode(
        zip_code=zip_data.zip_code,
        city=zip_data.city,
        state=zip_data.state,
        app_name=zip_data.app_name.lower(),
        availability_score=zip_data.availability_score,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    await db.zip_codes.insert_one(zip_code.dict())
    return zip_code

@api_router.put("/zip-codes/{zip_id}", dependencies=[Depends(verify_admin_token)])
async def update_zip_code(zip_id: str, zip_data: ZipCodeCreate):
    """Update a zip code (admin only)"""
    result = await db.zip_codes.update_one(
        {"id": zip_id},
        {"$set": {
            "zip_code": zip_data.zip_code,
            "city": zip_data.city,
            "state": zip_data.state,
            "app_name": zip_data.app_name.lower(),
            "availability_score": zip_data.availability_score,
            "last_updated": datetime.utcnow()
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Zip code not found")
    return {"message": "Zip code updated successfully"}

@api_router.delete("/zip-codes/{zip_id}", dependencies=[Depends(verify_admin_token)])
async def delete_zip_code(zip_id: str):
    """Delete a zip code (admin only)"""
    result = await db.zip_codes.delete_one({"id": zip_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Zip code not found")
    return {"message": "Zip code deleted successfully"}

# ============== GUIDES ROUTES ==============

@api_router.get("/guides/{app_name}")
async def get_guides_by_app(app_name: str):
    """Get guides for a specific app"""
    guides = await db.guides.find({
        "app_name": app_name.lower(),
        "is_active": True
    }).sort("order", 1).to_list(100)
    return serialize_doc(guides)

@api_router.get("/guides")
async def get_all_guides():
    """Get all guides"""
    guides = await db.guides.find().to_list(1000)
    return serialize_doc(guides)

@api_router.post("/guides", dependencies=[Depends(verify_admin_token)])
async def create_guide(guide_data: GuideCreate):
    """Create a new guide (admin only)"""
    guide = Guide(**guide_data.dict())
    await db.guides.insert_one(guide.dict())
    return guide

@api_router.put("/guides/{guide_id}", dependencies=[Depends(verify_admin_token)])
async def update_guide(guide_id: str, guide_data: GuideCreate):
    """Update a guide (admin only)"""
    result = await db.guides.update_one(
        {"id": guide_id},
        {"$set": {**guide_data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Guide not found")
    return {"message": "Guide updated successfully"}

@api_router.delete("/guides/{guide_id}", dependencies=[Depends(verify_admin_token)])
async def delete_guide(guide_id: str):
    """Delete a guide (admin only)"""
    result = await db.guides.delete_one({"id": guide_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Guide not found")
    return {"message": "Guide deleted successfully"}

# ============== TERMS & CONDITIONS ROUTES ==============

@api_router.get("/terms")
async def get_terms():
    """Get active terms and conditions"""
    terms = await db.terms.find_one({"is_active": True})
    if not terms:
        # Return default terms if none exist
        return {
            "content_en": DEFAULT_TERMS_EN,
            "content_es": DEFAULT_TERMS_ES,
            "version": "1.0"
        }
    return serialize_doc(terms)

@api_router.post("/terms", dependencies=[Depends(verify_admin_token)])
async def create_terms(content_en: str, content_es: str, version: str):
    """Create new terms (admin only)"""
    # Deactivate previous terms
    await db.terms.update_many({}, {"$set": {"is_active": False}})
    
    terms = TermsConditions(
        content_en=content_en,
        content_es=content_es,
        version=version
    )
    await db.terms.insert_one(terms.dict())
    return terms

# ============== ADMIN ROUTES ==============

@api_router.post("/admin/register")
async def register_admin(admin_data: AdminCreate):
    """Register a new admin (first time only or with existing admin)"""
    # Check if any admin exists
    existing_admin = await db.admins.find_one({"username": admin_data.username})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Generate TOTP secret
    totp_secret = pyotp.random_base32()
    
    admin = AdminUser(
        username=admin_data.username,
        password_hash=hash_password(admin_data.password),
        totp_secret=totp_secret
    )
    await db.admins.insert_one(admin.dict())
    
    # Generate QR code for TOTP
    totp_uri = pyotp.TOTP(totp_secret).provisioning_uri(
        name=admin_data.username,
        issuer_name="GigZipFinder"
    )
    
    # Create QR code image
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        "message": "Admin created successfully",
        "totp_secret": totp_secret,
        "qr_code": f"data:image/png;base64,{qr_base64}",
        "instructions": "Scan this QR code with Google Authenticator or similar app"
    }

@api_router.post("/admin/login")
async def login_admin(login_data: AdminLogin):
    """Login admin with 2FA"""
    admin = await db.admins.find_one({"username": login_data.username, "is_active": True})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify TOTP code
    totp = pyotp.TOTP(admin["totp_secret"])
    if not totp.verify(login_data.totp_code):
        raise HTTPException(status_code=401, detail="Invalid 2FA code")
    
    # Generate session token
    token = generate_token(admin["id"])
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    await db.admin_sessions.insert_one({
        "token": token,
        "admin_id": admin["id"],
        "expires_at": expires_at
    })
    
    return AdminToken(token=token, expires_at=expires_at)

@api_router.post("/admin/logout", dependencies=[Depends(verify_admin_token)])
async def logout_admin(authorization: str = Header(None)):
    """Logout admin"""
    token = authorization.replace("Bearer ", "")
    await db.admin_sessions.delete_one({"token": token})
    return {"message": "Logged out successfully"}

@api_router.get("/admin/payments", dependencies=[Depends(verify_admin_token)])
async def get_admin_payments(
    status: Optional[str] = None,
    app_name: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    """Get all payments for admin dashboard"""
    query = {}
    if status:
        query["status"] = status
    if app_name:
        query["app_name"] = app_name.lower()
    
    skip = (page - 1) * limit
    payments = await db.payments.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.payments.count_documents(query)
    
    return {
        "payments": serialize_doc(payments),
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

@api_router.get("/admin/stats", dependencies=[Depends(verify_admin_token)])
async def get_admin_stats():
    """Get payment statistics"""
    total_payments = await db.payments.count_documents({})
    successful_payments = await db.payments.count_documents({"status": "succeeded"})
    total_revenue = successful_payments * 5  # $5 per payment
    
    # Payments by app
    pipeline = [
        {"$match": {"status": "succeeded"}},
        {"$group": {"_id": "$app_name", "count": {"$sum": 1}, "revenue": {"$sum": 5}}}
    ]
    by_app = await db.payments.aggregate(pipeline).to_list(10)
    
    return {
        "total_payments": total_payments,
        "successful_payments": successful_payments,
        "total_revenue": total_revenue,
        "by_app": by_app
    }

# ============== AI SEARCH (BACKGROUND) ==============

@api_router.post("/admin/ai-search", dependencies=[Depends(verify_admin_token)])
async def trigger_ai_search(app_name: str):
    """Trigger AI search for zip codes (admin only) - runs in background"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    try:
        emergent_key = os.environ.get('EMERGENT_LLM_KEY')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="AI integration not configured")
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"zip-search-{app_name}-{datetime.utcnow().isoformat()}",
            system_message=f"""You are a research assistant helping find US zip codes where {app_name} driver/shopper positions might be available. 
            Based on your knowledge of areas with high demand for gig economy services, suggest 5 US zip codes that typically have openings for {app_name}.
            Focus on:
            - Medium to large cities with growing populations
            - Areas with many restaurants/grocery stores
            - Suburban areas with good delivery demand
            
            Respond ONLY with a JSON array of objects with this format:
            [{{"zip_code": "12345", "city": "City Name", "state": "ST", "score": 85}}]
            
            The score should be 1-100 indicating likelihood of availability (higher = more likely open).
            Do not include any other text, just the JSON array."""
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(
            text=f"Find 5 promising US zip codes for {app_name} driver/shopper availability. Return only JSON."
        )
        
        response = await chat.send_message(user_message)
        
        # Parse response and save zip codes
        import json
        # Clean the response - remove markdown code blocks if present
        clean_response = response.strip()
        if clean_response.startswith("```"):
            clean_response = clean_response.split("```")[1]
            if clean_response.startswith("json"):
                clean_response = clean_response[4:]
        clean_response = clean_response.strip()
        
        zip_data = json.loads(clean_response)
        
        saved_count = 0
        for item in zip_data:
            zip_code = ZipCode(
                zip_code=item["zip_code"],
                city=item["city"],
                state=item["state"],
                app_name=app_name.lower(),
                availability_score=item.get("score", 75),
                source="ai_search",
                expires_at=datetime.utcnow() + timedelta(days=7)
            )
            
            # Check if zip code already exists for this app
            existing = await db.zip_codes.find_one({
                "zip_code": item["zip_code"],
                "app_name": app_name.lower()
            })
            
            if not existing:
                await db.zip_codes.insert_one(zip_code.dict())
                saved_count += 1
        
        return {
            "message": f"AI search completed. Found {len(zip_data)} suggestions, saved {saved_count} new zip codes.",
            "zip_codes": zip_data
        }
        
    except Exception as e:
        logging.error(f"AI search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI search failed: {str(e)}")

# ============== PDF GUIDES DOWNLOAD ==============

GUIDES_DIR = Path("/app/frontend/assets/guides")

@api_router.get("/download-guide/{app_name}/{language}")
async def download_guide(app_name: str, language: str):
    """Download PDF guide for a specific app"""
    valid_apps = ["spark", "doordash", "instacart", "google_voice"]
    valid_languages = ["en", "es"]
    
    if app_name.lower() not in valid_apps:
        raise HTTPException(status_code=400, detail="Invalid app name")
    if language.lower() not in valid_languages:
        raise HTTPException(status_code=400, detail="Invalid language")
    
    filename = f"{app_name.lower()}_guide_{language.lower()}.pdf"
    filepath = GUIDES_DIR / filename
    
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Guide not found")
    
    return FileResponse(
        path=str(filepath),
        filename=filename,
        media_type="application/pdf"
    )

@api_router.get("/guides-list")
async def list_available_guides():
    """List all available PDF guides"""
    guides = []
    apps = ["spark", "doordash", "instacart", "google_voice"]
    languages = [("en", "English"), ("es", "Español")]
    
    for app in apps:
        for lang_code, lang_name in languages:
            filename = f"{app}_guide_{lang_code}.pdf"
            filepath = GUIDES_DIR / filename
            if filepath.exists():
                guides.append({
                    "app": app,
                    "language": lang_code,
                    "language_name": lang_name,
                    "filename": filename,
                    "download_url": f"/api/download-guide/{app}/{lang_code}"
                })
    
    return guides

# ============== DEFAULT DATA ==============

DEFAULT_TERMS_EN = """
TERMS AND CONDITIONS - GIG ZIPFINDER

PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THIS APPLICATION.

1. ACCEPTANCE OF TERMS
By accessing and using the GIG ZipFinder application ("App"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use this App.

2. SERVICE DESCRIPTION
GIG ZipFinder provides:
- Zip codes that MAY have availability for opening accounts on gig economy platforms (Instacart, DoorDash, Spark Driver)
- Step-by-step guides for account opening procedures
- Instructions for obtaining a free secondary phone number via Google Voice

3. NO GUARANTEE OF AVAILABILITY
THE ZIP CODES PROVIDED ARE SUGGESTIONS ONLY. We make NO guarantee that:
- Any specific zip code will have open positions at the time of your application
- The platforms (Instacart, DoorDash, Spark Driver) will accept new applications in any area
- Zip codes will remain open after being provided to you

Zip codes are updated weekly and may close at any time due to high demand. The availability status can change within minutes.

4. PAYMENT AND REFUND POLICY
- The fee of $5.00 USD is charged for ACCESS TO GUIDES and instructions, NOT for the zip codes themselves
- Zip codes are provided as a FREE bonus service
- ALL PAYMENTS ARE FINAL - No refunds or cancellations will be processed
- We cannot verify if zip codes were used or if applications were submitted
- Payment is non-refundable regardless of whether the zip codes are still available

5. DISCLAIMER OF WARRANTY
This App is provided "AS IS" without any warranties, express or implied. We disclaim all warranties including:
- Merchantability
- Fitness for a particular purpose
- Accuracy or completeness of information
- Non-infringement

6. LIMITATION OF LIABILITY
Under no circumstances shall GIG ZipFinder be liable for:
- Any direct, indirect, incidental, special, or consequential damages
- Loss of profits, revenue, or business opportunities
- Failed applications or rejected accounts
- Any actions taken by third-party platforms

7. THIRD-PARTY PLATFORMS
- GIG ZipFinder is NOT affiliated with Instacart, DoorDash, Spark Driver, or Google
- We do not control or guarantee the policies of these platforms
- Account approval is solely at the discretion of each platform

8. USER RESPONSIBILITIES
You agree to:
- Provide accurate information in your applications
- Comply with all applicable laws and platform policies
- Use the information provided for legitimate purposes only
- Not share, resell, or distribute the information obtained

9. GOVERNING LAW
These Terms shall be governed by the laws of the United States of America. Any disputes shall be resolved in accordance with applicable federal and state laws.

10. CHANGES TO TERMS
We reserve the right to modify these terms at any time. Continued use of the App constitutes acceptance of modified terms.

11. CONTACT
For questions regarding these terms, please contact us through the App.

BY CLICKING "I ACCEPT" OR USING THIS APP, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.

Last Updated: January 2025
"""

DEFAULT_TERMS_ES = """
TÉRMINOS Y CONDICIONES - GIG ZIPFINDER

POR FAVOR LEA ESTOS TÉRMINOS Y CONDICIONES CUIDADOSAMENTE ANTES DE USAR ESTA APLICACIÓN.

1. ACEPTACIÓN DE TÉRMINOS
Al acceder y usar la aplicación GIG ZipFinder ("App"), usted acepta y acuerda estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con estos términos, no use esta App.

2. DESCRIPCIÓN DEL SERVICIO
GIG ZipFinder proporciona:
- Códigos postales que PUEDEN tener disponibilidad para abrir cuentas en plataformas de economía gig (Instacart, DoorDash, Spark Driver)
- Guías paso a paso para procedimientos de apertura de cuenta
- Instrucciones para obtener un número de teléfono secundario gratis a través de Google Voice

3. SIN GARANTÍA DE DISPONIBILIDAD
LOS CÓDIGOS POSTALES PROPORCIONADOS SON SOLO SUGERENCIAS. NO garantizamos que:
- Cualquier código postal específico tenga posiciones abiertas al momento de su solicitud
- Las plataformas (Instacart, DoorDash, Spark Driver) acepten nuevas solicitudes en cualquier área
- Los códigos postales permanezcan abiertos después de ser proporcionados

Los códigos postales se actualizan semanalmente y pueden cerrarse en cualquier momento debido a la alta demanda. El estado de disponibilidad puede cambiar en minutos.

4. POLÍTICA DE PAGO Y REEMBOLSO
- La tarifa de $5.00 USD se cobra por ACCESO A LAS GUÍAS e instrucciones, NO por los códigos postales
- Los códigos postales se proporcionan como un servicio de bonificación GRATUITO
- TODOS LOS PAGOS SON FINALES - No se procesarán reembolsos ni cancelaciones
- No podemos verificar si los códigos postales fueron usados o si se enviaron solicitudes
- El pago no es reembolsable independientemente de si los códigos postales aún están disponibles

5. DESCARGO DE GARANTÍA
Esta App se proporciona "TAL CUAL" sin ninguna garantía, expresa o implícita. Renunciamos a todas las garantías incluyendo:
- Comerciabilidad
- Idoneidad para un propósito particular
- Precisión o integridad de la información
- No infracción

6. LIMITACIÓN DE RESPONSABILIDAD
Bajo ninguna circunstancia GIG ZipFinder será responsable por:
- Cualquier daño directo, indirecto, incidental, especial o consecuente
- Pérdida de ganancias, ingresos u oportunidades de negocio
- Solicitudes fallidas o cuentas rechazadas
- Cualquier acción tomada por plataformas de terceros

7. PLATAFORMAS DE TERCEROS
- GIG ZipFinder NO está afiliado con Instacart, DoorDash, Spark Driver o Google
- No controlamos ni garantizamos las políticas de estas plataformas
- La aprobación de cuentas es únicamente a discreción de cada plataforma

8. RESPONSABILIDADES DEL USUARIO
Usted acepta:
- Proporcionar información precisa en sus solicitudes
- Cumplir con todas las leyes aplicables y políticas de las plataformas
- Usar la información proporcionada solo para propósitos legítimos
- No compartir, revender ni distribuir la información obtenida

9. LEY APLICABLE
Estos Términos se regirán por las leyes de los Estados Unidos de América. Cualquier disputa se resolverá de acuerdo con las leyes federales y estatales aplicables.

10. CAMBIOS A LOS TÉRMINOS
Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la App constituye aceptación de los términos modificados.

11. CONTACTO
Para preguntas sobre estos términos, contáctenos a través de la App.

AL HACER CLIC EN "ACEPTO" O USAR ESTA APP, USTED RECONOCE QUE HA LEÍDO, ENTENDIDO Y ACEPTA ESTAR SUJETO A ESTOS TÉRMINOS Y CONDICIONES.

Última Actualización: Enero 2025
"""

# ============== SEED DATA ==============

@api_router.post("/seed-data")
async def seed_initial_data():
    """Seed initial data for the application"""
    
    # Seed zip codes
    initial_zip_codes = [
        # Spark Driver
        {"zip_code": "75201", "city": "Dallas", "state": "TX", "app_name": "spark", "availability_score": 85},
        {"zip_code": "85001", "city": "Phoenix", "state": "AZ", "app_name": "spark", "availability_score": 80},
        {"zip_code": "28202", "city": "Charlotte", "state": "NC", "app_name": "spark", "availability_score": 78},
        {"zip_code": "37201", "city": "Nashville", "state": "TN", "app_name": "spark", "availability_score": 82},
        {"zip_code": "32801", "city": "Orlando", "state": "FL", "app_name": "spark", "availability_score": 75},
        {"zip_code": "78201", "city": "San Antonio", "state": "TX", "app_name": "spark", "availability_score": 77},
        {"zip_code": "80202", "city": "Denver", "state": "CO", "app_name": "spark", "availability_score": 79},
        
        # DoorDash
        {"zip_code": "30301", "city": "Atlanta", "state": "GA", "app_name": "doordash", "availability_score": 88},
        {"zip_code": "89101", "city": "Las Vegas", "state": "NV", "app_name": "doordash", "availability_score": 84},
        {"zip_code": "33101", "city": "Miami", "state": "FL", "app_name": "doordash", "availability_score": 81},
        {"zip_code": "77001", "city": "Houston", "state": "TX", "app_name": "doordash", "availability_score": 86},
        {"zip_code": "85281", "city": "Tempe", "state": "AZ", "app_name": "doordash", "availability_score": 79},
        {"zip_code": "46201", "city": "Indianapolis", "state": "IN", "app_name": "doordash", "availability_score": 76},
        {"zip_code": "43201", "city": "Columbus", "state": "OH", "app_name": "doordash", "availability_score": 77},
        
        # Instacart
        {"zip_code": "90001", "city": "Los Angeles", "state": "CA", "app_name": "instacart", "availability_score": 90},
        {"zip_code": "94102", "city": "San Francisco", "state": "CA", "app_name": "instacart", "availability_score": 87},
        {"zip_code": "98101", "city": "Seattle", "state": "WA", "app_name": "instacart", "availability_score": 83},
        {"zip_code": "02101", "city": "Boston", "state": "MA", "app_name": "instacart", "availability_score": 80},
        {"zip_code": "60601", "city": "Chicago", "state": "IL", "app_name": "instacart", "availability_score": 85},
        {"zip_code": "19101", "city": "Philadelphia", "state": "PA", "app_name": "instacart", "availability_score": 78},
        {"zip_code": "92101", "city": "San Diego", "state": "CA", "app_name": "instacart", "availability_score": 82},
    ]
    
    for zc in initial_zip_codes:
        existing = await db.zip_codes.find_one({"zip_code": zc["zip_code"], "app_name": zc["app_name"]})
        if not existing:
            zip_code = ZipCode(**zc, expires_at=datetime.utcnow() + timedelta(days=7))
            await db.zip_codes.insert_one(zip_code.dict())
    
    # Seed guides
    initial_guides = [
        # Spark Driver Guides
        {
            "app_name": "spark",
            "title_en": "Step 1: Download Spark Driver App",
            "title_es": "Paso 1: Descargar la App Spark Driver",
            "content_en": "1. Open the App Store (iPhone) or Google Play Store (Android)\n2. Search for 'Spark Driver'\n3. Download and install the official Walmart Spark Driver app\n4. Make sure you have the latest version installed",
            "content_es": "1. Abra la App Store (iPhone) o Google Play Store (Android)\n2. Busque 'Spark Driver'\n3. Descargue e instale la aplicación oficial Walmart Spark Driver\n4. Asegúrese de tener la última versión instalada",
            "order": 1
        },
        {
            "app_name": "spark",
            "title_en": "Step 2: Create Your Account",
            "title_es": "Paso 2: Crear Su Cuenta",
            "content_en": "1. Open the Spark Driver app\n2. Tap 'Sign Up' or 'Get Started'\n3. Enter your email address and create a password\n4. Verify your email by clicking the link sent to your inbox\n5. Enter the zip code from our list when prompted for your delivery area",
            "content_es": "1. Abra la aplicación Spark Driver\n2. Toque 'Registrarse' o 'Comenzar'\n3. Ingrese su dirección de correo electrónico y cree una contraseña\n4. Verifique su correo haciendo clic en el enlace enviado a su bandeja de entrada\n5. Ingrese el código postal de nuestra lista cuando se le solicite su área de entrega",
            "order": 2
        },
        {
            "app_name": "spark",
            "title_en": "Step 3: Complete Background Check",
            "title_es": "Paso 3: Completar Verificación de Antecedentes",
            "content_en": "1. Provide your full legal name as it appears on your ID\n2. Enter your Social Security Number\n3. Provide your date of birth\n4. Enter your current address\n5. Consent to the background check\n6. Wait for approval (usually 3-7 business days)",
            "content_es": "1. Proporcione su nombre legal completo como aparece en su identificación\n2. Ingrese su Número de Seguro Social\n3. Proporcione su fecha de nacimiento\n4. Ingrese su dirección actual\n5. De su consentimiento para la verificación de antecedentes\n6. Espere la aprobación (generalmente 3-7 días hábiles)",
            "order": 3
        },
        {
            "app_name": "spark",
            "title_en": "Step 4: Upload Required Documents",
            "title_es": "Paso 4: Subir Documentos Requeridos",
            "content_en": "1. Valid Driver's License (front and back)\n2. Vehicle Registration\n3. Proof of Insurance\n4. Take a clear selfie for identity verification\n5. Ensure all documents are current and not expired",
            "content_es": "1. Licencia de Conducir válida (frente y reverso)\n2. Registro del Vehículo\n3. Comprobante de Seguro\n4. Tome una selfie clara para verificación de identidad\n5. Asegúrese de que todos los documentos estén vigentes y no expirados",
            "order": 4
        },
        
        # DoorDash Guides
        {
            "app_name": "doordash",
            "title_en": "Step 1: Download DoorDash Dasher App",
            "title_es": "Paso 1: Descargar la App DoorDash Dasher",
            "content_en": "1. Open the App Store (iPhone) or Google Play Store (Android)\n2. Search for 'DoorDash Dasher'\n3. Download the app (NOT the customer app)\n4. Make sure it's the Dasher app with the red icon",
            "content_es": "1. Abra la App Store (iPhone) o Google Play Store (Android)\n2. Busque 'DoorDash Dasher'\n3. Descargue la aplicación (NO la app de cliente)\n4. Asegúrese de que sea la app Dasher con el ícono rojo",
            "order": 1
        },
        {
            "app_name": "doordash",
            "title_en": "Step 2: Sign Up as a Dasher",
            "title_es": "Paso 2: Registrarse como Dasher",
            "content_en": "1. Open the Dasher app\n2. Tap 'Get Started' or 'Sign Up'\n3. Enter your email and phone number\n4. Create a secure password\n5. When asked for your location, use the zip code from our list\n6. Select your preferred vehicle type (car, bike, scooter)",
            "content_es": "1. Abra la aplicación Dasher\n2. Toque 'Comenzar' o 'Registrarse'\n3. Ingrese su correo electrónico y número de teléfono\n4. Cree una contraseña segura\n5. Cuando le pregunten su ubicación, use el código postal de nuestra lista\n6. Seleccione su tipo de vehículo preferido (auto, bicicleta, scooter)",
            "order": 2
        },
        {
            "app_name": "doordash",
            "title_en": "Step 3: Submit Required Information",
            "title_es": "Paso 3: Enviar Información Requerida",
            "content_en": "1. Enter your legal name and date of birth\n2. Provide your Social Security Number for background check\n3. Upload a photo of your driver's license\n4. If using a car, provide vehicle information\n5. Agree to the Independent Contractor Agreement",
            "content_es": "1. Ingrese su nombre legal y fecha de nacimiento\n2. Proporcione su Número de Seguro Social para verificación de antecedentes\n3. Suba una foto de su licencia de conducir\n4. Si usa un auto, proporcione información del vehículo\n5. Acepte el Acuerdo de Contratista Independiente",
            "order": 3
        },
        {
            "app_name": "doordash",
            "title_en": "Step 4: Set Up Payment",
            "title_es": "Paso 4: Configurar Pago",
            "content_en": "1. Add your bank account for direct deposits\n2. Or set up DasherDirect for instant pay\n3. Verify your banking information\n4. Wait for background check approval\n5. Once approved, you can start dashing!",
            "content_es": "1. Agregue su cuenta bancaria para depósitos directos\n2. O configure DasherDirect para pago instantáneo\n3. Verifique su información bancaria\n4. Espere la aprobación de la verificación de antecedentes\n5. Una vez aprobado, ¡puede comenzar a hacer entregas!",
            "order": 4
        },
        
        # Instacart Guides
        {
            "app_name": "instacart",
            "title_en": "Step 1: Download Instacart Shopper App",
            "title_es": "Paso 1: Descargar la App Instacart Shopper",
            "content_en": "1. Open the App Store (iPhone) or Google Play Store (Android)\n2. Search for 'Instacart Shopper'\n3. Download the Shopper app (green shopping bag icon)\n4. Do not confuse with the customer Instacart app",
            "content_es": "1. Abra la App Store (iPhone) o Google Play Store (Android)\n2. Busque 'Instacart Shopper'\n3. Descargue la app Shopper (ícono de bolsa de compras verde)\n4. No confunda con la aplicación de cliente Instacart",
            "order": 1
        },
        {
            "app_name": "instacart",
            "title_en": "Step 2: Create Shopper Account",
            "title_es": "Paso 2: Crear Cuenta de Shopper",
            "content_en": "1. Open the Instacart Shopper app\n2. Tap 'Become a Shopper'\n3. Enter your email address\n4. Create a password\n5. Enter the zip code from our list as your shopping zone\n6. Choose Full-Service Shopper (shop AND deliver)",
            "content_es": "1. Abra la aplicación Instacart Shopper\n2. Toque 'Convertirse en Shopper'\n3. Ingrese su dirección de correo electrónico\n4. Cree una contraseña\n5. Ingrese el código postal de nuestra lista como su zona de compras\n6. Elija Shopper de Servicio Completo (comprar Y entregar)",
            "order": 2
        },
        {
            "app_name": "instacart",
            "title_en": "Step 3: Complete Verification",
            "title_es": "Paso 3: Completar Verificación",
            "content_en": "1. Enter your full legal name\n2. Provide your date of birth\n3. Submit your Social Security Number\n4. Upload a clear photo of your driver's license\n5. Take a selfie for identity verification\n6. Consent to background check",
            "content_es": "1. Ingrese su nombre legal completo\n2. Proporcione su fecha de nacimiento\n3. Envíe su Número de Seguro Social\n4. Suba una foto clara de su licencia de conducir\n5. Tome una selfie para verificación de identidad\n6. Dé su consentimiento para la verificación de antecedentes",
            "order": 3
        },
        {
            "app_name": "instacart",
            "title_en": "Step 4: Complete Training & Start Shopping",
            "title_es": "Paso 4: Completar Entrenamiento y Comenzar a Comprar",
            "content_en": "1. Wait for background check approval (5-10 days)\n2. Once approved, complete the in-app tutorial\n3. Set up your payment method (instant cashout or weekly)\n4. Enable location services\n5. You're ready to start accepting batches!",
            "content_es": "1. Espere la aprobación de verificación de antecedentes (5-10 días)\n2. Una vez aprobado, complete el tutorial en la aplicación\n3. Configure su método de pago (retiro instantáneo o semanal)\n4. Habilite los servicios de ubicación\n5. ¡Está listo para comenzar a aceptar pedidos!",
            "order": 4
        },
        
        # Google Voice Guide
        {
            "app_name": "google_voice",
            "title_en": "Step 1: Download Google Voice",
            "title_es": "Paso 1: Descargar Google Voice",
            "content_en": "1. Open App Store (iPhone) or Google Play Store (Android)\n2. Search for 'Google Voice'\n3. Download and install the app\n4. You will need a Google account (Gmail)",
            "content_es": "1. Abra App Store (iPhone) o Google Play Store (Android)\n2. Busque 'Google Voice'\n3. Descargue e instale la aplicación\n4. Necesitará una cuenta de Google (Gmail)",
            "order": 1
        },
        {
            "app_name": "google_voice",
            "title_en": "Step 2: Set Up Google Voice",
            "title_es": "Paso 2: Configurar Google Voice",
            "content_en": "1. Open the Google Voice app\n2. Sign in with your Google account\n3. Tap 'Search' to find available phone numbers\n4. Enter a city or area code where you want your number\n5. Choose from the available numbers\n6. Tap 'Select' to claim your number",
            "content_es": "1. Abra la aplicación Google Voice\n2. Inicie sesión con su cuenta de Google\n3. Toque 'Buscar' para encontrar números de teléfono disponibles\n4. Ingrese una ciudad o código de área donde quiera su número\n5. Elija entre los números disponibles\n6. Toque 'Seleccionar' para reclamar su número",
            "order": 2
        },
        {
            "app_name": "google_voice",
            "title_en": "Step 3: Verify Your Number",
            "title_es": "Paso 3: Verificar Su Número",
            "content_en": "1. Google will ask to verify with your existing phone number\n2. Enter your current phone number\n3. You'll receive a verification code via text or call\n4. Enter the code to complete verification\n5. Your new Google Voice number is now active!",
            "content_es": "1. Google le pedirá verificar con su número de teléfono existente\n2. Ingrese su número de teléfono actual\n3. Recibirá un código de verificación por texto o llamada\n4. Ingrese el código para completar la verificación\n5. ¡Su nuevo número de Google Voice está ahora activo!",
            "order": 3
        },
        {
            "app_name": "google_voice",
            "title_en": "Step 4: Use Your New Number",
            "title_es": "Paso 4: Usar Su Nuevo Número",
            "content_en": "1. You can now make calls and send texts from Google Voice\n2. Use this number when signing up for gig apps\n3. Enable notifications to receive calls and texts\n4. You can use Google Voice on multiple devices\n5. The number is FREE and works anywhere with internet",
            "content_es": "1. Ahora puede hacer llamadas y enviar textos desde Google Voice\n2. Use este número al registrarse en apps de gig\n3. Habilite las notificaciones para recibir llamadas y textos\n4. Puede usar Google Voice en múltiples dispositivos\n5. El número es GRATIS y funciona donde haya internet",
            "order": 4
        },
    ]
    
    for guide in initial_guides:
        existing = await db.guides.find_one({"app_name": guide["app_name"], "order": guide["order"]})
        if not existing:
            guide_obj = Guide(**guide)
            await db.guides.insert_one(guide_obj.dict())
    
    # Seed terms
    existing_terms = await db.terms.find_one({"is_active": True})
    if not existing_terms:
        terms = TermsConditions(
            content_en=DEFAULT_TERMS_EN,
            content_es=DEFAULT_TERMS_ES,
            version="1.0"
        )
        await db.terms.insert_one(terms.dict())
    
    return {"message": "Initial data seeded successfully"}

# ============== MAIN ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "GIG ZipFinder API v1.0", "status": "active"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
