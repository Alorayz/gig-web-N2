import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      // Header
      "nav.features": "Features",
      "nav.howItWorks": "How It Works",
      "nav.pricing": "Pricing",
      "nav.faq": "FAQ",
      "nav.downloadAPK": "Download APK",
      "nav.tagline": "Find Your Gig",
      "nav.download": "Download",
      "nav.buyNow": "Buy Now",
      "nav.home": "Home",
      
      // Hero
      "hero.badge": "Maximize your delivery earnings",
      "hero.title.find": "Find",
      "hero.title.zipCodes": "ZIP Codes",
      "hero.title.withAvailability": "with High Availability",
      "hero.description": "Our AI searches the web every 48 hours to suggest the best ZIP codes with availability on Instacart, DoorDash, and Spark Driver. Includes step-by-step guides.",
      "hero.conditions": "Terms and availability apply",
      "hero.cta.download": "Get Guides & ZIP Suggestions",
      "hero.cta.howItWorks": "How It Works",
      "hero.stats.scan": "AI Scan",
      "hero.stats.price": "Per App",
      "hero.stats.waitlist": "Waitlists",
      
      // Features
      "features.title.everything": "Everything You Need in",
      "features.title.oneApp": "One App",
      "features.subtitle": "GIG ZipFinder provides all the tools you need to succeed in delivery and gig economy",
      
      "features.ai.title": "AI Scans ZIP Codes",
      "features.ai.description": "Our artificial intelligence scans every 48 hours all ZIP codes in the United States with advanced parameters and algorithms to suggest availability. Due to high demand, we do not guarantee codes will remain open for long.",
      
      "features.phone.title": "We Teach You Free Number",
      "features.phone.description": "We teach you how to get a completely free phone number with no monthly fees that receives calls and text messages to register on all apps.",
      
      "features.guides.title": "Step-by-Step Guides",
      "features.guides.description": "We help you open gig applications step by step. Detailed instructions for Instacart, DoorDash, Spark Driver and more.",
      
      "features.instant.title": "Instant Suggestions",
      "features.instant.description": "Get immediate access to suggested ZIP codes with high availability and start working right away.",
      
      "features.immediate.title": "Immediate Results",
      "features.immediate.description": "Access suggested ZIP codes with high probability of availability and start working immediately without waitlists.",
      
      "features.secure.title": "Safe and Reliable",
      "features.secure.description": "All numbers and data are protected. We work with best security practices to keep your information private. We do not store or save payment or card data.",
      
      "features.maximize.title": "Maximize Earnings",
      "features.maximize.description": "Find the best opportunities in areas with highest demand and significantly increase your income.",
      
      "features.earnings.title": "Maximize Earnings",
      "features.earnings.description": "Find the best opportunities in areas with highest demand and significantly increase your income.",
      
      "features.apps": "Compatible Apps:",
      "features.moreComingSoon": "More coming soon",
      
      // How It Works
      "howItWorks.title": "How It",
      "howItWorks.title2": "Works",
      "howItWorks.subtitle": "In just 4 simple steps, you'll be ready to start working in the best areas",
      
      "howItWorks.step1.title": "Choose Your Gig App",
      "howItWorks.step1.description": "Visit our website and choose the gig app you want. Make a secure one-time payment of $20 via Stripe.",
      
      "howItWorks.step2.title": "Select Your Gig App",
      "howItWorks.step2.description": "Choose between Instacart, DoorDash or Spark Driver. Our AI has already scanned the best available ZIP codes.",
      
      "howItWorks.step3.title": "Follow Step-by-Step Guide",
      "howItWorks.step3.description": "Use our detailed guides and learn how to get a free phone number to complete your registration without problems.",
      
      "howItWorks.step4.title": "Start Earning",
      "howItWorks.step4.description": "Ready! Start working in areas with high availability and maximize your earnings from day one.",
      
      "howItWorks.badge": "Simple, fast and effective!",
      
      // Pricing
      "pricing.title": "Transparent",
      "pricing.title2": "Pricing",
      "pricing.subtitle": "$20 payment per app. No subscriptions. No surprises.",
      "pricing.launchOffer": "LAUNCH OFFER",
      "pricing.perApp": "Payment per App",
      "pricing.oneTime": "$20 payment • No monthly fees",
      "pricing.includes": "Your purchase includes:",
      
      "pricing.feature1": "Suggests you FREE 5 ZIP codes with high availability",
      "pricing.feature2": "Complete step-by-step guide to open account",
      "pricing.feature3": "We teach you how to get a free phone number",
      "pricing.feature4": "AI updates every 48 hours",
      "pricing.feature5": "Important disclaimer about availability",
      
      "pricing.secure": "Secure payment with Stripe",
      "pricing.secureDescription": "Secure payment processing. Your data is protected. We do not store or save payment or card data.",
      "pricing.cta": "Download and Start Now",
      "pricing.ctaSubtitle": "Free download • Pay only when you choose your app",
      "pricing.paymentMethods": "Accepted payment methods:",
      
      "pricing.cta": "Download and Start Now",
      "pricing.note": "Free download • Pay only when you choose your app",
      
      "pricing.methods": "Accepted payment methods:",
      
      // Download
      "download.title": "Download",
      "download.titleHighlight": "GIG ZipFinder",
      "download.subtitle": "Get immediate access to the best SUGGESTED ZIP codes and start maximizing your earnings today",
      "download.checking": "Checking availability...",
      "download.downloadAPK": "Download APK for Android",
      "download.apkNotAvailable": "APK Not Available",
      "download.apkComingSoon": "The APK has not been uploaded yet. Check back soon.",
      "download.comingSoon": "Coming Soon",
      "download.free": "Free",
      "download.freeDownload": "Free download",
      "download.userRating": "User rating",
      "download.fileSize": "File size",
      "download.requirements": "Requirements:",
      "download.requirementsText": "Android 8.0 or higher • iOS 13.0 or higher (coming soon)",
      "download.installGuide": "How to Install",
      
      // Install Guide
      "install.title": "How to Install",
      "install.titleHighlight": "GIG ZipFinder",
      "install.subtitle": "Follow these simple steps to install the app on your Android device",
      "install.videoTitle": "Video Tutorial",
      "install.videoSubtitle": "Watch this video if you prefer visual instructions",
      
      "install.step1.title": "Download the APK",
      "install.step1.description": "Tap the download button and wait for the file to finish downloading. You'll see a notification when it's complete.",
      "install.step1.tip": "The file will be saved in your Downloads folder",
      
      "install.step2.title": "Enable Unknown Sources",
      "install.step2.description": "Go to your phone's Settings > Security (or Privacy). Enable the option 'Install unknown apps' or 'Unknown sources' for your browser.",
      "install.step2.tip": "This allows installing apps from outside Google Play Store",
      "install.step2.detail1": "Open Settings on your phone",
      "install.step2.detail2": "Look for 'Security' or 'Privacy'",
      "install.step2.detail3": "Find 'Install unknown apps'",
      "install.step2.detail4": "Enable it for Chrome/Browser",
      
      "install.step3.title": "Locate the Downloaded File",
      "install.step3.description": "Open your file manager or downloads folder. Look for the file named 'GigZipFinder.apk' or similar.",
      "install.step3.tip": "You can also tap the download notification",
      
      "install.step4.title": "Install the Application",
      "install.step4.description": "Tap the APK file and press 'Install'. Wait a few seconds for the installation to complete.",
      "install.step4.tip": "If a warning appears, select 'Install anyway'",
      
      "install.step5.title": "Open GIG ZipFinder",
      "install.step5.description": "Once installed, tap 'Open' or find the app icon on your home screen. You're ready to start!",
      "install.step5.tip": "If you can't find it, check your app drawer",
      
      "install.troubleshooting.title": "Having Problems?",
      "install.troubleshooting.subtitle": "Common solutions to installation issues",
      
      "install.problem1.title": "Installation Blocked",
      "install.problem1.solution": "Make sure you've enabled 'Unknown sources' in Settings > Security. Some phones may require enabling it specifically for your browser (Chrome, Firefox, etc.).",
      
      "install.problem2.title": "Can't Find the Downloaded File",
      "install.problem2.solution": "Open your file manager and look in the 'Downloads' folder. You can also go to your browser's downloads menu (⋮ > Downloads).",
      
      "install.problem3.title": "App Won't Install",
      "install.problem3.solution": "Make sure you have at least 50 MB of free storage space. If the problem persists, try downloading the APK again.",
      
      "install.problem4.title": "Security Warning",
      "install.problem4.solution": "It's normal to see a warning when installing apps outside Google Play. GIG ZipFinder is safe. Select 'Install anyway' or 'More details' > 'Install anyway'.",
      
      "install.needHelp": "Still need help?",
      "install.contactUs": "Contact us at",
      "install.backToHome": "Back to Home",
      "install.downloadAgain": "Download APK Again",
      
      // FAQ
      "faq.title": "Frequently",
      "faq.title2": "Asked Questions",
      "faq.subtitle": "Everything you need to know about GIG ZipFinder",
      
      "faq.q1": "How does ZIP code scanning work?",
      "faq.a1": "Our artificial intelligence scans every 48 hours all ZIP codes in the United States using advanced parameters and algorithms. We analyze availability on Instacart, DoorDash and Spark Driver to suggest areas with highest probability of acceptance. However, due to high demand and constant changes in apps, we do not guarantee that suggested codes will remain available or work in all cases.",
      
      "faq.q2": "Is the phone number really free?",
      "faq.a2": "Yes! We teach you how to get a completely free phone number with no monthly fee. This number can receive calls and text messages (SMS), which is perfect for registering on all gig apps you need at no additional cost.",
      
      "faq.q3": "What does the step-by-step guide include?",
      "faq.a3": "Each guide includes detailed and specific instructions to open your account on the selected application (Instacart, DoorDash or Spark Driver). We show you exactly what information you need, how to fill each field, what documents to prepare, and we teach you how to get a free phone number. Plus, we suggest the best ZIP codes to use based on our AI analysis.",
      
      "faq.q4": "How much does GIG ZipFinder cost?",
      "faq.a4": "GIG ZipFinder costs $20.00 USD for each application you want to open. It's a one-time payment, no subscriptions or monthly fees. For that price you get: 5 suggested ZIP codes with high potential, complete step-by-step guide, we teach you how to get a free phone number, and access to our AI updates every 48 hours.",
      
      "faq.q5": "What apps does GIG ZipFinder work with?",
      "faq.a5": "Currently GIG ZipFinder is compatible with the three main delivery apps: Instacart (grocery shopping and delivery), DoorDash (food and grocery delivery), and Spark Driver (Walmart delivery service). We are working to add more apps soon.",
      
      "faq.q6": "Do I really avoid waitlists?",
      "faq.a6": "Our AI system identifies ZIP codes with high probability of immediate availability. While we cannot guarantee 100% acceptance (as apps constantly change their criteria and demand is high), our suggestions are based on continuous analysis. Results may vary and we do not guarantee that codes will remain open.",
      
      "faq.q7": "Is the app available for iOS and Android?",
      "faq.a7": "GIG ZipFinder is available on our website and as a mobile app for Android (Google Play) and iOS (App Store). You can purchase and access ZIP codes from any platform.",
      
      "faq.q8": "How is payment processed?",
      "faq.a8": "All payments are processed securely through Stripe, one of the world's most trusted payment processors. We accept Visa, Mastercard, and American Express. Your financial data is completely protected and encrypted. We do not store or save any payment or card information.",
      
      "faq.q9": "Can I use the same number for multiple apps?",
      "faq.a9": "Yes, the phone number we teach you how to get can be used to register on multiple applications. You will receive all necessary SMS and calls to complete the verification process on each one.",
      
      "faq.q10": "What if the ZIP code doesn't work?",
      "faq.a10": "Due to high demand and constant changes in delivery apps, we cannot guarantee that suggested ZIP codes will always be available or work in all cases. Our AI provides suggestions based on data analysis, but availability can change rapidly. We are a help tool, not partners with the mentioned apps.",
      
      "faq.stillQuestions": "Still have questions?",
      
      // Footer
      "footer.description": "The ultimate tool for gig workers. Find the best suggested ZIP codes with availability on Instacart, DoorDash and Spark Driver using artificial intelligence.",
      "footer.quickLinks": "Quick Links",
      "footer.supportedApps": "Supported Apps",
      "footer.moreComingSoon": "More coming soon",
      "footer.rights": "All rights reserved.",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.contact": "Contact",
      "footer.serving": "Serving gig workers across the United States",
      
      // Disclaimers
      "disclaimer.noGuarantee": "We do not guarantee availability. Suggestions based on AI analysis.",
      "disclaimer.notPartners": "We are not affiliated with or partners of Instacart, DoorDash, or Spark Driver. We are an independent help tool.",
      "disclaimer.highDemand": "Due to high demand, suggested ZIP codes may not remain open for long.",
      "disclaimer.noDataStorage": "We do not store or save payment data or credit card information."
    }
  },
  es: {
    translation: {
      // Header
      "nav.features": "Características",
      "nav.howItWorks": "Cómo Funciona",
      "nav.pricing": "Precios",
      "nav.faq": "FAQ",
      "nav.downloadAPK": "Descargar APK",
      "nav.tagline": "Encuentra tu Gig",
      "nav.download": "Descargar",
      "nav.buyNow": "Comprar Ahora",
      "nav.home": "Inicio",
      
      // Hero
      "hero.badge": "Maximiza tus ganancias en delivery",
      "hero.title.find": "Encuentra",
      "hero.title.zipCodes": "Códigos ZIP",
      "hero.title.withAvailability": "con Alta Disponibilidad",
      "hero.description": "Nuestra IA escanea cada 48 horas todo Estados Unidos para sugerir los mejores códigos postales con disponibilidad en Instacart, DoorDash y Spark Driver.",
      "hero.conditions": "Condiciones y disponibilidad aplican",
      "hero.cta.download": "Obtener guias y sugerencias ZIP",
      "hero.cta.howItWorks": "Cómo Funciona",
      "hero.stats.scan": "Escaneo IA",
      "hero.stats.price": "Por App",
      "hero.stats.waitlist": "Sugerencias",
      
      // Features
      "features.title.everything": "Todo lo que Necesitas en",
      "features.title.oneApp": "Una Sola App",
      "features.subtitle": "GIG ZipFinder te proporciona todas las herramientas necesarias para tener éxito en el mundo del delivery y gig economy",
      
      "features.ai.title": "IA Sugiere ZIP Codes",
      "features.ai.description": "Nuestra inteligencia artificial escanea cada 48 horas todos los códigos postales en Estados Unidos con parámetros y algoritmos avanzados para sugerir disponibilidad. Por la alta demanda, no garantizamos que los códigos duren abiertos mucho tiempo.",
      
      "features.phone.title": "Te Enseñamos Número Gratis",
      "features.phone.description": "Te enseñamos cómo obtener un número de teléfono completamente gratis sin mensualidades que recibe llamadas y mensajes de texto para registrarte en todas las apps.",
      
      "features.guides.title": "Guías Paso a Paso",
      "features.guides.description": "Te ayudamos a abrir aplicaciones de gig paso a paso. Instrucciones detalladas para Instacart, DoorDash, Spark Driver y más.",
      
      "features.instant.title": "Sugerencias Instantáneas",
      "features.instant.description": "Obtén acceso inmediato a códigos ZIP sugeridos con alta disponibilidad y comienza a trabajar de inmediato.",
      
      "features.immediate.title": "Sugerencias Inmediatas",
      "features.immediate.description": "Accede a códigos ZIP sugeridos con alta probabilidad de disponibilidad y comienza a trabajar inmediatamente.",
      
      "features.secure.title": "Seguro y Confiable",
      "features.secure.description": "Todos los números y datos están protegidos. Trabajamos con las mejores prácticas de seguridad para mantener tu información privada. No almacenamos ni guardamos datos de pago o tarjetas.",
      
      "features.maximize.title": "Maximiza Ganancias",
      "features.maximize.description": "Encuentra las mejores oportunidades en las zonas con mayor demanda y aumenta tus ingresos significativamente.",
      
      "features.earnings.title": "Maximiza Ganancias",
      "features.earnings.description": "Encuentra las mejores oportunidades en las zonas con mayor demanda y aumenta tus ingresos significativamente.",
      
      "features.apps": "Apps Compatibles:",
      "features.moreComingSoon": "Más próximamente",
      
      // How It Works
      "howItWorks.title": "Cómo",
      "howItWorks.title2": "Funciona",
      "howItWorks.subtitle": "En solo 4 pasos simples, estarás listo para empezar a trabajar en las mejores zonas",
      
      "howItWorks.step1.title": "Elige Tu App de Gig",
      "howItWorks.step1.description": "Visita nuestra página web y elige la app de gig que deseas. Realiza un pago único y seguro de $20 con Stripe.",
      
      "howItWorks.step2.title": "Selecciona tu App de Gig",
      "howItWorks.step2.description": "Elige entre Instacart, DoorDash o Spark Driver. Nuestra IA ya escaneó los mejores ZIP codes sugeridos.",
      
      "howItWorks.step3.title": "Sigue la Guía Paso a Paso",
      "howItWorks.step3.description": "Usa nuestras guías detalladas y aprende cómo obtener un número de teléfono gratuito para completar tu registro sin problemas.",
      
      "howItWorks.step4.title": "Comienza a Ganar",
      "howItWorks.step4.description": "¡Listo! Empieza a trabajar en zonas sugeridas con disponibilidad y maximiza tus ganancias desde el primer día.",
      
      "howItWorks.badge": "¡Simple, rápido y efectivo!",
      
      // Pricing
      "pricing.title": "Precios",
      "pricing.title2": "Transparentes",
      "pricing.subtitle": "Pago de $20 por app. Sin suscripciones. Sin sorpresas.",
      "pricing.launchOffer": "OFERTA DE LANZAMIENTO",
      "pricing.perApp": "Pago por App",
      "pricing.oneTime": "Pago de $20 • Sin rentas mensuales",
      "pricing.includes": "Tu compra incluye:",
      
      "pricing.feature1": "Te sugiere GRATIS 5 códigos postales con alta disponibilidad",
      "pricing.feature2": "Guía completa paso a paso para abrir cuenta",
      "pricing.feature3": "Te enseñamos cómo obtener un número de teléfono gratis",
      "pricing.feature4": "Actualizaciones de IA cada 48 horas",
      "pricing.feature5": "Aviso importante sobre disponibilidad",
      
      "pricing.secure": "Pago seguro con Stripe",
      "pricing.secureDescription": "Procesamiento seguro de pagos. Tus datos están protegidos. No almacenamos ni guardamos datos de pago o tarjetas.",
      "pricing.cta": "Descargar y Empezar Ahora",
      "pricing.ctaSubtitle": "Descarga gratis • Paga solo cuando elijas tu app",
      "pricing.paymentMethods": "Métodos de pago aceptados:",
      
      "pricing.cta": "Descargar y Empezar Ahora",
      "pricing.note": "Descarga gratis • Paga solo cuando elijas tu app",
      
      "pricing.methods": "Métodos de pago aceptados:",
      
      // Download
      "download.title": "Descarga",
      "download.titleHighlight": "GIG ZipFinder",
      "download.subtitle": "Obtén acceso inmediato a los mejores códigos ZIP SUGERIDOS y comienza a maximizar tus ganancias hoy mismo",
      "download.checking": "Verificando disponibilidad...",
      "download.downloadAPK": "Descargar APK para Android",
      "download.apkNotAvailable": "APK No Disponible",
      "download.apkComingSoon": "El APK aún no ha sido cargado. Vuelve pronto.",
      "download.comingSoon": "Próximamente",
      "download.free": "Gratis",
      "download.freeDownload": "Descarga gratuita",
      "download.userRating": "Calificación usuarios",
      "download.fileSize": "Tamaño de archivo",
      "download.requirements": "Requisitos:",
      "download.requirementsText": "Android 8.0 o superior • iOS 13.0 o superior (próximamente)",
      "download.installGuide": "Cómo Instalar",
      
      // Install Guide
      "install.title": "Cómo Instalar",
      "install.titleHighlight": "GIG ZipFinder",
      "install.subtitle": "Sigue estos sencillos pasos para instalar la aplicación en tu dispositivo Android",
      "install.videoTitle": "Video Tutorial",
      "install.videoSubtitle": "Mira este video si prefieres instrucciones visuales",
      
      "install.step1.title": "Descarga el APK",
      "install.step1.description": "Presiona el botón de descarga y espera a que el archivo termine de descargarse. Verás una notificación cuando esté completo.",
      "install.step1.tip": "El archivo se guardará en tu carpeta de Descargas",
      
      "install.step2.title": "Habilita Fuentes Desconocidas",
      "install.step2.description": "Ve a Ajustes de tu teléfono > Seguridad (o Privacidad). Activa la opción 'Instalar aplicaciones desconocidas' o 'Orígenes desconocidos' para tu navegador.",
      "install.step2.tip": "Esto permite instalar apps fuera de Google Play Store",
      "install.step2.detail1": "Abre Ajustes en tu teléfono",
      "install.step2.detail2": "Busca 'Seguridad' o 'Privacidad'",
      "install.step2.detail3": "Encuentra 'Instalar aplicaciones desconocidas'",
      "install.step2.detail4": "Actívalo para Chrome/Navegador",
      
      "install.step3.title": "Localiza el Archivo Descargado",
      "install.step3.description": "Abre tu administrador de archivos o carpeta de descargas. Busca el archivo llamado 'GigZipFinder.apk' o similar.",
      "install.step3.tip": "También puedes tocar la notificación de descarga",
      
      "install.step4.title": "Instala la Aplicación",
      "install.step4.description": "Toca el archivo APK y presiona 'Instalar'. Espera unos segundos a que se complete la instalación.",
      "install.step4.tip": "Si aparece una advertencia, selecciona 'Instalar de todas formas'",
      
      "install.step5.title": "Abre GIG ZipFinder",
      "install.step5.description": "Una vez instalado, presiona 'Abrir' o busca el ícono de la app en tu pantalla de inicio. ¡Listo para comenzar!",
      "install.step5.tip": "Si no la encuentras, revisa el cajón de aplicaciones",
      
      "install.troubleshooting.title": "¿Tienes Problemas?",
      "install.troubleshooting.subtitle": "Soluciones comunes a problemas de instalación",
      
      "install.problem1.title": "Instalación Bloqueada",
      "install.problem1.solution": "Asegúrate de haber habilitado 'Orígenes desconocidos' en Ajustes > Seguridad. Algunos teléfonos pueden requerir activarlo específicamente para tu navegador (Chrome, Firefox, etc.).",
      
      "install.problem2.title": "No Encuentro el Archivo Descargado",
      "install.problem2.solution": "Abre tu administrador de archivos y busca en la carpeta 'Descargas'. También puedes ir al menú de descargas de tu navegador (⋮ > Descargas).",
      
      "install.problem3.title": "La App No Se Instala",
      "install.problem3.solution": "Asegúrate de tener al menos 50 MB de espacio libre en tu almacenamiento. Si el problema persiste, intenta descargar el APK nuevamente.",
      
      "install.problem4.title": "Advertencia de Seguridad",
      "install.problem4.solution": "Es normal ver una advertencia al instalar apps fuera de Google Play. GIG ZipFinder es segura. Selecciona 'Instalar de todas formas' o 'Más detalles' > 'Instalar de todas formas'.",
      
      "install.needHelp": "¿Sigues necesitando ayuda?",
      "install.contactUs": "Contáctanos en",
      "install.backToHome": "Volver al Inicio",
      "install.downloadAgain": "Descargar APK de Nuevo",
      
      // FAQ
      "faq.title": "Preguntas",
      "faq.title2": "Frecuentes",
      "faq.subtitle": "Todo lo que necesitas saber sobre GIG ZipFinder",
      
      "faq.q1": "¿Cómo funciona el escaneo de códigos ZIP?",
      "faq.a1": "Nuestra inteligencia artificial escanea cada 48 horas todos los códigos postales en Estados Unidos utilizando parámetros y algoritmos avanzados. Analizamos la disponibilidad en Instacart, DoorDash y Spark Driver para sugerir las zonas con mayor probabilidad de aceptación. Sin embargo, debido a la alta demanda y cambios constantes en las apps, no garantizamos que los códigos sugeridos permanezcan disponibles o funcionen en todos los casos.",
      
      "faq.q2": "¿El número de teléfono es realmente gratis?",
      "faq.a2": "¡Sí! Te enseñamos cómo obtener un número de teléfono completamente gratuito sin ninguna renta mensual. Este número puede recibir llamadas y mensajes de texto (SMS), lo cual es perfecto para registrarte en todas las aplicaciones de gig que necesites sin costo adicional.",
      
      "faq.q3": "¿Qué incluye la guía paso a paso?",
      "faq.a3": "Cada guía incluye instrucciones detalladas y específicas para abrir tu cuenta en la aplicación seleccionada (Instacart, DoorDash o Spark Driver). Te mostramos exactamente qué información necesitas, cómo llenar cada campo, qué documentos preparar, y te enseñamos cómo obtener un número de teléfono gratis. Además, te sugerimos los mejores códigos ZIP para usar basados en nuestro análisis de IA.",
      
      "faq.q4": "¿Cuánto cuesta usar GIG ZipFinder?",
      "faq.a4": "GIG ZipFinder cuesta $20.00 USD por cada aplicación que desees abrir. Sin suscripciones ni rentas mensuales. Por ese precio obtienes: 5 códigos postales SUGERIDOS con alto potencial, guía completa paso a paso, te enseñamos cómo obtener un número de teléfono gratis, y acceso a actualizaciones de nuestra IA cada 48 horas.",
      
      "faq.q5": "¿En qué apps funciona GIG ZipFinder?",
      "faq.a5": "Actualmente GIG ZipFinder es compatible con las tres principales aplicaciones de delivery: Instacart (compras y entrega de comestibles), DoorDash (entrega de comida y abarrotes), y Spark Driver (servicio de entrega de Walmart). Estamos trabajando para agregar más aplicaciones próximamente.",
      
      "faq.q6": "¿Realmente evito las listas de espera?",
      "faq.a6": "Nuestro sistema de IA identifica códigos ZIP con alta probabilidad de disponibilidad inmediata. Si bien no podemos garantizar 100% de aceptación (ya que las apps cambian constantemente sus criterios y la demanda es alta), nuestras sugerencias se basan en análisis continuo. Los resultados pueden variar y no garantizamos que los códigos permanezcan abiertos.",
      
      "faq.q7": "¿La app está disponible para iOS y Android?",
      "faq.a7": "GIG ZipFinder está disponible en nuestra web y como app móvil para Android (Google Play) e iOS (App Store). Puedes comprar y acceder a los códigos ZIP desde cualquier plataforma.",
      
      "faq.q8": "¿Cómo se procesa el pago?",
      "faq.a8": "Todos los pagos se procesan de forma segura a través de Stripe, uno de los procesadores de pagos más confiables del mundo. Aceptamos Visa, Mastercard, y American Express. Tus datos financieros están completamente protegidos y encriptados. No almacenamos ni guardamos ninguna información de pago o tarjetas.",
      
      "faq.q9": "¿Puedo usar el mismo número para varias apps?",
      "faq.a9": "Sí, el número de teléfono que te enseñamos a obtener puede ser usado para registrarte en múltiples aplicaciones. Recibirás todos los SMS y llamadas necesarios para completar el proceso de verificación en cada una de ellas.",
      
      "faq.q10": "¿Qué pasa si el código ZIP no funciona?",
      "faq.a10": "Debido a la alta demanda y cambios constantes en las apps de delivery, no podemos garantizar que los códigos ZIP sugeridos siempre estarán disponibles o funcionarán en todos los casos. Nuestra IA proporciona sugerencias basadas en análisis de datos, pero la disponibilidad puede cambiar rápidamente. Somos una herramienta de ayuda, no socios de las apps mencionadas.",
      
      "faq.stillQuestions": "¿Aún tienes preguntas?",
      
      // Footer
      "footer.description": "La herramienta definitiva para gig workers. Encuentra los mejores códigos ZIP sugeridos con disponibilidad en Instacart, DoorDash y Spark Driver usando inteligencia artificial.",
      "footer.quickLinks": "Enlaces Rápidos",
      "footer.supportedApps": "Apps Soportadas",
      "footer.moreComingSoon": "Más próximamente",
      "footer.rights": "Todos los derechos reservados.",
      "footer.privacy": "Política de Privacidad",
      "footer.terms": "Términos de Servicio",
      "footer.contact": "Contacto",
      "footer.serving": "Sirviendo a gig workers en todo Estados Unidos",
      
      // Disclaimers
      "disclaimer.noGuarantee": "No garantizamos disponibilidad. Sugerencias basadas en análisis de IA.",
      "disclaimer.notPartners": "No somos afiliados ni socios de Instacart, DoorDash o Spark Driver. Somos una herramienta de ayuda independiente.",
      "disclaimer.highDemand": "Por la alta demanda, los códigos ZIP sugeridos pueden no durar abiertos mucho tiempo.",
      "disclaimer.noDataStorage": "No almacenamos ni guardamos datos de pago o información de tarjetas de crédito."
    }
  },
  pt: {
    translation: {
      // Header
      "nav.features": "Características",
      "nav.howItWorks": "Como Funciona",
      "nav.pricing": "Preços",
      "nav.faq": "FAQ",
      "nav.downloadAPK": "Baixar APK",
      "nav.tagline": "Encontre seu Gig",
      "nav.download": "Baixar",
      "nav.buyNow": "Comprar Agora",
      "nav.home": "Inicio",
      
      // Hero
      "hero.badge": "Maximize seus ganhos em delivery",
      "hero.title.find": "Encontre",
      "hero.title.zipCodes": "Códigos ZIP",
      "hero.title.withAvailability": "com Alta Disponibilidade",
      "hero.description": "Nossa IA escaneia a cada 48 horas todos os Estados Unidos para sugerir os melhores códigos postais com disponibilidade no Instacart, DoorDash e Spark Driver.",
      "hero.conditions": "Condições e disponibilidade aplicam",
      "hero.cta.download": "Obter guias e sugestoes ZIP",
      "hero.cta.howItWorks": "Como Funciona",
      "hero.stats.scan": "Scan IA",
      "hero.stats.price": "Por App",
      "hero.stats.waitlist": "Sugestões",
      
      // Features
      "features.title.everything": "Tudo que Você Precisa em",
      "features.title.oneApp": "Um Único App",
      "features.subtitle": "GIG ZipFinder fornece todas as ferramentas necessárias para ter sucesso no mundo do delivery e gig economy",
      
      "features.ai.title": "IA Sugere ZIP Codes",
      "features.ai.description": "Nossa inteligência artificial escaneia a cada 48 horas todos os códigos postais nos Estados Unidos com parâmetros e algoritmos avançados para sugerir disponibilidade. Devido à alta demanda, não garantimos que os códigos permanecerão abertos por muito tempo.",
      
      "features.phone.title": "Ensinamos Número Grátis",
      "features.phone.description": "Ensinamos como obter um número de telefone completamente grátis sem mensalidades que recebe chamadas e mensagens de texto para se registrar em todos os apps.",
      
      "features.guides.title": "Guias Passo a Passo",
      "features.guides.description": "Ajudamos você a abrir aplicativos de gig passo a passo. Instruções detalhadas para Instacart, DoorDash, Spark Driver e mais.",
      
      "features.instant.title": "Sugestões Instantâneas",
      "features.instant.description": "Obtenha acesso imediato a códigos ZIP sugeridos com alta disponibilidade e comece a trabalhar imediatamente.",
      
      "features.immediate.title": "Sugestões Imediatas",
      "features.immediate.description": "Acesse códigos ZIP sugeridos com alta probabilidade de disponibilidade e comece a trabalhar imediatamente.",
      
      "features.secure.title": "Seguro e Confiável",
      "features.secure.description": "Todos os números e dados estão protegidos. Trabalhamos com as melhores práticas de segurança para manter suas informações privadas. Não armazenamos nem guardamos dados de pagamento ou cartões.",
      
      "features.maximize.title": "Maximize Ganhos",
      "features.maximize.description": "Encontre as melhores oportunidades nas zonas com maior demanda e aumente sua renda significativamente.",
      
      "features.earnings.title": "Maximize Ganhos",
      "features.earnings.description": "Encontre as melhores oportunidades nas zonas com maior demanda e aumente sua renda significativamente.",
      
      "features.apps": "Apps Compatíveis:",
      "features.moreComingSoon": "Mais em breve",
      
      // How It Works
      "howItWorks.title": "Como",
      "howItWorks.title2": "Funciona",
      "howItWorks.subtitle": "Em apenas 4 passos simples, você estará pronto para começar a trabalhar nas melhores áreas",
      
      "howItWorks.step1.title": "Escolha Seu App de Gig",
      "howItWorks.step1.description": "Visite nosso site e escolha o app de gig que deseja. Faça um pagamento único e seguro de $20 via Stripe.",
      
      "howItWorks.step2.title": "Selecione seu App de Gig",
      "howItWorks.step2.description": "Escolha entre Instacart, DoorDash ou Spark Driver. Nossa IA já escaneou os melhores códigos ZIP sugeridos.",
      
      "howItWorks.step3.title": "Siga o Guia Passo a Passo",
      "howItWorks.step3.description": "Use nossos guias detalhados e aprenda como obter um número de telefone gratuito para completar seu registro sem problemas.",
      
      "howItWorks.step4.title": "Comece a Ganhar",
      "howItWorks.step4.description": "Pronto! Comece a trabalhar em zonas sugeridas com disponibilidade e maximize seus ganhos desde o primeiro dia.",
      
      "howItWorks.badge": "Simples, rápido e eficaz!",
      
      // Pricing
      "pricing.title": "Preços",
      "pricing.title2": "Transparentes",
      "pricing.subtitle": "Pagamento de $20 por app. Sem assinaturas. Sem surpresas.",
      "pricing.badge": "OFERTA DE LANÇAMENTO",
      "pricing.launchOffer": "OFERTA DE LANÇAMENTO",
      "pricing.perApp": "Pagamento por App",
      "pricing.oneTime": "Pagamento de $20 • Sem mensalidades",
      "pricing.includes": "Sua compra inclui:",
      
      "pricing.feature1": "Sugere GRÁTIS 5 códigos postais com alta disponibilidade",
      "pricing.feature2": "Guia completo passo a passo para abrir conta",
      "pricing.feature3": "Ensinamos como obter um número de telefone grátis",
      "pricing.feature4": "Atualizações de IA a cada 48 horas",
      "pricing.feature5": "Aviso importante sobre disponibilidade",
      
      "pricing.secure": "Pagamento seguro com Stripe",
      "pricing.secureDescription": "Processamento seguro de pagamentos. Seus dados estao protegidos. Nao armazenamos nem guardamos dados de pagamento ou cartoes.",
      
      "pricing.cta": "Baixar e Começar Agora",
      "pricing.note": "Download grátis • Pague apenas quando escolher seu app",
      "pricing.ctaSubtitle": "Download grátis • Pague apenas quando escolher seu app",
      "pricing.paymentMethods": "Métodos de pagamento aceitos:",
      
      "pricing.methods": "Métodos de pagamento aceitos:",
      
      // Download
      "download.title": "Baixe",
      "download.titleHighlight": "GIG ZipFinder",
      "download.subtitle": "Obtenha acesso imediato aos melhores códigos ZIP SUGERIDOS e comece a maximizar seus ganhos hoje mesmo",
      "download.checking": "Verificando disponibilidade...",
      "download.downloadAPK": "Baixar APK para Android",
      "download.apkNotAvailable": "APK Não Disponível",
      "download.apkComingSoon": "O APK ainda não foi carregado. Volte em breve.",
      "download.comingSoon": "Em Breve",
      "download.free": "Grátis",
      "download.freeDownload": "Download gratuito",
      "download.userRating": "Avaliação usuários",
      "download.fileSize": "Tamanho do arquivo",
      "download.requirements": "Requisitos:",
      "download.requirementsText": "Android 8.0 ou superior • iOS 13.0 ou superior (em breve)",
      "download.installGuide": "Como Instalar",
      
      // Install Guide
      "install.title": "Como Instalar",
      "install.titleHighlight": "GIG ZipFinder",
      "install.subtitle": "Siga estes passos simples para instalar o aplicativo no seu dispositivo Android",
      "install.videoTitle": "Vídeo Tutorial",
      "install.videoSubtitle": "Assista este vídeo se preferir instruções visuais",
      
      "install.step1.title": "Baixe o APK",
      "install.step1.description": "Toque no botão de download e aguarde até que o arquivo termine de baixar. Você verá uma notificação quando estiver completo.",
      "install.step1.tip": "O arquivo será salvo na sua pasta de Downloads",
      
      "install.step2.title": "Habilite Fontes Desconhecidas",
      "install.step2.description": "Vá em Configurações do seu telefone > Segurança (ou Privacidade). Ative a opção 'Instalar aplicativos desconhecidos' ou 'Fontes desconhecidas' para o seu navegador.",
      "install.step2.tip": "Isso permite instalar apps fora da Google Play Store",
      "install.step2.detail1": "Abra Configurações no seu telefone",
      "install.step2.detail2": "Procure 'Segurança' ou 'Privacidade'",
      "install.step2.detail3": "Encontre 'Instalar aplicativos desconhecidos'",
      "install.step2.detail4": "Ative para Chrome/Navegador",
      
      "install.step3.title": "Localize o Arquivo Baixado",
      "install.step3.description": "Abra seu gerenciador de arquivos ou pasta de downloads. Procure o arquivo chamado 'GigZipFinder.apk' ou similar.",
      "install.step3.tip": "Você também pode tocar na notificação de download",
      
      "install.step4.title": "Instale o Aplicativo",
      "install.step4.description": "Toque no arquivo APK e pressione 'Instalar'. Aguarde alguns segundos para que a instalação seja concluída.",
      "install.step4.tip": "Se aparecer um aviso, selecione 'Instalar mesmo assim'",
      
      "install.step5.title": "Abra GIG ZipFinder",
      "install.step5.description": "Uma vez instalado, pressione 'Abrir' ou procure o ícone do app na sua tela inicial. Pronto para começar!",
      "install.step5.tip": "Se não encontrar, verifique a gaveta de aplicativos",
      
      "install.troubleshooting.title": "Está com Problemas?",
      "install.troubleshooting.subtitle": "Soluções comuns para problemas de instalação",
      
      "install.problem1.title": "Instalação Bloqueada",
      "install.problem1.solution": "Certifique-se de ter habilitado 'Fontes desconhecidas' em Configurações > Segurança. Alguns telefones podem exigir ativá-lo especificamente para o seu navegador (Chrome, Firefox, etc.).",
      
      "install.problem2.title": "Não Consigo Encontrar o Arquivo Baixado",
      "install.problem2.solution": "Abra seu gerenciador de arquivos e procure na pasta 'Downloads'. Você também pode ir ao menu de downloads do seu navegador (⋮ > Downloads).",
      
      "install.problem3.title": "O App Não Instala",
      "install.problem3.solution": "Certifique-se de ter pelo menos 50 MB de espaço livre no armazenamento. Se o problema persistir, tente baixar o APK novamente.",
      
      "install.problem4.title": "Aviso de Segurança",
      "install.problem4.solution": "É normal ver um aviso ao instalar apps fora da Google Play. GIG ZipFinder é seguro. Selecione 'Instalar mesmo assim' ou 'Mais detalhes' > 'Instalar mesmo assim'.",
      
      "install.needHelp": "Ainda precisa de ajuda?",
      "install.contactUs": "Entre em contato em",
      "install.backToHome": "Voltar ao Início",
      "install.downloadAgain": "Baixar APK Novamente",
      
      // FAQ
      "faq.title": "Perguntas",
      "faq.title2": "Frequentes",
      "faq.subtitle": "Tudo que você precisa saber sobre GIG ZipFinder",
      
      "faq.q1": "Como funciona o escaneamento de códigos ZIP?",
      "faq.a1": "Nossa inteligência artificial escaneia a cada 48 horas todos os códigos postais nos Estados Unidos usando parâmetros e algoritmos avançados. Analisamos a disponibilidade no Instacart, DoorDash e Spark Driver para sugerir as áreas com maior probabilidade de aceitação. No entanto, devido à alta demanda e mudanças constantes nos apps, não garantimos que os códigos sugeridos permanecerão disponíveis ou funcionarão em todos os casos.",
      
      "faq.q2": "O número de telefone é realmente grátis?",
      "faq.a2": "Sim! Ensinamos como obter um número de telefone completamente gratuito sem nenhuma mensalidade. Este número pode receber chamadas e mensagens de texto (SMS), o que é perfeito para se registrar em todos os aplicativos de gig que você precisa sem custo adicional.",
      
      "faq.q3": "O que inclui o guia passo a passo?",
      "faq.a3": "Cada guia inclui instruções detalhadas e específicas para abrir sua conta no aplicativo selecionado (Instacart, DoorDash ou Spark Driver). Mostramos exatamente quais informações você precisa, como preencher cada campo, quais documentos preparar, e ensinamos como obter um número de telefone grátis. Além disso, sugerimos os melhores códigos ZIP para usar com base em nossa análise de IA.",
      
      "faq.q4": "Quanto custa usar GIG ZipFinder?",
      "faq.a4": "GIG ZipFinder custa $20.00 USD por cada aplicativo que você deseja abrir. É um pagamento único, sem assinaturas ou mensalidades. Por esse preço você obtém: 5 códigos postais sugeridos com alto potencial, guia completo passo a passo, ensinamos como obter um número de telefone grátis, e acesso a atualizações de nossa IA a cada 48 horas.",
      
      "faq.q5": "Em quais apps o GIG ZipFinder funciona?",
      "faq.a5": "Atualmente o GIG ZipFinder é compatível com os três principais aplicativos de delivery: Instacart (compras e entrega de mantimentos), DoorDash (entrega de comida e mantimentos) e Spark Driver (serviço de entrega do Walmart). Estamos trabalhando para adicionar mais aplicativos em breve.",
      
      "faq.q6": "Eu realmente evito as listas de espera?",
      "faq.a6": "Nosso sistema de IA identifica códigos ZIP com alta probabilidade de disponibilidade imediata. Embora não possamos garantir 100% de aceitação (já que os apps mudam constantemente seus critérios e a demanda é alta), nossas sugestões são baseadas em análise contínua. Os resultados podem variar e não garantimos que os códigos permanecerão abertos.",
      
      "faq.q7": "O app está disponível para iOS e Android?",
      "faq.a7": "GIG ZipFinder está disponível em nosso site e como app móvel para Android (Google Play) e iOS (App Store). Você pode comprar e acessar os códigos ZIP de qualquer plataforma.",
      
      "faq.q8": "Como o pagamento é processado?",
      "faq.a8": "Todos os pagamentos são processados com segurança através do Stripe, um dos processadores de pagamento mais confiáveis do mundo. Aceitamos Visa, Mastercard e American Express. Seus dados financeiros estão completamente protegidos e criptografados. Não armazenamos nem guardamos nenhuma informação de pagamento ou cartões.",
      
      "faq.q9": "Posso usar o mesmo número para vários apps?",
      "faq.a9": "Sim, o número de telefone que ensinamos como obter pode ser usado para se registrar em vários aplicativos. Você receberá todos os SMS e chamadas necessários para completar o processo de verificação em cada um deles.",
      
      "faq.q10": "E se o código ZIP não funcionar?",
      "faq.a10": "Devido à alta demanda e mudanças constantes nos apps de delivery, não podemos garantir que os códigos ZIP sugeridos sempre estarão disponíveis ou funcionarão em todos os casos. Nossa IA fornece sugestões baseadas em análise de dados, mas a disponibilidade pode mudar rapidamente. Somos uma ferramenta de ajuda, não parceiros dos apps mencionados.",
      
      "faq.stillQuestions": "Ainda tem perguntas?",
      
      // Footer
      "footer.description": "A ferramenta definitiva para gig workers. Encontre os melhores códigos ZIP sugeridos com disponibilidade no Instacart, DoorDash e Spark Driver usando inteligência artificial.",
      "footer.quickLinks": "Links Rápidos",
      "footer.supportedApps": "Apps Suportados",
      "footer.moreComingSoon": "Mais em breve",
      "footer.rights": "Todos os direitos reservados.",
      "footer.privacy": "Política de Privacidade",
      "footer.terms": "Termos de Serviço",
      "footer.contact": "Contato",
      "footer.serving": "Servindo gig workers em todos os Estados Unidos",
      
      // Disclaimers
      "disclaimer.noGuarantee": "Não garantimos disponibilidade. Sugestões baseadas em análise de IA.",
      "disclaimer.notPartners": "Não somos afiliados nem parceiros do Instacart, DoorDash ou Spark Driver. Somos uma ferramenta de ajuda independente.",
      "disclaimer.highDemand": "Devido à alta demanda, os códigos ZIP sugeridos podem não permanecer abertos por muito tempo.",
      "disclaimer.noDataStorage": "Não armazenamos nem guardamos dados de pagamento ou informações de cartões de crédito."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Always start in Spanish
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
