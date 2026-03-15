#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for GIG ZipFinder
Tests all critical endpoints as requested in the review.
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://zip-search-pro.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

print(f"🔍 Testing GIG ZipFinder Backend API")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"🔗 API Base: {API_BASE}")
print("=" * 60)

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
    """Run all critical endpoint tests"""
    
    results = {}
    
    # 1. Health Check
    print("\n" + "="*60)
    print("1️⃣  HEALTH CHECK")
    print("="*60)
    
    health_result = test_endpoint('GET', '/health', description="Basic health check")
    results['health'] = health_result is not False
    
    # 2. Seed Data
    print("\n" + "="*60)
    print("2️⃣  SEED INITIAL DATA")
    print("="*60)
    
    seed_result = test_endpoint('POST', '/seed-data', description="Initialize database with zip codes and guides")
    results['seed_data'] = seed_result is not False
    
    # 3. Zip Codes for Each App
    print("\n" + "="*60)
    print("3️⃣  ZIP CODES BY APP")
    print("="*60)
    
    apps = ['spark', 'doordash', 'instacart']
    zip_codes_by_app = {}
    
    for app in apps:
        zip_result = test_endpoint('GET', f'/zip-codes/{app}', description=f"Get {app} zip codes")
        results[f'zip_codes_{app}'] = zip_result is not False
        
        if zip_result and isinstance(zip_result, list):
            zip_codes_by_app[app] = [item.get('zip_code') for item in zip_result if 'zip_code' in item]
            print(f"   📍 Found {len(zip_codes_by_app[app])} zip codes for {app}")
            print(f"   🏷️  Codes: {zip_codes_by_app[app][:3]}{'...' if len(zip_codes_by_app[app]) > 3 else ''}")
    
    # Verify different zip codes for each app
    print(f"\n🔍 VERIFYING DIFFERENT ZIP CODES FOR EACH APP:")
    if len(zip_codes_by_app) >= 2:
        apps_list = list(zip_codes_by_app.keys())
        for i in range(len(apps_list)):
            for j in range(i+1, len(apps_list)):
                app1, app2 = apps_list[i], apps_list[j]
                common_codes = set(zip_codes_by_app[app1]) & set(zip_codes_by_app[app2])
                if common_codes:
                    print(f"   ⚠️  {app1} and {app2} share zip codes: {common_codes}")
                else:
                    print(f"   ✅ {app1} and {app2} have different zip codes")
    
    # 4. Guides
    print("\n" + "="*60)
    print("4️⃣  GUIDES")
    print("="*60)
    
    guides_result = test_endpoint('GET', '/guides/spark', description="Get Spark guides")
    results['guides'] = guides_result is not False
    
    if guides_result and isinstance(guides_result, list):
        print(f"   📚 Found {len(guides_result)} guides for Spark")
    
    # 5. Terms & Conditions
    print("\n" + "="*60)
    print("5️⃣  TERMS & CONDITIONS")
    print("="*60)
    
    terms_result = test_endpoint('GET', '/terms', description="Get terms and conditions")
    results['terms'] = terms_result is not False
    
    if terms_result and isinstance(terms_result, dict):
        has_en = 'content_en' in terms_result
        has_es = 'content_es' in terms_result
        print(f"   🇺🇸 English content: {'✅' if has_en else '❌'}")
        print(f"   🇪🇸 Spanish content: {'✅' if has_es else '❌'}")
    
    # 6. Stripe Configuration
    print("\n" + "="*60)
    print("6️⃣  STRIPE CONFIGURATION")
    print("="*60)
    
    stripe_config_result = test_endpoint('GET', '/stripe/config', description="Get Stripe publishable key")
    results['stripe_config'] = stripe_config_result is not False
    
    if stripe_config_result and isinstance(stripe_config_result, dict):
        has_key = 'publishable_key' in stripe_config_result
        print(f"   🔑 Publishable key present: {'✅' if has_key else '❌'}")
    
    # 7. Stripe Checkout Session
    print("\n" + "="*60)
    print("7️⃣  STRIPE CHECKOUT SESSION")
    print("="*60)
    
    checkout_data = {
        "user_id": "test123",
        "app_name": "spark",
        "terms_accepted": True
    }
    
    checkout_result = test_endpoint('POST', '/stripe/create-checkout-session', 
                                  data=checkout_data, 
                                  description="Create Stripe checkout session")
    results['stripe_checkout'] = checkout_result is not False
    
    if checkout_result and isinstance(checkout_result, dict):
        has_url = 'checkout_url' in checkout_result
        has_session = 'session_id' in checkout_result
        print(f"   🔗 Checkout URL: {'✅' if has_url else '❌'}")
        print(f"   🆔 Session ID: {'✅' if has_session else '❌'}")
    
    # 8. Paid Apps Check
    print("\n" + "="*60)
    print("8️⃣  PAID APPS CHECK")
    print("="*60)
    
    paid_apps_result = test_endpoint('GET', '/stripe/paid-apps/test123', description="Check paid apps for user")
    results['paid_apps'] = paid_apps_result is not False
    
    if paid_apps_result and isinstance(paid_apps_result, dict):
        paid_apps = paid_apps_result.get('paid_apps', [])
        print(f"   💳 Paid apps count: {len(paid_apps)}")
        print(f"   📱 Apps: {paid_apps}")
    
    # 9. AI Search for Zip Codes
    print("\n" + "="*60)
    print("9️⃣  AI SEARCH FOR ZIP CODES")
    print("="*60)
    
    ai_search_result = test_endpoint('POST', '/search-zip-codes/spark', description="AI search for Spark zip codes")
    results['ai_search'] = ai_search_result is not False
    
    if ai_search_result and isinstance(ai_search_result, dict):
        zip_codes = ai_search_result.get('zip_codes', [])
        source = ai_search_result.get('source', 'unknown')
        print(f"   🤖 AI search source: {source}")
        print(f"   📍 Zip codes returned: {len(zip_codes)}")
        if zip_codes and len(zip_codes) > 0:
            print(f"   🏷️  Sample codes: {[z.get('zip_code') for z in zip_codes[:3]]}")
    
    # 10. Admin Rotation Check
    print("\n" + "="*60)
    print("🔟 ADMIN ROTATION CHECK")
    print("="*60)
    
    rotation_result = test_endpoint('GET', '/admin/check-rotation', description="Check zip code rotation status")
    results['admin_rotation'] = rotation_result is not False
    
    if rotation_result and isinstance(rotation_result, dict):
        current_week = rotation_result.get('current_week_set')
        last_rotation = rotation_result.get('last_rotation')
        print(f"   📅 Current week set: {current_week}")
        print(f"   🔄 Last rotation: {last_rotation}")
    
    # SUMMARY
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    failed_tests = total_tests - passed_tests
    
    print(f"\n📈 Results: {passed_tests}/{total_tests} tests passed")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    
    print(f"\n📋 Detailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
    
    # Critical Issues Check
    critical_failures = []
    if not results.get('health', False):
        critical_failures.append("Health check failed")
    if not results.get('seed_data', False):
        critical_failures.append("Seed data failed")
    if not results.get('stripe_checkout', False):
        critical_failures.append("Stripe checkout failed")
    
    if critical_failures:
        print(f"\n🚨 CRITICAL ISSUES:")
        for issue in critical_failures:
            print(f"   ❌ {issue}")
    else:
        print(f"\n🎉 All critical endpoints are working!")
    
    # Return exit code based on results
    if failed_tests > 0:
        print(f"\n⚠️  Some tests failed. Check the details above.")
        return 1
    else:
        print(f"\n🎯 All tests passed successfully!")
        return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)