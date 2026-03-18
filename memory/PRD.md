# GIG ZipFinder - Product Requirements Document

## Original Problem Statement
Mobile/web app for gig economy workers providing AI-generated postal codes for high-demand areas for Instacart, DoorDash, and Spark Driver.

## Core Architecture
- **Backend**: FastAPI on port 8001 | **Frontend Web**: React (CRA) on port 3000
- **Mobile**: React Native (Expo) - separate build in /app/mobile-app
- **Database**: MongoDB | **AI**: Perplexity Sonar + GPT-4o | **Payments**: Stripe ($20/app) + Apple IAP
- **Scheduler**: APScheduler (every 48 hours)

## What's Been Implemented

### Apple IAP Compliance Fix (COMPLETED - March 18, 2026)
- Removed `@stripe/stripe-react-native` from iOS build completely
- Added `expo-iap` plugin for native iOS In-App Purchase support
- Rewrote `payment.tsx` with platform detection: Apple IAP on iOS, Stripe URL on Android
- Added "Restore Purchases" button on iOS (Apple requirement)
- iOS shows Apple logo + "Purchase $20.00" / Android shows card icon + "Pay $20.00"
- Backend `/api/iap/validate-receipt` endpoint verified working with 15-day access
- 3 IAP Product IDs: com.gigzipfinder.app.{instacart,doordash,spark}_codes
- **Duration updated from 48h to 15 days** across all mobile UI and backend IAP
- **Build v1.1.3 (build 10)** submitted to App Store for review

### Web UI/UX Overhaul (COMPLETED)
- Fixed translations, uniform Lucide icons, real Visa/MC/Amex SVGs, real Apple/Google store badges
- Official app logo, sidebar menu, install guide, all 3 languages
- Architecture diagram added to homepage

### Production (gig-web/) Files Updated
- Features.jsx: uniform icons | Pricing.jsx: $20 + real card logos | DownloadSection.jsx: real store logos

## IAP Product IDs (App Store Connect)
- `com.gigzipfinder.app.instacart_codes` - $20.00
- `com.gigzipfinder.app.doordash_codes` - $20.00
- `com.gigzipfinder.app.spark_codes` - $20.00

## Builds History
- v1.1.3 (build 10) - LATEST: App Store IPA + Simulator, 15 days access text
- v1.1.3 (build 9) - Previous: Had 48h text still in some places
- v1.1.0 (build 8) - Rejected version number (lower than existing 1.1.2)

## Pending Tasks
- P0: Wait for Apple review of v1.1.3 build 10
- P1: Deploy web changes to production (user needs to push gig-web/ to their repo)
- P2: Test IAP on physical iOS device with Sandbox Apple ID (via TestFlight)
- P3: Update web frontend "48h" references if user wants consistency with mobile 15-day messaging
