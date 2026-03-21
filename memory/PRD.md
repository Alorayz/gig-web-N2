# GIG ZipFinder - Product Requirements Document

## Original Problem Statement
Mobile/web app for gig economy workers providing AI-generated postal codes for high-demand areas for Instacart, DoorDash, and Spark Driver.

## Core Architecture
- **Backend**: FastAPI on port 8001 | **Frontend Web**: React (CRA) on port 3000
- **Mobile**: React Native (Expo) - separate build in /app/mobile-app
- **Database**: MongoDB Atlas | **AI**: Perplexity Sonar + GPT-4o | **Payments**: Stripe ($20/app) + Apple IAP
- **Scheduler**: APScheduler (every 48 hours for data refresh)

## What's Been Implemented

### Critical Bug Fix: Payment Flow (March 21, 2026)
- **Fixed**: Stripe API key expired → Updated to new key in backend
- **Fixed**: Payment completes but codes don't show → `paymentComplete` and `selectedApp` now persisted in AsyncStorage
- **Fixed**: No auto-verification after returning from Stripe browser → Added AppState listener for auto-verify
- **Fixed**: Results screen checked transient state instead of persistent purchases → Now checks `isAppActive()`
- **Added**: `.easignore` file to ensure credentials.json and keystore are included in EAS builds
- Build v1.1.3 (build 12, versionCode 18) with all fixes

### Apple IAP Compliance Fix (March 18, 2026)
- Removed `@stripe/stripe-react-native` from iOS build completely
- Added `expo-iap` plugin for native iOS In-App Purchase support
- Duration updated from 48h to 15 days across all mobile UI and backend IAP
- Build v1.1.3 (build 10) submitted to App Store for review

### Web UI/UX Overhaul (Previously completed)
- Fixed translations, uniform Lucide icons, real Visa/MC/Amex SVGs, real Apple/Google store badges
- Architecture diagram added to homepage

## IAP Product IDs (App Store Connect)
- `com.gigzipfinder.app.instacart_codes` - $20.00
- `com.gigzipfinder.app.doordash_codes` - $20.00
- `com.gigzipfinder.app.spark_codes` - $20.00

## Current Builds
- v1.1.3 (build 12, vC 18) - LATEST: Payment bug fixes + auto-verify
- v1.1.3 (build 10) - iOS: Submitted to Apple for review

## Pending Tasks
- P0: User to test APK on real Android device to verify payment flow works
- P0: Upload AAB to Google Play (certificate issue may still exist)
- P1: Wait for Apple review of iOS build
- P2: Deploy web changes to production (gigzipfinder.com)
- P2: Update Stripe key on Railway production backend

## Key API Endpoints
- POST /api/stripe/create-checkout-session - Create Stripe checkout
- GET /api/stripe/verify-checkout/{session_id} - Verify payment
- POST /api/iap/validate-receipt - Apple IAP validation
- GET /api/zip-codes/{app} - Get ZIP codes
- GET /api/guides/{app} - Get guides
- GET /api/iap/products - IAP products info

## Credentials
- Expo Token: _jv7XcUlfKJ32Ocm3VRdxhAmvwpNjaYzrxiUliUz
- Stripe keys updated March 21, 2026
- Perplexity API Key in backend .env
