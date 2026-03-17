# GIG ZipFinder - Product Requirements Document

## Original Problem Statement
Mobile/web app for gig economy workers providing AI-generated postal codes for high-demand areas for Instacart, DoorDash, and Spark Driver.

## Core Architecture
- **Backend**: FastAPI on port 8001 | **Frontend Web**: React (CRA) on port 3000
- **Mobile**: React Native (Expo) - separate build in /app/mobile-app
- **Database**: MongoDB | **AI**: Perplexity Sonar + GPT-4o | **Payments**: Stripe ($20/app) + Apple IAP
- **Scheduler**: APScheduler (every 48 hours)

## What's Been Implemented

### Apple IAP Compliance Fix (COMPLETED - March 17, 2026)
- Removed `@stripe/stripe-react-native` from app.json plugins AND package.json → Eliminates PassKit framework from iOS binary (fixes Guideline 2.1)
- Added `expo-iap` plugin for native iOS In-App Purchase support
- Rewrote `payment.tsx` with platform detection: Apple IAP on iOS, Stripe URL on Android (fixes Guideline 3.1.1)
- Added "Restore Purchases" button on iOS (Apple requirement)
- iOS shows Apple logo + "Comprar $20.00" / Android shows card icon + "Pagar $20.00"
- Backend `/api/iap/validate-receipt` endpoint verified working
- 3 IAP Product IDs: com.gigzipfinder.app.{instacart,doordash,spark}_codes
- **Build v1.1.2 (build 6) initiated**: https://expo.dev/accounts/alorayz1/projects/gig-zipfinder/builds/dfa4480b-931f-4566-9844-18062ffdb6f5

### Web UI/UX Overhaul (COMPLETED)
- Fixed translations, uniform Lucide icons, real Visa/MC/Amex SVGs, real Apple/Google store badges
- Official app logo, sidebar menu, install guide, all 3 languages

### Production (gig-web/) Files Updated
- Features.jsx: uniform icons | Pricing.jsx: $20 + real card logos | DownloadSection.jsx: real store logos

## IAP Product IDs (App Store Connect)
- `com.gigzipfinder.app.instacart_codes` - $20.00
- `com.gigzipfinder.app.doordash_codes` - $20.00
- `com.gigzipfinder.app.spark_codes` - $20.00

## Pending Tasks
- P0: Wait for iOS build to complete → download IPA → submit to App Store
- P1: Deploy web changes to production (user needs to connect GitHub to Emergent)
- P2: App Store Connect submission with Review Notes explaining IAP implementation
- P3: Test IAP on physical iOS device with Sandbox Apple ID
