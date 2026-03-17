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
- Landing page with Hero, Features, HowItWorks, Pricing, DownloadApps, FAQ sections
- Purchase flow: /purchase/{appName} -> Stripe Checkout -> /payment-success -> /dashboard/{appName}
- Dashboard: shows 5 AI zip codes + PDF guide downloads (EN/ES)
- Trilingual: EN/ES/PT via i18next
- All prices: $20.00 USD

### UI/UX Overhaul (COMPLETED - March 15-17, 2026)
- Fixed broken translation keys (nav.download, nav.buyNow, nav.home) in ES and PT
- Added mobile sidebar menu with all nav items + "Comprar Ahora" purchase button
- Replaced emoji icons with uniform Lucide icons (ShoppingBag, Truck, Package) with gradient backgrounds
- Made pricing buy buttons use uniform ShoppingBag icons (centered)
- Expandable "Como Instalar el APK" guide with 5 steps + troubleshooting in 3 languages
- Fixed inconsistent translation keys across all 3 languages

### Brand Logo Overhaul (COMPLETED - March 17, 2026)
- Official app logo: MapPin icon with cyan-to-green gradient (matches production gigzipfinder.com)
- Real Visa SVG logo (blue #1434CB on white background)
- Real Mastercard SVG logo (red/orange overlapping circles on white background)
- Real American Express badge (white text on #006FCF blue background)
- Official Google Play store badge (4-color triangle SVG + "GET IT ON" on black)
- Official App Store badge (white Apple SVG + "Download on the" on black)
- Footer logo updated from broken image to consistent MapPin icon

### AI Search System (Hybrid - 90-95% reliability)
- **Perplexity Sonar**: Real-time web search across Reddit, YouTube, forums, news
- **GPT-4o**: Structures Perplexity results into JSON with zip codes, scores, reasons
- **Fallback**: If Perplexity fails, GPT-4o generates independently (75% reliability)
- **Scheduler**: APScheduler runs every 48 hours automatically

### Stripe Payments
- Web checkout: POST /api/web/create-checkout-session
- Mobile checkout: POST /api/stripe/create-checkout-session
- All amounts: 2000 cents ($20.00)

### Apple IAP (In Progress)
- Backend endpoint: /api/apple/verify-receipt
- Needs physical iOS device testing

## Key API Endpoints
- POST /api/web/create-checkout-session - Web Stripe checkout
- POST /api/stripe/create-checkout-session - Mobile Stripe checkout
- POST /api/search-zip-codes/{app_name} - Hybrid Perplexity+GPT search
- GET /api/zip-codes/{app_name} - Get cached zip codes
- GET /api/download-guide/{app_name}/{language} - PDF guide download

## Pending Tasks
- P1: Verify iOS (IPA) build status and deliver
- P2: Deployment guidance for production repository (Railway)
- P2: Apple IAP testing on physical iOS device
- P3: App Store/Play Store submission guidance

## Production Differences (gigzipfinder.com)
- Production still shows $5 price (needs code deployment)
- Production still uses emoji icons for apps (fixed in preview)
- Production payment cards invisible (fixed in preview with real SVGs)
