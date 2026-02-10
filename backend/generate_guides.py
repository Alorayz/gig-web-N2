#!/usr/bin/env python3
"""
GIG ZipFinder - PDF Guide Generator
Professional PDF guides with logo colors, QR codes for app stores, and web footer.
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas
from datetime import datetime
import os
import qrcode
import io

# Brand colors from logo
NAVY_BLUE = colors.HexColor('#1a2a4a')      # Primary dark blue
CYAN_ACCENT = colors.HexColor('#00b4d8')     # Cyan arrow/accent
LIGHT_CYAN = colors.HexColor('#48cae4')      # Light cyan
DARK_BG = colors.HexColor('#0d1525')         # Dark background
SILVER = colors.HexColor('#a8b2c1')          # Silver/gray
WHITE = colors.HexColor('#ffffff')
LIGHT_GRAY = colors.HexColor('#f0f4f8')

# Logo path
LOGO_PATH = '/app/frontend/assets/images/logo_pdf.png'

# App URLs
APP_WEB_URL = "www.gigzipfinder.com"
PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.gigzipfinder.app"
APP_STORE_URL = "https://apps.apple.com/app/gig-zipfinder/id123456789"

def generate_qr_code(url, size=100):
    """Generate QR code image for URL"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="#1a2a4a", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    return buffer

def create_styles():
    """Create custom styles matching logo colors"""
    styles = getSampleStyleSheet()
    
    # Main title - Navy blue
    styles.add(ParagraphStyle(
        name='MainTitle',
        parent=styles['Heading1'],
        fontSize=32,
        textColor=NAVY_BLUE,
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Subtitle - Cyan accent
    styles.add(ParagraphStyle(
        name='SubTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=CYAN_ACCENT,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Section title - Navy blue
    styles.add(ParagraphStyle(
        name='SectionTitle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=NAVY_BLUE,
        spaceBefore=25,
        spaceAfter=12,
        fontName='Helvetica-Bold',
        borderPadding=(0, 0, 5, 0),
    ))
    
    # Step title - Cyan
    styles.add(ParagraphStyle(
        name='StepTitle',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=CYAN_ACCENT,
        spaceBefore=15,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    ))
    
    # Body text - Dark gray
    styles.add(ParagraphStyle(
        name='CustomBodyText',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#333333'),
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        leading=16
    ))
    
    # Bullet points
    styles.add(ParagraphStyle(
        name='BulletPoint',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#444444'),
        leftIndent=25,
        spaceAfter=6,
        leading=15,
        bulletIndent=10,
    ))
    
    # Important note - with cyan background
    styles.add(ParagraphStyle(
        name='ImportantNote',
        parent=styles['Normal'],
        fontSize=11,
        textColor=NAVY_BLUE,
        backColor=colors.HexColor('#e0f7fa'),
        borderPadding=12,
        spaceBefore=10,
        spaceAfter=10,
        leading=16
    ))
    
    # Footer text
    styles.add(ParagraphStyle(
        name='FooterText',
        parent=styles['Normal'],
        fontSize=9,
        textColor=SILVER,
        alignment=TA_CENTER
    ))
    
    # Web URL style
    styles.add(ParagraphStyle(
        name='WebURL',
        parent=styles['Normal'],
        fontSize=12,
        textColor=CYAN_ACCENT,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Tip style
    styles.add(ParagraphStyle(
        name='TipText',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#2e7d32'),
        leftIndent=25,
        spaceAfter=5,
        leading=14
    ))
    
    return styles

# ============== ENHANCED GUIDE CONTENT ==============

SPARK_GUIDE = {
    'en': {
        'title': 'Spark Driver',
        'subtitle': 'Complete Account Opening Guide',
        'platform': 'Walmart Delivery Service',
        'intro': '''Welcome to your comprehensive guide for becoming a Spark Driver! Spark Driver is Walmart's official delivery platform that allows you to earn money delivering groceries, household items, and more from Walmart stores directly to customers' homes. This guide will walk you through every step of the registration process to ensure your application is successful.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Must be at least 18 years old',
                'Valid U.S. driver\'s license (not expired)',
                'Smartphone with iOS 14+ or Android 8+ operating system',
                'Reliable vehicle in good working condition (car, van, or truck)',
                'Valid auto insurance with your name on the policy',
                'Clean background check (no serious violations)',
                'Social Security Number for tax purposes',
                'Bank account for direct deposit payments',
                'Ability to lift packages up to 50 lbs'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the Spark Driver App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android) on your smartphone',
                    'In the search bar, type "Spark Driver" - make sure it\'s the official app by DDI (Delivery Drivers, Inc.)',
                    'Look for the app with the yellow Spark logo on a blue background',
                    'Tap "Download" or "Install" and wait for the installation to complete',
                    'Once installed, tap "Open" to launch the Spark Driver app',
                    'IMPORTANT: Do NOT download the regular "Walmart" customer app - you need "Spark Driver" specifically'
                ],
                'tip': 'Make sure you have at least 200MB of free storage space on your phone before downloading.'
            },
            {
                'title': 'Step 2: Create Your Driver Account',
                'content': [
                    'Open the Spark Driver app and tap "Sign Up" or "Get Started"',
                    'Enter your personal email address - use one you check regularly as Spark will send important updates',
                    'Create a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols',
                    'Enter your mobile phone number for verification - you\'ll receive a code via SMS',
                    'Check your phone for the verification code and enter it in the app',
                    'CRITICAL: When asked for your delivery zone or service area, enter one of the ZIP CODES provided by GIG ZipFinder',
                    'This is the most important step - using an open zip code increases your approval chances significantly'
                ],
                'tip': 'Use the zip code from our list that is closest to your actual location for best results.'
            },
            {
                'title': 'Step 3: Enter Your Personal Information',
                'content': [
                    'Enter your FULL LEGAL NAME exactly as it appears on your driver\'s license (including middle name)',
                    'Enter your date of birth in MM/DD/YYYY format',
                    'Provide your Social Security Number (SSN) - this is required for tax reporting (1099)',
                    'Enter your complete current residential address including apartment/unit number if applicable',
                    'This address should match what\'s on your driver\'s license for faster verification',
                    'Double-check all information before proceeding - errors can delay your approval'
                ],
                'tip': 'Your SSN is securely encrypted and only used for background check and tax purposes.'
            },
            {
                'title': 'Step 4: Upload Required Documents',
                'content': [
                    'Take a clear, well-lit photo of the FRONT of your driver\'s license',
                    'Take a clear photo of the BACK of your driver\'s license',
                    'Photograph your vehicle registration card (must show current/valid dates)',
                    'Photograph your auto insurance card - ensure coverage dates and your name are visible',
                    'Take a selfie for identity verification - face the camera directly with good lighting',
                    'Make sure all photos are in focus with no glare, shadows, or cut-off edges',
                    'All four corners of each document must be visible in the photo'
                ],
                'tip': 'Natural daylight works best for document photos. Avoid using flash which can cause glare.'
            },
            {
                'title': 'Step 5: Complete Vehicle Information',
                'content': [
                    'Enter your vehicle make (manufacturer) - e.g., Toyota, Honda, Ford, Chevrolet',
                    'Enter your vehicle model - e.g., Camry, Civic, F-150, Malibu',
                    'Enter the vehicle year (must be 1997 or newer in most markets)',
                    'Select your vehicle color from the dropdown menu',
                    'Enter your license plate number exactly as it appears (including any dashes or spaces)',
                    'Confirm your vehicle has 4 doors (2-door vehicles may not be accepted)',
                    'Verify your vehicle can safely transport grocery orders and large items'
                ],
                'tip': 'Your vehicle information must match your registration documents exactly.'
            },
            {
                'title': 'Step 6: Background Check & Activation',
                'content': [
                    'Review all the information you\'ve entered one final time for accuracy',
                    'Read and accept the Independent Contractor Agreement carefully',
                    'Consent to the background check conducted by Checkr',
                    'The background check reviews your driving record (MVR) and criminal history',
                    'Most background checks are completed within 3-7 business days',
                    'You\'ll receive an email notification when your account is approved',
                    'Once approved, complete the quick in-app tutorial to start receiving delivery offers!',
                    'Download the Spark Driver Guidebook from the app for best practices'
                ],
                'tip': 'Check your spam/junk folder if you don\'t see emails from Spark within a week.'
            }
        ],
        'tips': {
            'title': 'Pro Tips for Spark Driver Success',
            'items': [
                'Start during peak hours (8-11 AM and 4-8 PM) for more delivery opportunities',
                'Maintain a high acceptance rate to receive better-paying orders',
                'Keep your car clean and organized for efficient deliveries',
                'Communicate with customers through the app if there are any delays',
                'Take photos of delivered items at the door for proof of delivery',
                'Weekends and holidays typically have the highest demand',
                'Check the app frequently as new orders appear quickly'
            ]
        }
    },
    'es': {
        'title': 'Spark Driver',
        'subtitle': 'Guía Completa de Apertura de Cuenta',
        'platform': 'Servicio de Entregas de Walmart',
        'intro': '''¡Bienvenido a tu guía completa para convertirte en Spark Driver! Spark Driver es la plataforma oficial de entregas de Walmart que te permite ganar dinero entregando comestibles, artículos para el hogar y más desde las tiendas Walmart directamente a los hogares de los clientes. Esta guía te llevará a través de cada paso del proceso de registro para asegurar que tu solicitud sea exitosa.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Licencia de conducir válida de EE.UU. (no expirada)',
                'Smartphone con sistema operativo iOS 14+ o Android 8+',
                'Vehículo confiable en buenas condiciones (auto, van o camioneta)',
                'Seguro de auto válido con tu nombre en la póliza',
                'Verificación de antecedentes limpia (sin violaciones graves)',
                'Número de Seguro Social para propósitos fiscales',
                'Cuenta bancaria para pagos por depósito directo',
                'Capacidad para cargar paquetes de hasta 50 libras'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Spark Driver',
                'content': [
                    'Abre la App Store (iPhone) o Google Play Store (Android) en tu smartphone',
                    'En la barra de búsqueda, escribe "Spark Driver" - asegúrate de que sea la app oficial de DDI',
                    'Busca la app con el logo amarillo de Spark sobre fondo azul',
                    'Toca "Descargar" o "Instalar" y espera a que se complete la instalación',
                    'Una vez instalada, toca "Abrir" para iniciar la app Spark Driver',
                    'IMPORTANTE: NO descargues la app regular de "Walmart" de cliente - necesitas específicamente "Spark Driver"'
                ],
                'tip': 'Asegúrate de tener al menos 200MB de espacio libre en tu teléfono antes de descargar.'
            },
            {
                'title': 'Paso 2: Crear Tu Cuenta de Conductor',
                'content': [
                    'Abre la app Spark Driver y toca "Registrarse" o "Comenzar"',
                    'Ingresa tu dirección de correo electrónico personal - usa uno que revises regularmente',
                    'Crea una contraseña segura con al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos',
                    'Ingresa tu número de teléfono móvil para verificación - recibirás un código por SMS',
                    'Revisa tu teléfono para el código de verificación e ingrésalo en la app',
                    'CRÍTICO: Cuando te pregunten por tu zona de entrega, ingresa uno de los CÓDIGOS POSTALES proporcionados por GIG ZipFinder',
                    'Este es el paso más importante - usar un código postal abierto aumenta significativamente tus posibilidades de aprobación'
                ],
                'tip': 'Usa el código postal de nuestra lista más cercano a tu ubicación real para mejores resultados.'
            },
            {
                'title': 'Paso 3: Ingresar Tu Información Personal',
                'content': [
                    'Ingresa tu NOMBRE LEGAL COMPLETO exactamente como aparece en tu licencia de conducir (incluyendo segundo nombre)',
                    'Ingresa tu fecha de nacimiento en formato MM/DD/AAAA',
                    'Proporciona tu Número de Seguro Social (SSN) - esto es requerido para reportes fiscales (1099)',
                    'Ingresa tu dirección residencial actual completa incluyendo número de apartamento si aplica',
                    'Esta dirección debe coincidir con la de tu licencia de conducir para verificación más rápida',
                    'Verifica toda la información antes de continuar - los errores pueden retrasar tu aprobación'
                ],
                'tip': 'Tu SSN está encriptado de forma segura y solo se usa para verificación de antecedentes y propósitos fiscales.'
            },
            {
                'title': 'Paso 4: Subir Documentos Requeridos',
                'content': [
                    'Toma una foto clara y bien iluminada del FRENTE de tu licencia de conducir',
                    'Toma una foto clara del REVERSO de tu licencia de conducir',
                    'Fotografía tu tarjeta de registro vehicular (debe mostrar fechas actuales/válidas)',
                    'Fotografía tu tarjeta de seguro de auto - asegúrate de que las fechas de cobertura y tu nombre sean visibles',
                    'Toma una selfie para verificación de identidad - mira directamente a la cámara con buena iluminación',
                    'Asegúrate de que todas las fotos estén en foco sin reflejos, sombras o bordes cortados',
                    'Las cuatro esquinas de cada documento deben ser visibles en la foto'
                ],
                'tip': 'La luz natural del día funciona mejor para fotos de documentos. Evita usar flash que puede causar reflejos.'
            },
            {
                'title': 'Paso 5: Completar Información del Vehículo',
                'content': [
                    'Ingresa la marca de tu vehículo (fabricante) - ej. Toyota, Honda, Ford, Chevrolet',
                    'Ingresa el modelo de tu vehículo - ej. Camry, Civic, F-150, Malibu',
                    'Ingresa el año del vehículo (debe ser 1997 o más nuevo en la mayoría de mercados)',
                    'Selecciona el color de tu vehículo del menú desplegable',
                    'Ingresa el número de placa exactamente como aparece (incluyendo guiones o espacios)',
                    'Confirma que tu vehículo tiene 4 puertas (vehículos de 2 puertas pueden no ser aceptados)',
                    'Verifica que tu vehículo puede transportar pedidos de supermercado y artículos grandes de forma segura'
                ],
                'tip': 'La información de tu vehículo debe coincidir exactamente con tus documentos de registro.'
            },
            {
                'title': 'Paso 6: Verificación de Antecedentes y Activación',
                'content': [
                    'Revisa toda la información que has ingresado una última vez para verificar su exactitud',
                    'Lee y acepta el Acuerdo de Contratista Independiente cuidadosamente',
                    'Da tu consentimiento para la verificación de antecedentes realizada por Checkr',
                    'La verificación revisa tu récord de manejo (MVR) e historial criminal',
                    'La mayoría de las verificaciones se completan dentro de 3-7 días hábiles',
                    'Recibirás una notificación por email cuando tu cuenta sea aprobada',
                    '¡Una vez aprobado, completa el tutorial rápido en la app para comenzar a recibir ofertas de entrega!',
                    'Descarga la Guía del Conductor Spark desde la app para mejores prácticas'
                ],
                'tip': 'Revisa tu carpeta de spam si no ves correos de Spark dentro de una semana.'
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para Éxito en Spark Driver',
            'items': [
                'Comienza durante horas pico (8-11 AM y 4-8 PM) para más oportunidades de entrega',
                'Mantén una alta tasa de aceptación para recibir pedidos mejor pagados',
                'Mantén tu carro limpio y organizado para entregas eficientes',
                'Comunícate con los clientes a través de la app si hay retrasos',
                'Toma fotos de los artículos entregados en la puerta como prueba de entrega',
                'Los fines de semana y días festivos típicamente tienen la mayor demanda',
                'Revisa la app frecuentemente ya que los nuevos pedidos aparecen rápido'
            ]
        }
    }
}

DOORDASH_GUIDE = {
    'en': {
        'title': 'DoorDash Dasher',
        'subtitle': 'Complete Account Opening Guide',
        'platform': 'Food & Grocery Delivery Service',
        'intro': '''Welcome to your comprehensive DoorDash Dasher guide! DoorDash is the largest food delivery platform in the United States, operating in over 7,000 cities. As a Dasher, you'll have the flexibility to earn money on your own schedule by delivering food from local restaurants and groceries from stores to hungry customers. This detailed guide ensures you complete the sign-up process correctly for fast approval.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Must be at least 18 years old',
                'Valid driver\'s license (required for car delivery; not needed for bike/walk)',
                'Smartphone running iOS 14+ or Android 8+',
                'Reliable transportation (car, bike, scooter, or walk in select cities)',
                'Auto insurance (if delivering by car)',
                'Social Security Number for tax purposes',
                'Bank account or debit card for receiving payments',
                'Clean background check',
                'Ability to lift up to 30 lbs'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the DoorDash Dasher App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "DoorDash Dasher" - this is different from the customer DoorDash app!',
                    'Look for the app with the RED Dasher icon (not the regular DoorDash customer app)',
                    'The correct app will say "Dasher" and is specifically for delivery drivers',
                    'Download and install the official Dasher app',
                    'Open the app once installation is complete'
                ],
                'tip': 'The Dasher app has a red background with white text - don\'t confuse it with the customer app!'
            },
            {
                'title': 'Step 2: Start Your Dasher Application',
                'content': [
                    'Tap "Get Started" or "Sign Up" on the welcome screen',
                    'Enter your email address - use an email you check frequently',
                    'Enter your mobile phone number and verify with the SMS code',
                    'Create a secure password for your account',
                    'IMPORTANT: When asked for your location or ZIP code, enter one of the codes from GIG ZipFinder',
                    'Select your delivery method: Car, Bike, Scooter, or Walk (car offers the most opportunities)',
                    'Confirm you meet the minimum age requirement of 18 years'
                ],
                'tip': 'Using an open zip code dramatically increases your chances of being accepted!'
            },
            {
                'title': 'Step 3: Provide Personal Information',
                'content': [
                    'Enter your full legal name as it appears on your government ID',
                    'Provide your date of birth (must be 18 or older)',
                    'Enter your Social Security Number for background check and tax documents (1099)',
                    'Input your complete current address including city, state, and ZIP code',
                    'This information is used for identity verification and required tax reporting',
                    'Review all entries carefully before proceeding'
                ],
                'tip': 'Your personal information is protected by DoorDash\'s secure encryption systems.'
            },
            {
                'title': 'Step 4: Upload Required Documents',
                'content': [
                    'Take a clear photo of your driver\'s license (front side)',
                    'If using a car, you may need to provide vehicle registration and insurance',
                    'Take a selfie for identity verification - ensure good lighting and face the camera directly',
                    'All photos must be clear, in focus, and show all required information',
                    'Avoid shadows, glare, or blurry images',
                    'Your license must be valid and not expired'
                ],
                'tip': 'Use a flat, well-lit surface when photographing documents to avoid shadows.'
            },
            {
                'title': 'Step 5: Accept Terms & Complete Background Check',
                'content': [
                    'Read and carefully review the Independent Contractor Agreement',
                    'Accept the DoorDash Dasher Terms of Service',
                    'Consent to the background check conducted by Checkr',
                    'The background check reviews your driving history and criminal background',
                    'Background checks typically take 5-7 business days to complete',
                    'You\'ll receive email updates on your application status',
                    'Some applicants may be approved within 24-48 hours'
                ],
                'tip': 'Keep notifications enabled to receive real-time updates on your application.'
            },
            {
                'title': 'Step 6: Set Up Payment & Start Dashing',
                'content': [
                    'Choose your preferred payment method after approval',
                    'Option 1: Direct deposit to your bank account (payments every Monday)',
                    'Option 2: DasherDirect card - get a free debit card with instant access to earnings daily',
                    'Enter your bank account information or sign up for DasherDirect',
                    'Complete the quick in-app orientation video',
                    'Set your availability schedule in the app',
                    'You\'re ready to start accepting delivery orders!'
                ],
                'tip': 'DasherDirect offers instant cashout with no fees - highly recommended!'
            }
        ],
        'tips': {
            'title': 'Pro Tips for DoorDash Success',
            'items': [
                'Dash during lunch (11 AM - 2 PM) and dinner (5 PM - 9 PM) for maximum orders',
                'Accept orders from restaurants you know for faster pickups',
                'Use a hot bag to keep food warm - customers appreciate it',
                'Decline low-paying orders that don\'t meet your earnings goals',
                'Park legally to avoid tickets that cut into your profits',
                'Track your mileage for tax deductions at the end of the year',
                'Build a good rating by communicating with customers and being on time'
            ]
        }
    },
    'es': {
        'title': 'DoorDash Dasher',
        'subtitle': 'Guía Completa de Apertura de Cuenta',
        'platform': 'Servicio de Entrega de Comida y Abarrotes',
        'intro': '''¡Bienvenido a tu guía completa de DoorDash Dasher! DoorDash es la plataforma de entrega de comida más grande de Estados Unidos, operando en más de 7,000 ciudades. Como Dasher, tendrás la flexibilidad de ganar dinero en tu propio horario entregando comida de restaurantes locales y abarrotes de tiendas a clientes hambrientos. Esta guía detallada asegura que completes el proceso de registro correctamente para una aprobación rápida.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Licencia de conducir válida (requerida para entrega en auto; no necesaria para bici/a pie)',
                'Smartphone con iOS 14+ o Android 8+',
                'Transporte confiable (auto, bicicleta, scooter o a pie en ciudades selectas)',
                'Seguro de auto (si entregas en auto)',
                'Número de Seguro Social para propósitos fiscales',
                'Cuenta bancaria o tarjeta de débito para recibir pagos',
                'Verificación de antecedentes limpia',
                'Capacidad para cargar hasta 30 libras'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App DoorDash Dasher',
                'content': [
                    'Abre la App Store (iPhone) o Google Play Store (Android)',
                    'Busca "DoorDash Dasher" - ¡esto es diferente de la app de cliente DoorDash!',
                    'Busca la app con el ícono ROJO de Dasher (no la app regular de cliente DoorDash)',
                    'La app correcta dirá "Dasher" y es específicamente para conductores de entrega',
                    'Descarga e instala la app oficial Dasher',
                    'Abre la app una vez que se complete la instalación'
                ],
                'tip': '¡La app Dasher tiene fondo rojo con texto blanco - no la confundas con la app de cliente!'
            },
            {
                'title': 'Paso 2: Iniciar Tu Solicitud de Dasher',
                'content': [
                    'Toca "Comenzar" o "Registrarse" en la pantalla de bienvenida',
                    'Ingresa tu dirección de correo electrónico - usa un email que revises frecuentemente',
                    'Ingresa tu número de teléfono móvil y verifica con el código SMS',
                    'Crea una contraseña segura para tu cuenta',
                    'IMPORTANTE: Cuando te pregunten por tu ubicación o código postal, ingresa uno de los códigos de GIG ZipFinder',
                    'Selecciona tu método de entrega: Auto, Bicicleta, Scooter o A pie (auto ofrece más oportunidades)',
                    'Confirma que cumples con el requisito de edad mínima de 18 años'
                ],
                'tip': '¡Usar un código postal abierto aumenta dramáticamente tus posibilidades de ser aceptado!'
            },
            {
                'title': 'Paso 3: Proporcionar Información Personal',
                'content': [
                    'Ingresa tu nombre legal completo como aparece en tu identificación gubernamental',
                    'Proporciona tu fecha de nacimiento (debe ser 18 o mayor)',
                    'Ingresa tu Número de Seguro Social para verificación de antecedentes y documentos fiscales (1099)',
                    'Ingresa tu dirección actual completa incluyendo ciudad, estado y código postal',
                    'Esta información se usa para verificación de identidad y reportes fiscales requeridos',
                    'Revisa todas las entradas cuidadosamente antes de proceder'
                ],
                'tip': 'Tu información personal está protegida por los sistemas de encriptación seguros de DoorDash.'
            },
            {
                'title': 'Paso 4: Subir Documentos Requeridos',
                'content': [
                    'Toma una foto clara de tu licencia de conducir (lado frontal)',
                    'Si usas un auto, puede que necesites proporcionar registro vehicular y seguro',
                    'Toma una selfie para verificación de identidad - asegura buena iluminación y mira directamente a la cámara',
                    'Todas las fotos deben ser claras, en foco y mostrar toda la información requerida',
                    'Evita sombras, reflejos o imágenes borrosas',
                    'Tu licencia debe ser válida y no estar expirada'
                ],
                'tip': 'Usa una superficie plana y bien iluminada al fotografiar documentos para evitar sombras.'
            },
            {
                'title': 'Paso 5: Aceptar Términos y Completar Verificación de Antecedentes',
                'content': [
                    'Lee y revisa cuidadosamente el Acuerdo de Contratista Independiente',
                    'Acepta los Términos de Servicio de DoorDash Dasher',
                    'Da tu consentimiento para la verificación de antecedentes realizada por Checkr',
                    'La verificación revisa tu historial de manejo y antecedentes criminales',
                    'Las verificaciones de antecedentes típicamente toman 5-7 días hábiles',
                    'Recibirás actualizaciones por email sobre el estado de tu solicitud',
                    'Algunos solicitantes pueden ser aprobados dentro de 24-48 horas'
                ],
                'tip': 'Mantén las notificaciones habilitadas para recibir actualizaciones en tiempo real sobre tu solicitud.'
            },
            {
                'title': 'Paso 6: Configurar Pago y Comenzar a Entregar',
                'content': [
                    'Elige tu método de pago preferido después de la aprobación',
                    'Opción 1: Depósito directo a tu cuenta bancaria (pagos cada lunes)',
                    'Opción 2: Tarjeta DasherDirect - obtén una tarjeta de débito gratis con acceso instantáneo a ganancias diario',
                    'Ingresa tu información bancaria o regístrate para DasherDirect',
                    'Completa el video de orientación rápida en la app',
                    'Establece tu horario de disponibilidad en la app',
                    '¡Estás listo para comenzar a aceptar pedidos de entrega!'
                ],
                'tip': '¡DasherDirect ofrece retiro instantáneo sin cargos - altamente recomendado!'
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para Éxito en DoorDash',
            'items': [
                'Entrega durante almuerzo (11 AM - 2 PM) y cena (5 PM - 9 PM) para máximos pedidos',
                'Acepta pedidos de restaurantes que conoces para recogidas más rápidas',
                'Usa una bolsa térmica para mantener la comida caliente - los clientes lo aprecian',
                'Rechaza pedidos de bajo pago que no cumplan tus metas de ganancias',
                'Estaciona legalmente para evitar multas que reducen tus ganancias',
                'Registra tu millaje para deducciones fiscales al final del año',
                'Construye una buena calificación comunicándote con clientes y siendo puntual'
            ]
        }
    }
}

INSTACART_GUIDE = {
    'en': {
        'title': 'Instacart Shopper',
        'subtitle': 'Complete Account Opening Guide',
        'platform': 'Grocery Shopping & Delivery Service',
        'intro': '''Welcome to your comprehensive Instacart Shopper guide! Instacart is a leading grocery delivery platform that connects shoppers with customers who need groceries delivered to their homes. As a Full-Service Shopper, you'll shop for items at stores like Costco, Safeway, Kroger, Publix, and more, then deliver them directly to customers. This guide walks you through every step to maximize your chances of approval.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Must be at least 18 years old',
                'Eligible to work in the United States',
                'Smartphone with iOS 14+ or Android 8+ and reliable internet',
                'Reliable vehicle for grocery deliveries (car, van, or SUV)',
                'Valid driver\'s license and auto insurance',
                'Ability to lift and carry grocery bags weighing 30-40 lbs',
                'Pass a background check',
                'Social Security Number',
                'Bank account or debit card for payments',
                'Insulated bags for cold/frozen items (recommended)'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the Instacart Shopper App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "Instacart Shopper" - NOT the regular Instacart customer app',
                    'Look for the app with the GREEN shopping bag icon',
                    'The correct app is specifically for shoppers/delivery drivers',
                    'Download and install the official Instacart Shopper app',
                    'Make sure you have a stable internet connection during setup'
                ],
                'tip': 'The Shopper app has a green carrot icon - the customer app looks different!'
            },
            {
                'title': 'Step 2: Create Your Shopper Account',
                'content': [
                    'Open the Instacart Shopper app and tap "Become a Shopper" or "Sign Up"',
                    'Enter your email address - use one you check regularly',
                    'Create a strong, secure password',
                    'Enter and verify your mobile phone number via SMS code',
                    'CRITICAL: When asked for your shopping zone, enter a ZIP CODE from GIG ZipFinder',
                    'Select "Full-Service Shopper" to shop AND deliver (earns more than in-store only)',
                    'In-Store Shoppers only shop and don\'t deliver - Full-Service is recommended'
                ],
                'tip': 'Full-Service Shoppers typically earn more due to delivery tips!'
            },
            {
                'title': 'Step 3: Complete Identity Verification',
                'content': [
                    'Enter your full legal name exactly as it appears on your ID',
                    'Provide your date of birth (must be 18+)',
                    'Enter your Social Security Number for background check and taxes',
                    'Take a clear, well-lit photo of the FRONT of your driver\'s license',
                    'Take a clear photo of the BACK of your driver\'s license',
                    'Take a selfie for facial recognition verification',
                    'Ensure your selfie matches your ID photo closely'
                ],
                'tip': 'Good lighting is essential - natural daylight works best for document photos.'
            },
            {
                'title': 'Step 4: Provide Vehicle Information',
                'content': [
                    'Enter your vehicle make (manufacturer) - e.g., Toyota, Honda',
                    'Enter your vehicle model - e.g., RAV4, CR-V, Accord',
                    'Enter the year of your vehicle',
                    'Provide your license plate number exactly as shown',
                    'Confirm your vehicle can safely transport grocery orders',
                    'Larger vehicles (SUVs, vans) can handle bigger Costco orders',
                    'Some areas allow bike delivery for smaller orders'
                ],
                'tip': 'A spacious trunk or cargo area helps you take larger, higher-paying batches.'
            },
            {
                'title': 'Step 5: Background Check Process',
                'content': [
                    'Review and consent to the background check by Checkr',
                    'The check reviews your driving record (MVR) and criminal history',
                    'Background checks typically take 5-10 business days',
                    'You\'ll receive email notifications with updates on your status',
                    'Some applicants are approved within 24-48 hours',
                    'Check your spam folder if you don\'t see updates',
                    'Contact Instacart support if your check takes longer than 14 days'
                ],
                'tip': 'Keep your phone notifications enabled for real-time status updates.'
            },
            {
                'title': 'Step 6: Complete Training & Start Shopping',
                'content': [
                    'Once approved, complete the in-app orientation and tutorial',
                    'Learn how to navigate stores and find items efficiently',
                    'Set up your payment method (instant cashout or weekly direct deposit)',
                    'Enable location services on your phone for accurate order matching',
                    'Set your availability schedule - more hours = more opportunities',
                    'Get your insulated bags ready for cold/frozen items',
                    'Start accepting batches and earning money!'
                ],
                'tip': 'Complete Instacart\'s free "Shopper Academy" lessons to improve your skills!'
            }
        ],
        'tips': {
            'title': 'Pro Tips for Instacart Success',
            'items': [
                'Learn store layouts to shop faster - speed increases your hourly earnings',
                'Communicate with customers through the app if items are out of stock',
                'Take photos of receipts and delivered groceries for proof',
                'Higher ratings unlock access to better-paying batches',
                'Shop during peak hours: 9-11 AM, 4-7 PM, and weekends',
                'Costco and wholesale club orders typically pay more',
                'Keep insulated bags in your car to protect temperature-sensitive items',
                'Double-check orders before delivery to ensure accuracy'
            ]
        }
    },
    'es': {
        'title': 'Instacart Shopper',
        'subtitle': 'Guía Completa de Apertura de Cuenta',
        'platform': 'Servicio de Compras y Entrega de Abarrotes',
        'intro': '''¡Bienvenido a tu guía completa de Instacart Shopper! Instacart es una plataforma líder de entrega de abarrotes que conecta a compradores con clientes que necesitan que les entreguen comestibles a sus hogares. Como Shopper de Servicio Completo, comprarás artículos en tiendas como Costco, Safeway, Kroger, Publix y más, luego los entregarás directamente a los clientes. Esta guía te lleva a través de cada paso para maximizar tus posibilidades de aprobación.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Ser elegible para trabajar en Estados Unidos',
                'Smartphone con iOS 14+ o Android 8+ e internet confiable',
                'Vehículo confiable para entregas de abarrotes (auto, van o SUV)',
                'Licencia de conducir válida y seguro de auto',
                'Capacidad para cargar y transportar bolsas de 30-40 libras',
                'Pasar una verificación de antecedentes',
                'Número de Seguro Social',
                'Cuenta bancaria o tarjeta de débito para pagos',
                'Bolsas aislantes para artículos fríos/congelados (recomendado)'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Instacart Shopper',
                'content': [
                    'Abre la App Store (iPhone) o Google Play Store (Android)',
                    'Busca "Instacart Shopper" - NO la app regular de cliente Instacart',
                    'Busca la app con el ícono de bolsa de compras VERDE',
                    'La app correcta es específicamente para compradores/conductores de entrega',
                    'Descarga e instala la app oficial Instacart Shopper',
                    'Asegúrate de tener una conexión a internet estable durante la configuración'
                ],
                'tip': '¡La app Shopper tiene un ícono de zanahoria verde - la app de cliente se ve diferente!'
            },
            {
                'title': 'Paso 2: Crear Tu Cuenta de Shopper',
                'content': [
                    'Abre la app Instacart Shopper y toca "Convertirse en Shopper" o "Registrarse"',
                    'Ingresa tu dirección de correo electrónico - usa uno que revises regularmente',
                    'Crea una contraseña segura',
                    'Ingresa y verifica tu número de teléfono móvil vía código SMS',
                    'CRÍTICO: Cuando te pregunten por tu zona de compras, ingresa un CÓDIGO POSTAL de GIG ZipFinder',
                    'Selecciona "Shopper de Servicio Completo" para comprar Y entregar (gana más que solo en tienda)',
                    'Los Shoppers en Tienda solo compran y no entregan - Servicio Completo es recomendado'
                ],
                'tip': '¡Los Shoppers de Servicio Completo típicamente ganan más debido a las propinas de entrega!'
            },
            {
                'title': 'Paso 3: Completar Verificación de Identidad',
                'content': [
                    'Ingresa tu nombre legal completo exactamente como aparece en tu ID',
                    'Proporciona tu fecha de nacimiento (debe ser 18+)',
                    'Ingresa tu Número de Seguro Social para verificación de antecedentes e impuestos',
                    'Toma una foto clara y bien iluminada del FRENTE de tu licencia de conducir',
                    'Toma una foto clara del REVERSO de tu licencia de conducir',
                    'Toma una selfie para verificación de reconocimiento facial',
                    'Asegúrate de que tu selfie coincida de cerca con tu foto de ID'
                ],
                'tip': 'La buena iluminación es esencial - la luz natural del día funciona mejor para fotos de documentos.'
            },
            {
                'title': 'Paso 4: Proporcionar Información del Vehículo',
                'content': [
                    'Ingresa la marca de tu vehículo (fabricante) - ej. Toyota, Honda',
                    'Ingresa el modelo de tu vehículo - ej. RAV4, CR-V, Accord',
                    'Ingresa el año de tu vehículo',
                    'Proporciona tu número de placa exactamente como se muestra',
                    'Confirma que tu vehículo puede transportar pedidos de abarrotes de forma segura',
                    'Vehículos más grandes (SUVs, vans) pueden manejar pedidos más grandes de Costco',
                    'Algunas áreas permiten entrega en bicicleta para pedidos pequeños'
                ],
                'tip': 'Una cajuela o área de carga espaciosa te ayuda a tomar lotes más grandes y mejor pagados.'
            },
            {
                'title': 'Paso 5: Proceso de Verificación de Antecedentes',
                'content': [
                    'Revisa y da tu consentimiento para la verificación de antecedentes por Checkr',
                    'La verificación revisa tu récord de manejo (MVR) e historial criminal',
                    'Las verificaciones de antecedentes típicamente toman 5-10 días hábiles',
                    'Recibirás notificaciones por email con actualizaciones sobre tu estado',
                    'Algunos solicitantes son aprobados dentro de 24-48 horas',
                    'Revisa tu carpeta de spam si no ves actualizaciones',
                    'Contacta soporte de Instacart si tu verificación toma más de 14 días'
                ],
                'tip': 'Mantén las notificaciones de tu teléfono habilitadas para actualizaciones en tiempo real.'
            },
            {
                'title': 'Paso 6: Completar Entrenamiento y Comenzar a Comprar',
                'content': [
                    'Una vez aprobado, completa la orientación y tutorial en la app',
                    'Aprende a navegar tiendas y encontrar artículos eficientemente',
                    'Configura tu método de pago (retiro instantáneo o depósito directo semanal)',
                    'Habilita servicios de ubicación en tu teléfono para coincidencia precisa de pedidos',
                    'Establece tu horario de disponibilidad - más horas = más oportunidades',
                    'Ten tus bolsas aislantes listas para artículos fríos/congelados',
                    '¡Comienza a aceptar lotes y a ganar dinero!'
                ],
                'tip': '¡Completa las lecciones gratuitas de "Academia del Shopper" de Instacart para mejorar tus habilidades!'
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para Éxito en Instacart',
            'items': [
                'Aprende la distribución de las tiendas para comprar más rápido - la velocidad aumenta tus ganancias por hora',
                'Comunícate con los clientes a través de la app si los artículos están agotados',
                'Toma fotos de recibos y abarrotes entregados como prueba',
                'Calificaciones más altas desbloquean acceso a lotes mejor pagados',
                'Compra durante horas pico: 9-11 AM, 4-7 PM y fines de semana',
                'Los pedidos de Costco y clubes de mayoreo típicamente pagan más',
                'Mantén bolsas aislantes en tu carro para proteger artículos sensibles a temperatura',
                'Verifica pedidos dos veces antes de entregar para asegurar precisión'
            ]
        }
    }
}

GOOGLE_VOICE_GUIDE = {
    'en': {
        'title': 'Google Voice',
        'subtitle': 'Free Second Phone Number Guide',
        'platform': 'FREE Phone Number for Gig Apps',
        'intro': '''Welcome to your complete Google Voice setup guide! Google Voice is a FREE service from Google that provides you with a second phone number. This is incredibly useful for gig work because it keeps your personal number private while allowing you to receive verification codes, customer calls, and app notifications. Best of all - it's completely free and works anywhere you have internet!''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'A Google account (Gmail) - free to create if you don\'t have one',
                'Smartphone with iOS 14+ or Android 8+',
                'Stable internet connection (WiFi or mobile data)',
                'Your current phone number (needed once for initial verification)',
                'About 10 minutes to complete setup'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download Google Voice App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "Google Voice" in the search bar',
                    'Look for the official Google Voice app with the blue/green phone icon',
                    'Download and install the free Google Voice app',
                    'You can also set up Google Voice at voice.google.com on a computer',
                    'The app is completely FREE with no subscription fees'
                ],
                'tip': 'Google Voice works on multiple devices - phone, tablet, and computer!'
            },
            {
                'title': 'Step 2: Sign In to Google Voice',
                'content': [
                    'Open the Google Voice app',
                    'Tap "Sign in" and enter your Google account credentials',
                    'If you don\'t have a Google account, tap "Create account" to make one',
                    'Accept the Google Voice Terms of Service',
                    'Grant the app necessary permissions when prompted (contacts, microphone)',
                    'Your Google account will be linked to your new Voice number'
                ],
                'tip': 'Use a Google account specifically for your gig work to keep things organized!'
            },
            {
                'title': 'Step 3: Choose Your Free Phone Number',
                'content': [
                    'Tap "Search" to find available phone numbers',
                    'Enter a city name or area code to find local numbers',
                    'Browse through the list of available numbers',
                    'Choose a number that\'s easy to remember',
                    'Tap "Select" on your preferred number',
                    'This number is 100% FREE - no hidden fees!',
                    'You can change your number later if needed (may require fee)'
                ],
                'tip': 'Pick a number with a repeating pattern or easy sequence for better recall!'
            },
            {
                'title': 'Step 4: Verify with Your Existing Phone',
                'content': [
                    'Google will ask you to verify with an existing phone number',
                    'Enter your current mobile phone number',
                    'Select whether to receive verification code via text or call',
                    'Enter the 6-digit verification code you receive',
                    'This step links your Google Voice number to your account',
                    'Your personal number stays completely private',
                    'This verification is only needed once during setup'
                ],
                'tip': 'You only need to verify once - after that your Voice number is independent!'
            },
            {
                'title': 'Step 5: Configure Your Google Voice Number',
                'content': [
                    'Your new phone number is now active!',
                    'Go to Settings to record a custom voicemail greeting',
                    'Enable notifications so you never miss important calls or texts',
                    'Set up call forwarding to your personal number (optional)',
                    'Enable "Do Not Disturb" mode for times you don\'t want work calls',
                    'Test your number by calling it from another phone',
                    'Make sure texts and calls come through properly'
                ],
                'tip': 'Record a professional voicemail greeting for when customers call!'
            },
            {
                'title': 'Step 6: Use Google Voice for Gig Apps',
                'content': [
                    'Use your Google Voice number when signing up for Spark, DoorDash, Instacart',
                    'All verification codes will come to your Google Voice app',
                    'Manage work-related calls separately from personal calls',
                    'Your real phone number remains completely private',
                    'Google Voice works anywhere with WiFi or data connection',
                    'You can use Google Voice on your phone, tablet, and computer',
                    'Free calls and texts within the US and Canada!'
                ],
                'tip': 'Set custom notification sounds for Google Voice to distinguish work calls!'
            }
        ],
        'tips': {
            'title': 'Pro Tips for Google Voice',
            'items': [
                'Keep the Google Voice app installed and logged in at all times',
                'Enable notifications to never miss verification codes or customer messages',
                'Use the "Do Not Disturb" schedule to silence work calls during off hours',
                'Check voicemails regularly - they\'re automatically transcribed!',
                'Google Voice is perfect for keeping work and personal life separate',
                'You can use Google Voice internationally with WiFi',
                'Free voicemail transcription helps you read messages quickly'
            ]
        }
    },
    'es': {
        'title': 'Google Voice',
        'subtitle': 'Guía de Segundo Número de Teléfono Gratis',
        'platform': 'Número de Teléfono GRATIS para Apps de Gig',
        'intro': '''¡Bienvenido a tu guía completa de configuración de Google Voice! Google Voice es un servicio GRATUITO de Google que te proporciona un segundo número de teléfono. Esto es increíblemente útil para trabajo de gig porque mantiene tu número personal privado mientras te permite recibir códigos de verificación, llamadas de clientes y notificaciones de apps. ¡Lo mejor de todo - es completamente gratis y funciona en cualquier lugar donde tengas internet!''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Una cuenta de Google (Gmail) - gratis de crear si no tienes una',
                'Smartphone con iOS 14+ o Android 8+',
                'Conexión a internet estable (WiFi o datos móviles)',
                'Tu número de teléfono actual (necesario una vez para verificación inicial)',
                'Aproximadamente 10 minutos para completar la configuración'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Google Voice',
                'content': [
                    'Abre la App Store (iPhone) o Google Play Store (Android)',
                    'Busca "Google Voice" en la barra de búsqueda',
                    'Busca la app oficial de Google Voice con el ícono de teléfono azul/verde',
                    'Descarga e instala la app gratuita de Google Voice',
                    'También puedes configurar Google Voice en voice.google.com en una computadora',
                    'La app es completamente GRATIS sin cargos de suscripción'
                ],
                'tip': '¡Google Voice funciona en múltiples dispositivos - teléfono, tablet y computadora!'
            },
            {
                'title': 'Paso 2: Iniciar Sesión en Google Voice',
                'content': [
                    'Abre la app de Google Voice',
                    'Toca "Iniciar sesión" e ingresa las credenciales de tu cuenta de Google',
                    'Si no tienes cuenta de Google, toca "Crear cuenta" para hacer una',
                    'Acepta los Términos de Servicio de Google Voice',
                    'Otorga los permisos necesarios cuando se solicite (contactos, micrófono)',
                    'Tu cuenta de Google se vinculará a tu nuevo número de Voice'
                ],
                'tip': '¡Usa una cuenta de Google específicamente para tu trabajo de gig para mantener las cosas organizadas!'
            },
            {
                'title': 'Paso 3: Elegir Tu Número de Teléfono Gratis',
                'content': [
                    'Toca "Buscar" para encontrar números de teléfono disponibles',
                    'Ingresa un nombre de ciudad o código de área para encontrar números locales',
                    'Explora la lista de números disponibles',
                    'Elige un número que sea fácil de recordar',
                    'Toca "Seleccionar" en tu número preferido',
                    '¡Este número es 100% GRATIS - sin cargos ocultos!',
                    'Puedes cambiar tu número después si es necesario (puede requerir cargo)'
                ],
                'tip': '¡Elige un número con un patrón que se repita o secuencia fácil para mejor recordación!'
            },
            {
                'title': 'Paso 4: Verificar con Tu Teléfono Existente',
                'content': [
                    'Google te pedirá verificar con un número de teléfono existente',
                    'Ingresa tu número de teléfono móvil actual',
                    'Selecciona si recibir el código de verificación por texto o llamada',
                    'Ingresa el código de verificación de 6 dígitos que recibes',
                    'Este paso vincula tu número de Google Voice a tu cuenta',
                    'Tu número personal se mantiene completamente privado',
                    'Esta verificación solo se necesita una vez durante la configuración'
                ],
                'tip': '¡Solo necesitas verificar una vez - después de eso tu número de Voice es independiente!'
            },
            {
                'title': 'Paso 5: Configurar Tu Número de Google Voice',
                'content': [
                    '¡Tu nuevo número de teléfono ahora está activo!',
                    'Ve a Configuración para grabar un saludo de buzón de voz personalizado',
                    'Habilita notificaciones para nunca perder llamadas o textos importantes',
                    'Configura el desvío de llamadas a tu número personal (opcional)',
                    'Habilita el modo "No Molestar" para momentos que no quieras llamadas de trabajo',
                    'Prueba tu número llamándolo desde otro teléfono',
                    'Asegúrate de que los textos y llamadas lleguen correctamente'
                ],
                'tip': '¡Graba un saludo de buzón de voz profesional para cuando los clientes llamen!'
            },
            {
                'title': 'Paso 6: Usar Google Voice para Apps de Gig',
                'content': [
                    'Usa tu número de Google Voice al registrarte en Spark, DoorDash, Instacart',
                    'Todos los códigos de verificación llegarán a tu app de Google Voice',
                    'Administra llamadas relacionadas con trabajo separadamente de llamadas personales',
                    'Tu número de teléfono real permanece completamente privado',
                    'Google Voice funciona en cualquier lugar con conexión WiFi o datos',
                    'Puedes usar Google Voice en tu teléfono, tablet y computadora',
                    '¡Llamadas y textos gratis dentro de EE.UU. y Canadá!'
                ],
                'tip': '¡Configura sonidos de notificación personalizados para Google Voice para distinguir llamadas de trabajo!'
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para Google Voice',
            'items': [
                'Mantén la app de Google Voice instalada y con sesión iniciada en todo momento',
                'Habilita notificaciones para nunca perder códigos de verificación o mensajes de clientes',
                'Usa el horario de "No Molestar" para silenciar llamadas de trabajo fuera de horas',
                '¡Revisa los buzones de voz regularmente - se transcriben automáticamente!',
                'Google Voice es perfecto para mantener el trabajo y la vida personal separados',
                'Puedes usar Google Voice internacionalmente con WiFi',
                'La transcripción gratuita de buzón de voz te ayuda a leer mensajes rápidamente'
            ]
        }
    }
}

def create_header_footer(canvas, doc, app_name, language):
    """Add header and footer to each page"""
    canvas.saveState()
    
    # Header line
    canvas.setStrokeColor(CYAN_ACCENT)
    canvas.setLineWidth(2)
    canvas.line(72, 750, 540, 750)
    
    # Footer
    canvas.setStrokeColor(SILVER)
    canvas.setLineWidth(1)
    canvas.line(72, 50, 540, 50)
    
    # Footer text
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(SILVER)
    
    # Page number
    page_num = canvas.getPageNumber()
    canvas.drawCentredString(306, 30, f"Page {page_num}")
    
    # Website
    canvas.setFillColor(CYAN_ACCENT)
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawCentredString(306, 42, APP_WEB_URL)
    
    canvas.restoreState()

def create_pdf(guide_content, language, output_filename, app_type):
    """Create a professional PDF guide"""
    
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=80,
        bottomMargin=70
    )
    
    styles = create_styles()
    story = []
    content = guide_content[language]
    
    # Logo at the top
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image(LOGO_PATH, width=2*inch, height=2*inch)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 10))
        except Exception as e:
            print(f"Could not add logo: {e}")
    
    # Title
    story.append(Paragraph(content['title'], styles['MainTitle']))
    story.append(Paragraph(content['subtitle'], styles['SubTitle']))
    story.append(Paragraph(content['platform'], styles['FooterText']))
    story.append(Spacer(1, 20))
    
    # Horizontal line
    story.append(HRFlowable(width="100%", thickness=2, color=CYAN_ACCENT, spaceBefore=5, spaceAfter=15))
    
    # Introduction
    story.append(Paragraph(content['intro'], styles['CustomBodyText']))
    story.append(Spacer(1, 15))
    
    # Requirements box
    story.append(Paragraph(content['requirements']['title'], styles['SectionTitle']))
    for item in content['requirements']['items']:
        story.append(Paragraph(f"• {item}", styles['BulletPoint']))
    story.append(Spacer(1, 15))
    
    # Steps
    for i, step in enumerate(content['steps']):
        story.append(HRFlowable(width="100%", thickness=1, color=SILVER, spaceBefore=10, spaceAfter=5))
        story.append(Paragraph(step['title'], styles['StepTitle']))
        
        for item in step['content']:
            story.append(Paragraph(f"• {item}", styles['BulletPoint']))
        
        # Add tip if exists
        if 'tip' in step:
            tip_text = f"💡 TIP: {step['tip']}" if language == 'en' else f"💡 CONSEJO: {step['tip']}"
            story.append(Paragraph(tip_text, styles['TipText']))
        
        story.append(Spacer(1, 10))
    
    # Pro Tips section
    story.append(HRFlowable(width="100%", thickness=2, color=CYAN_ACCENT, spaceBefore=15, spaceAfter=10))
    story.append(Paragraph(content['tips']['title'], styles['SectionTitle']))
    for item in content['tips']['items']:
        story.append(Paragraph(f"✓ {item}", styles['TipText']))
    
    # QR Codes section
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY_BLUE, spaceBefore=5, spaceAfter=15))
    
    download_title = "Download GIG ZipFinder App" if language == 'en' else "Descarga la App GIG ZipFinder"
    story.append(Paragraph(download_title, styles['SectionTitle']))
    
    # Create QR codes
    try:
        play_qr_buffer = generate_qr_code(PLAY_STORE_URL)
        app_qr_buffer = generate_qr_code(APP_STORE_URL)
        
        play_qr_img = Image(play_qr_buffer, width=1.2*inch, height=1.2*inch)
        app_qr_img = Image(app_qr_buffer, width=1.2*inch, height=1.2*inch)
        
        # Create table with QR codes
        qr_data = [
            [play_qr_img, app_qr_img],
            [Paragraph("Google Play Store", styles['FooterText']), 
             Paragraph("Apple App Store", styles['FooterText'])]
        ]
        
        qr_table = Table(qr_data, colWidths=[2.5*inch, 2.5*inch])
        qr_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(qr_table)
    except Exception as e:
        print(f"Could not generate QR codes: {e}")
    
    # Footer info
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=SILVER, spaceBefore=5, spaceAfter=10))
    
    story.append(Paragraph(APP_WEB_URL, styles['WebURL']))
    
    copyright_text = f"© {datetime.now().year} GIG ZipFinder. All Rights Reserved." if language == 'en' else f"© {datetime.now().year} GIG ZipFinder. Todos los Derechos Reservados."
    story.append(Paragraph(copyright_text, styles['FooterText']))
    
    generated_text = f"Generated: {datetime.now().strftime('%B %d, %Y')}" if language == 'en' else f"Generado: {datetime.now().strftime('%d de %B, %Y')}"
    story.append(Paragraph(generated_text, styles['FooterText']))
    
    # Build PDF
    doc.build(story)
    print(f"✅ Created: {output_filename}")

def generate_all_guides():
    """Generate all PDF guides in both languages"""
    
    output_dir = '/app/frontend/assets/guides'
    os.makedirs(output_dir, exist_ok=True)
    
    guides = [
        (SPARK_GUIDE, 'spark'),
        (DOORDASH_GUIDE, 'doordash'),
        (INSTACART_GUIDE, 'instacart'),
        (GOOGLE_VOICE_GUIDE, 'google_voice'),
    ]
    
    for guide_content, app_type in guides:
        # English version
        create_pdf(
            guide_content, 
            'en', 
            f"{output_dir}/{app_type}_guide_en.pdf",
            app_type
        )
        
        # Spanish version
        create_pdf(
            guide_content, 
            'es', 
            f"{output_dir}/{app_type}_guide_es.pdf",
            app_type
        )
    
    print(f"\n✅ All guides generated in: {output_dir}")
    print("Files created:")
    for f in sorted(os.listdir(output_dir)):
        if f.endswith('.pdf'):
            size = os.path.getsize(f"{output_dir}/{f}") / 1024
            print(f"  - {f} ({size:.1f} KB)")

if __name__ == '__main__':
    generate_all_guides()
