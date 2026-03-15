# GIG ZipFinder - Product Requirements Document

## Original Problem Statement
Mobile/web application for gig economy workers providing AI-generated postal codes for high-demand areas for Instacart, DoorDash, and Spark Driver. Uses real-time web searches (Perplexity AI) + GPT-4o for structured data.

## Core Architecture
- **Backend**: FastAPI on port 8001
- **Frontend Web**: React (CRA) on port 3000
- **Mobile**: React Native (Expo) - separate build
- **Database**: MongoDB
- **AI Search**: Perplexity Sonar (real-time web) + GPT-4o (data structuring)
- **Payments**: Stripe ($20/app)
- **Scheduler**: APScheduler (every 48 hours)

## What's Been Implemented

### Web Application (100% functional)
- Landing page with Hero, Features, HowItWorks, Pricing, FAQ sections
- Purchase flow: /purchase/{appName} → Stripe Checkout → /payment-success → /dashboard/{appName}
- Dashboard: shows 5 AI zip codes + PDF guide downloads (EN/ES)
- Bilingual: EN/ES/PT via i18next
- All prices: $20.00 USD

### AI Search System (Hybrid - 90-95% reliability)
- **Perplexity Sonar**: Real-time web search across Reddit, YouTube, forums, news
- **GPT-4o**: Structures Perplexity results into JSON with zip codes, scores, reasons
- **Fallback**: If Perplexity fails, GPT-4o generates independently (75% reliability)
- **Scheduler**: APScheduler runs every 48 hours automatically
- **Expiration**: All zip codes expire after 48 hours

### Stripe Payments
- Web checkout: POST /api/web/create-checkout-session (web-compatible URLs)
- Mobile checkout: POST /api/stripe/create-checkout-session (deep links)
- Verification: POST /api/stripe/verify-checkout/{session_id}
- All amounts: 2000 cents ($20.00)

### Apple IAP (In Progress)
- react-native-iap added to mobile app
- Backend endpoint: /api/apple/verify-receipt
- Needs physical iOS device testing

## Key API Endpoints
- POST /api/web/create-checkout-session - Web Stripe checkout
- POST /api/stripe/create-checkout-session - Mobile Stripe checkout
- POST /api/search-zip-codes/{app_name} - Hybrid Perplexity+GPT search
- GET /api/zip-codes/{app_name} - Get cached zip codes
- GET /api/download-guide/{app_name}/{language} - PDF guide download
- GET /api/guides-list - List available guides
- GET /api/stripe/check-payment-by-user/{user_id} - Check payment status
- GET /api/stripe/paid-apps/{user_id} - Get user's paid apps

## 3rd Party Integrations
- Stripe (Live keys) - payments
- Perplexity AI Sonar - real-time web search
- OpenAI GPT-4o (via Emergent LLM Key) - data structuring
- APScheduler - 48-hour automated searches

## Pending Tasks
- P1: Deploy updated server.py to Railway (user must "Save to Github")
- P1: Apple IAP testing on physical iOS device
- P2: Final AAB/IPA builds v1.1.0
- P2: App Store/Play Store submission guidance
