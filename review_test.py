#!/usr/bin/env python3
"""
Focused test for the exact endpoints mentioned in the review request
"""

import requests
import json
import pyotp
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://zipcode-gig-hub.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"🎯 Review Request Testing - GIG ZipFinder Backend")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"🔗 API Base: {API_BASE}")
print("=" * 80)

def test_endpoint(method, endpoint, data=None, expected_status=200, description=""):
    """Test a single endpoint and return results"""
    url = f"{API_BASE}{endpoint}"
    
    try:
        print(f"\n🧪 Testing: {method} {endpoint}")
        if description:
            print(f"   📝 {description}")
        
        if method.upper() == 'GET':
            response = requests.get(url, timeout=30)
        elif method.upper() == 'POST':
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url, json=data, headers=headers, timeout=30)
        else:
            print(f"   ❌ Unsupported method: {method}")
            return False
            
        print(f"   📊 Status: {response.status_code}")
        
        if response.status_code == expected_status:
            try:
                json_data = response.json()
                print(f"   ✅ SUCCESS - Valid JSON response")
                return json_data
            except:
                if response.headers.get('content-type', '').startswith('text/html'):
                    print(f"   ✅ SUCCESS - HTML response")
                    return True
                print(f"   ✅ SUCCESS - Non-JSON response")
                return True
        else:
            print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
            try:
                error_data = response.json()
                print(f"   🔍 Error: {error_data}")
            except:
                print(f"   🔍 Raw response: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⏰ TIMEOUT - Request took longer than 30 seconds")
        return False
    except requests.exceptions.ConnectionError:
        print(f"   🔌 CONNECTION ERROR - Could not connect to {url}")
        return False
    except Exception as e:
        print(f"   💥 EXCEPTION - {str(e)}")
        return False

def main():
    """Test the exact endpoints mentioned in the review request"""
    
    results = {}
    
    print("\n" + "="*80)
    print("🎯 CRITICAL ENDPOINTS FROM REVIEW REQUEST")
    print("="*80)
    
    # 1. Health Check: GET /api/health
    print(f"\n1️⃣  HEALTH CHECK")
    print("-" * 40)
    health_result = test_endpoint('GET', '/health', description="Health endpoint check")
    results['health_check'] = health_result is not False
    
    # 2. Zip Codes (must return DIFFERENT codes for each app)
    print(f"\n2️⃣  ZIP CODES BY APP (Must be DIFFERENT)")
    print("-" * 50)
    
    apps = ['spark', 'doordash', 'instacart']
    zip_codes_by_app = {}
    
    for app in apps:
        zip_result = test_endpoint('GET', f'/zip-codes/{app}', description=f"Get {app} zip codes")
        results[f'zip_codes_{app}'] = zip_result is not False
        
        if zip_result and isinstance(zip_result, list):
            zip_codes_by_app[app] = [item.get('zip_code') for item in zip_result if 'zip_code' in item]
            print(f"   📍 {app.upper()}: {len(zip_codes_by_app[app])} codes = {zip_codes_by_app[app]}")
    
    # Verify DIFFERENT zip codes requirement
    print(f"\n🔍 VERIFICATION: Different zip codes for each app")
    different_codes = True
    if len(zip_codes_by_app) >= 2:
        apps_list = list(zip_codes_by_app.keys())
        for i in range(len(apps_list)):
            for j in range(i+1, len(apps_list)):
                app1, app2 = apps_list[i], apps_list[j]
                common_codes = set(zip_codes_by_app[app1]) & set(zip_codes_by_app[app2])
                if common_codes:
                    print(f"   ❌ {app1} and {app2} SHARE zip codes: {common_codes}")
                    different_codes = False
                else:
                    print(f"   ✅ {app1} and {app2} have different zip codes")
    
    results['different_zip_codes'] = different_codes
    
    # 3. Guides for multiple apps
    print(f"\n3️⃣  GUIDES")
    print("-" * 20)
    
    guide_apps = ['spark', 'doordash', 'instacart', 'google_voice']
    for app in guide_apps:
        guide_result = test_endpoint('GET', f'/guides/{app}', description=f"Get {app} guides")
        results[f'guides_{app}'] = guide_result is not False
        
        if guide_result and isinstance(guide_result, list):
            print(f"   📚 {app.upper()}: {len(guide_result)} guides found")
    
    # 4. Privacy Policy: GET /api/privacy-policy.html
    print(f"\n4️⃣  PRIVACY POLICY")
    print("-" * 25)
    
    privacy_result = test_endpoint('GET', '/privacy-policy.html', description="Privacy Policy HTML")
    results['privacy_policy'] = privacy_result is not False
    
    # 5. Stripe Configuration: GET /api/stripe/config
    print(f"\n5️⃣  STRIPE CONFIGURATION")
    print("-" * 30)
    
    stripe_config_result = test_endpoint('GET', '/stripe/config', description="Get Stripe publishable key")
    results['stripe_config'] = stripe_config_result is not False
    
    if stripe_config_result and isinstance(stripe_config_result, dict):
        has_key = 'publishable_key' in stripe_config_result
        print(f"   🔑 Publishable key present: {'✅' if has_key else '❌'}")
        if has_key:
            key = stripe_config_result['publishable_key']
            print(f"   🔑 Key starts with: {key[:10]}...")
    
    # 6. Stripe Checkout Session: POST /api/stripe/create-checkout-session
    print(f"\n6️⃣  STRIPE CHECKOUT SESSION")
    print("-" * 35)
    
    checkout_data = {
        "user_id": "test_user_123",
        "app_name": "spark",
        "terms_accepted": True
    }
    
    checkout_result = test_endpoint('POST', '/stripe/create-checkout-session', 
                                  data=checkout_data, 
                                  description="Create checkout session")
    results['stripe_checkout'] = checkout_result is not False
    
    if checkout_result and isinstance(checkout_result, dict):
        has_url = 'checkout_url' in checkout_result
        has_session = 'session_id' in checkout_result
        print(f"   🔗 Checkout URL: {'✅' if has_url else '❌'}")
        print(f"   🆔 Session ID: {'✅' if has_session else '❌'}")
    
    # 7. Admin Login: POST /api/admin/login
    print(f"\n7️⃣  ADMIN LOGIN WITH 2FA")
    print("-" * 30)
    
    # Generate TOTP code using the known secret
    totp_secret = "GXMYOWV77JP4ONEAQRRBGK4PJHUTMKEO"
    totp = pyotp.TOTP(totp_secret)
    totp_code = totp.now()
    
    login_data = {
        "username": "admin",
        "password": "admin_password_123",
        "totp_code": totp_code
    }
    
    login_result = test_endpoint('POST', '/admin/login', 
                               data=login_data, 
                               description=f"Admin login with 2FA (TOTP: {totp_code})")
    results['admin_login'] = login_result is not False
    
    if login_result and isinstance(login_result, dict):
        has_token = 'token' in login_result
        print(f"   🎫 Token received: {'✅' if has_token else '❌'}")
    
    # 8. AI Search: POST /api/public/ai-search-zip-codes (or similar)
    print(f"\n8️⃣  AI SEARCH")
    print("-" * 20)
    
    # Try the actual AI search endpoint
    ai_search_data = {"app_name": "spark"}
    
    # First try the public endpoint mentioned in review
    ai_result = test_endpoint('POST', '/public/ai-search-zip-codes', 
                            data=ai_search_data, 
                            description="Public AI search for zip codes")
    
    if ai_result is False:
        # Try the actual endpoint from the server
        ai_result = test_endpoint('POST', '/search-zip-codes/spark', 
                                description="AI search for Spark zip codes")
    
    results['ai_search'] = ai_result is not False
    
    if ai_result and isinstance(ai_result, dict):
        zip_codes = ai_result.get('zip_codes', [])
        source = ai_result.get('source', 'unknown')
        print(f"   🤖 AI source: {source}")
        print(f"   📍 Zip codes returned: {len(zip_codes)}")
        if zip_codes and len(zip_codes) > 0:
            sample_codes = [z.get('zip_code') if isinstance(z, dict) else z for z in zip_codes[:3]]
            print(f"   🏷️  Sample codes: {sample_codes}")
    
    # SUMMARY
    print("\n" + "="*80)
    print("📊 REVIEW REQUEST TEST SUMMARY")
    print("="*80)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    failed_tests = total_tests - passed_tests
    
    print(f"\n📈 Results: {passed_tests}/{total_tests} tests passed")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    
    print(f"\n📋 Critical Findings:")
    
    # Critical failures
    critical_failures = []
    
    if not results.get('health_check', False):
        critical_failures.append("❌ Health Check endpoint failed")
    else:
        print("✅ Health Check endpoint working")
    
    if not results.get('different_zip_codes', False):
        critical_failures.append("❌ Zip codes are NOT different for each app (REQUIREMENT VIOLATION)")
    else:
        print("✅ All apps return different zip codes")
    
    if not results.get('stripe_checkout', False):
        critical_failures.append("❌ Stripe checkout session creation failed")
    else:
        print("✅ Stripe checkout session creation working")
    
    if not results.get('admin_login', False):
        critical_failures.append("❌ Admin login with 2FA failed")
    else:
        print("✅ Admin login with 2FA working")
    
    if not results.get('ai_search', False):
        critical_failures.append("❌ AI search endpoint failed")
    else:
        print("✅ AI search endpoint working")
    
    # Show all results
    print(f"\n📋 Detailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
    
    if critical_failures:
        print(f"\n🚨 CRITICAL ISSUES FOUND:")
        for issue in critical_failures:
            print(f"   {issue}")
        return 1
    else:
        print(f"\n🎉 All critical requirements are met!")
        return 0

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)