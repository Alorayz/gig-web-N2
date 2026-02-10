#!/usr/bin/env python3
"""
GIG ZipFinder - PDF Guide Generator
Generates professional PDF guides for Spark Driver, DoorDash, Instacart, and Google Voice
in both English and Spanish.
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# Color scheme matching the app
PRIMARY_COLOR = colors.HexColor('#0f0f1a')
ACCENT_COLOR = colors.HexColor('#4CAF50')
SECONDARY_COLOR = colors.HexColor('#1a1a2e')
TEXT_COLOR = colors.HexColor('#333333')
LIGHT_GRAY = colors.HexColor('#f5f5f5')

# Logo path
LOGO_PATH = '/app/frontend/assets/images/logo.jpeg'

def create_styles():
    """Create custom styles for the PDF"""
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='MainTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=PRIMARY_COLOR,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='SectionTitle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=ACCENT_COLOR,
        spaceBefore=20,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='StepTitle',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=PRIMARY_COLOR,
        spaceBefore=15,
        spaceAfter=5,
        fontName='Helvetica-Bold'
    ))
    
    styles.add(ParagraphStyle(
        name='CustomBodyText',
        parent=styles['Normal'],
        fontSize=11,
        textColor=TEXT_COLOR,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
        leading=16
    ))
    
    styles.add(ParagraphStyle(
        name='BulletPoint',
        parent=styles['Normal'],
        fontSize=11,
        textColor=TEXT_COLOR,
        leftIndent=20,
        spaceAfter=5,
        leading=14
    ))
    
    styles.add(ParagraphStyle(
        name='FooterText',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.gray,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='ImportantNote',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#FF5722'),
        backColor=colors.HexColor('#FFF3E0'),
        borderPadding=10,
        spaceBefore=10,
        spaceAfter=10
    ))
    
    return styles

# ============== GUIDE CONTENT ==============

SPARK_GUIDE = {
    'en': {
        'title': 'Spark Driver - Complete Account Opening Guide',
        'subtitle': 'Walmart Delivery Service',
        'intro': '''Spark Driver is Walmart's delivery platform that allows you to earn money by delivering groceries and other items from Walmart stores to customers' homes. This comprehensive guide will walk you through every step of the registration process.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Be at least 18 years old',
                'Have a valid driver\'s license',
                'Have a smartphone (iPhone or Android)',
                'Have a reliable vehicle (car, van, or truck)',
                'Have valid auto insurance',
                'Pass a background check',
                'Have a Social Security Number'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the Spark Driver App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "Spark Driver" in the search bar',
                    'Look for the official app with the Walmart Spark logo',
                    'Tap "Download" or "Install" to get the app',
                    'Wait for the installation to complete',
                    'Once installed, tap "Open" to launch the app'
                ]
            },
            {
                'title': 'Step 2: Create Your Account',
                'content': [
                    'Open the Spark Driver app',
                    'Tap on "Sign Up" or "Get Started"',
                    'Enter your email address (use a valid email you check regularly)',
                    'Create a strong password (at least 8 characters with numbers and symbols)',
                    'Enter your phone number for verification',
                    'Check your email and click the verification link',
                    'IMPORTANT: When asked for your delivery area, enter one of the zip codes provided by GIG ZipFinder'
                ]
            },
            {
                'title': 'Step 3: Enter Personal Information',
                'content': [
                    'Enter your full legal name EXACTLY as it appears on your ID',
                    'Enter your date of birth',
                    'Enter your Social Security Number (this is required for tax purposes)',
                    'Provide your current residential address',
                    'This information will be used for the background check'
                ]
            },
            {
                'title': 'Step 4: Upload Required Documents',
                'content': [
                    'Take a clear photo of the FRONT of your driver\'s license',
                    'Take a clear photo of the BACK of your driver\'s license',
                    'Take a photo of your vehicle registration',
                    'Take a photo of your auto insurance card (must show coverage dates)',
                    'Take a selfie for identity verification (match it to your ID photo)',
                    'Ensure all photos are clear, well-lit, and all text is readable'
                ]
            },
            {
                'title': 'Step 5: Vehicle Information',
                'content': [
                    'Enter your vehicle make (e.g., Toyota, Ford)',
                    'Enter your vehicle model (e.g., Camry, F-150)',
                    'Enter the year of your vehicle',
                    'Enter your vehicle color',
                    'Enter your license plate number',
                    'Your vehicle must be in good working condition'
                ]
            },
            {
                'title': 'Step 6: Background Check & Approval',
                'content': [
                    'Review all your information for accuracy',
                    'Consent to the background check',
                    'The background check typically takes 3-7 business days',
                    'You will receive an email notification when approved',
                    'Check your spam folder if you don\'t see the email',
                    'Once approved, you can start accepting deliveries!'
                ]
            }
        ],
        'tips': {
            'title': 'Pro Tips for Success',
            'items': [
                'Use a business email for your account',
                'Take document photos in good lighting',
                'Double-check all information before submitting',
                'Keep your phone number active for verification codes',
                'Apply during business hours for faster processing'
            ]
        }
    },
    'es': {
        'title': 'Spark Driver - Guía Completa de Apertura de Cuenta',
        'subtitle': 'Servicio de Entregas de Walmart',
        'intro': '''Spark Driver es la plataforma de entregas de Walmart que te permite ganar dinero entregando comestibles y otros artículos desde las tiendas Walmart hasta los hogares de los clientes. Esta guía completa te guiará a través de cada paso del proceso de registro.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Tener una licencia de conducir válida',
                'Tener un smartphone (iPhone o Android)',
                'Tener un vehículo confiable (auto, van o camioneta)',
                'Tener seguro de auto válido',
                'Pasar una verificación de antecedentes',
                'Tener un Número de Seguro Social'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Spark Driver',
                'content': [
                    'Abra la App Store (iPhone) o Google Play Store (Android)',
                    'Busque "Spark Driver" en la barra de búsqueda',
                    'Busque la aplicación oficial con el logo de Walmart Spark',
                    'Toque "Descargar" o "Instalar" para obtener la app',
                    'Espere a que se complete la instalación',
                    'Una vez instalada, toque "Abrir" para iniciar la app'
                ]
            },
            {
                'title': 'Paso 2: Crear Su Cuenta',
                'content': [
                    'Abra la aplicación Spark Driver',
                    'Toque en "Registrarse" o "Comenzar"',
                    'Ingrese su dirección de correo electrónico (use un email válido que revise regularmente)',
                    'Cree una contraseña segura (al menos 8 caracteres con números y símbolos)',
                    'Ingrese su número de teléfono para verificación',
                    'Revise su email y haga clic en el enlace de verificación',
                    'IMPORTANTE: Cuando le pregunten por su área de entrega, ingrese uno de los códigos postales proporcionados por GIG ZipFinder'
                ]
            },
            {
                'title': 'Paso 3: Ingresar Información Personal',
                'content': [
                    'Ingrese su nombre legal completo EXACTAMENTE como aparece en su identificación',
                    'Ingrese su fecha de nacimiento',
                    'Ingrese su Número de Seguro Social (requerido para propósitos fiscales)',
                    'Proporcione su dirección residencial actual',
                    'Esta información será utilizada para la verificación de antecedentes'
                ]
            },
            {
                'title': 'Paso 4: Subir Documentos Requeridos',
                'content': [
                    'Tome una foto clara del FRENTE de su licencia de conducir',
                    'Tome una foto clara del REVERSO de su licencia de conducir',
                    'Tome una foto de su registro vehicular',
                    'Tome una foto de su tarjeta de seguro de auto (debe mostrar fechas de cobertura)',
                    'Tome una selfie para verificación de identidad (debe coincidir con su foto de ID)',
                    'Asegúrese de que todas las fotos sean claras, bien iluminadas y todo el texto sea legible'
                ]
            },
            {
                'title': 'Paso 5: Información del Vehículo',
                'content': [
                    'Ingrese la marca de su vehículo (ej. Toyota, Ford)',
                    'Ingrese el modelo de su vehículo (ej. Camry, F-150)',
                    'Ingrese el año de su vehículo',
                    'Ingrese el color de su vehículo',
                    'Ingrese el número de placa de su vehículo',
                    'Su vehículo debe estar en buenas condiciones de funcionamiento'
                ]
            },
            {
                'title': 'Paso 6: Verificación de Antecedentes y Aprobación',
                'content': [
                    'Revise toda su información para verificar que sea correcta',
                    'Dé su consentimiento para la verificación de antecedentes',
                    'La verificación de antecedentes generalmente toma 3-7 días hábiles',
                    'Recibirá una notificación por email cuando sea aprobado',
                    'Revise su carpeta de spam si no ve el email',
                    '¡Una vez aprobado, puede comenzar a aceptar entregas!'
                ]
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para el Éxito',
            'items': [
                'Use un email profesional para su cuenta',
                'Tome fotos de documentos con buena iluminación',
                'Verifique toda la información antes de enviar',
                'Mantenga su número de teléfono activo para códigos de verificación',
                'Aplique durante horas de oficina para procesamiento más rápido'
            ]
        }
    }
}

DOORDASH_GUIDE = {
    'en': {
        'title': 'DoorDash Dasher - Complete Account Opening Guide',
        'subtitle': 'Food & Grocery Delivery Service',
        'intro': '''DoorDash is one of the largest food delivery platforms in the United States. As a Dasher, you can earn money delivering food from restaurants and groceries from stores to customers. This guide covers everything you need to know to get started.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Be at least 18 years old',
                'Have a valid driver\'s license (for car delivery)',
                'Have a smartphone with the Dasher app',
                'Have reliable transportation (car, bike, scooter, or walk)',
                'Pass a background check',
                'Have a Social Security Number',
                'Have a bank account or debit card for payments'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the DoorDash Dasher App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "DoorDash Dasher" - NOT the regular DoorDash customer app',
                    'Look for the app with the red Dasher icon',
                    'Download and install the official Dasher app',
                    'The app icon should be red with "Dasher" written on it'
                ]
            },
            {
                'title': 'Step 2: Start the Sign-Up Process',
                'content': [
                    'Open the Dasher app',
                    'Tap "Get Started" or "Sign Up"',
                    'Enter your email address',
                    'Enter your phone number (you\'ll receive a verification code)',
                    'Create a secure password',
                    'IMPORTANT: When asked for your location/zip code, enter one of the zip codes from GIG ZipFinder',
                    'Select your preferred delivery method (car, bike, scooter, or walk)'
                ]
            },
            {
                'title': 'Step 3: Provide Personal Information',
                'content': [
                    'Enter your full legal name as it appears on your ID',
                    'Enter your date of birth',
                    'Enter your Social Security Number',
                    'Provide your current address',
                    'This information is used for the background check and tax documents'
                ]
            },
            {
                'title': 'Step 4: Upload Your Documents',
                'content': [
                    'Take a clear photo of your driver\'s license (front)',
                    'If using a car, you may need to provide vehicle information',
                    'Take a selfie for identity verification',
                    'Make sure photos are clear and all text is readable',
                    'Photos should be well-lit with no glare'
                ]
            },
            {
                'title': 'Step 5: Agree to Terms & Background Check',
                'content': [
                    'Read and accept the Independent Contractor Agreement',
                    'Consent to the background check',
                    'Read and understand the Dasher terms of service',
                    'Background checks are conducted by Checkr',
                    'Results typically come back within 5-7 business days'
                ]
            },
            {
                'title': 'Step 6: Set Up Payment Method',
                'content': [
                    'Choose how you want to receive payments',
                    'Option 1: Direct deposit to your bank account (weekly payments)',
                    'Option 2: DasherDirect card (instant access to earnings)',
                    'Enter your banking information accurately',
                    'You can change your payment method later',
                    'Once approved, you can start dashing!'
                ]
            }
        ],
        'tips': {
            'title': 'Pro Tips for Success',
            'items': [
                'Apply in areas with high restaurant density',
                'Complete the sign-up during peak hours for faster processing',
                'Have all documents ready before starting',
                'Use DasherDirect for instant payments',
                'Start during lunch or dinner hours for more orders'
            ]
        }
    },
    'es': {
        'title': 'DoorDash Dasher - Guía Completa de Apertura de Cuenta',
        'subtitle': 'Servicio de Entrega de Comida y Abarrotes',
        'intro': '''DoorDash es una de las plataformas de entrega de comida más grandes de Estados Unidos. Como Dasher, puedes ganar dinero entregando comida de restaurantes y abarrotes de tiendas a los clientes. Esta guía cubre todo lo que necesitas saber para comenzar.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Tener una licencia de conducir válida (para entregas en auto)',
                'Tener un smartphone con la app Dasher',
                'Tener transporte confiable (auto, bicicleta, scooter, o a pie)',
                'Pasar una verificación de antecedentes',
                'Tener un Número de Seguro Social',
                'Tener una cuenta bancaria o tarjeta de débito para pagos'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App DoorDash Dasher',
                'content': [
                    'Abra la App Store (iPhone) o Google Play Store (Android)',
                    'Busque "DoorDash Dasher" - NO la app regular de cliente DoorDash',
                    'Busque la app con el ícono rojo de Dasher',
                    'Descargue e instale la app oficial Dasher',
                    'El ícono de la app debe ser rojo con "Dasher" escrito'
                ]
            },
            {
                'title': 'Paso 2: Iniciar el Proceso de Registro',
                'content': [
                    'Abra la app Dasher',
                    'Toque "Comenzar" o "Registrarse"',
                    'Ingrese su dirección de correo electrónico',
                    'Ingrese su número de teléfono (recibirá un código de verificación)',
                    'Cree una contraseña segura',
                    'IMPORTANTE: Cuando le pregunten por su ubicación/código postal, ingrese uno de los códigos de GIG ZipFinder',
                    'Seleccione su método de entrega preferido (auto, bicicleta, scooter, o a pie)'
                ]
            },
            {
                'title': 'Paso 3: Proporcionar Información Personal',
                'content': [
                    'Ingrese su nombre legal completo como aparece en su ID',
                    'Ingrese su fecha de nacimiento',
                    'Ingrese su Número de Seguro Social',
                    'Proporcione su dirección actual',
                    'Esta información se usa para la verificación de antecedentes y documentos fiscales'
                ]
            },
            {
                'title': 'Paso 4: Subir Sus Documentos',
                'content': [
                    'Tome una foto clara de su licencia de conducir (frente)',
                    'Si usa un auto, puede necesitar proporcionar información del vehículo',
                    'Tome una selfie para verificación de identidad',
                    'Asegúrese de que las fotos sean claras y todo el texto legible',
                    'Las fotos deben estar bien iluminadas sin reflejos'
                ]
            },
            {
                'title': 'Paso 5: Aceptar Términos y Verificación de Antecedentes',
                'content': [
                    'Lea y acepte el Acuerdo de Contratista Independiente',
                    'Dé su consentimiento para la verificación de antecedentes',
                    'Lea y entienda los términos de servicio de Dasher',
                    'Las verificaciones de antecedentes son realizadas por Checkr',
                    'Los resultados generalmente llegan dentro de 5-7 días hábiles'
                ]
            },
            {
                'title': 'Paso 6: Configurar Método de Pago',
                'content': [
                    'Elija cómo quiere recibir sus pagos',
                    'Opción 1: Depósito directo a su cuenta bancaria (pagos semanales)',
                    'Opción 2: Tarjeta DasherDirect (acceso instantáneo a ganancias)',
                    'Ingrese su información bancaria correctamente',
                    'Puede cambiar su método de pago después',
                    '¡Una vez aprobado, puede comenzar a hacer entregas!'
                ]
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para el Éxito',
            'items': [
                'Aplique en áreas con alta densidad de restaurantes',
                'Complete el registro durante horas pico para procesamiento más rápido',
                'Tenga todos los documentos listos antes de comenzar',
                'Use DasherDirect para pagos instantáneos',
                'Comience durante horas de almuerzo o cena para más pedidos'
            ]
        }
    }
}

INSTACART_GUIDE = {
    'en': {
        'title': 'Instacart Shopper - Complete Account Opening Guide',
        'subtitle': 'Grocery Shopping & Delivery Service',
        'intro': '''Instacart allows you to earn money by shopping for groceries at stores like Costco, Safeway, Kroger, and more, then delivering them to customers. As a Full-Service Shopper, you shop AND deliver. This guide will help you get started.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'Be at least 18 years old',
                'Be eligible to work in the United States',
                'Have access to a smartphone with iOS 14+ or Android 8+',
                'Have a reliable vehicle for deliveries',
                'Be able to lift 30+ pounds',
                'Pass a background check',
                'Have a valid driver\'s license and auto insurance'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download the Instacart Shopper App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "Instacart Shopper"',
                    'Download the app with the GREEN shopping bag icon',
                    'Do NOT download the regular Instacart customer app',
                    'Wait for the installation to complete',
                    'Open the app to begin registration'
                ]
            },
            {
                'title': 'Step 2: Create Your Shopper Account',
                'content': [
                    'Tap "Become a Shopper" or "Sign Up"',
                    'Enter your email address',
                    'Create a strong password',
                    'Enter your phone number',
                    'IMPORTANT: Enter one of the zip codes from GIG ZipFinder as your shopping zone',
                    'Choose "Full-Service Shopper" to shop AND deliver (more earnings)',
                    'In-Store Shoppers only shop and don\'t deliver'
                ]
            },
            {
                'title': 'Step 3: Complete Identity Verification',
                'content': [
                    'Enter your full legal name exactly as it appears on your ID',
                    'Enter your date of birth',
                    'Enter your Social Security Number',
                    'Take a clear photo of your driver\'s license (front and back)',
                    'Take a selfie for identity verification',
                    'Ensure your selfie matches your ID photo'
                ]
            },
            {
                'title': 'Step 4: Provide Vehicle Information',
                'content': [
                    'Enter your vehicle make and model',
                    'Enter the year of your vehicle',
                    'Provide your license plate number',
                    'Confirm your vehicle can carry grocery orders safely',
                    'Some areas allow bike or scooter delivery'
                ]
            },
            {
                'title': 'Step 5: Background Check Process',
                'content': [
                    'Consent to the background check',
                    'Instacart uses Checkr for background verification',
                    'The check reviews driving record and criminal history',
                    'Results typically take 5-10 business days',
                    'You\'ll receive an email when the check is complete',
                    'Check your spam folder for updates'
                ]
            },
            {
                'title': 'Step 6: Complete Training & Start Shopping',
                'content': [
                    'Once approved, complete the in-app tutorial',
                    'Learn how to use the app to shop efficiently',
                    'Set up your payment method (instant cashout or weekly)',
                    'Enable location services on your phone',
                    'Set your availability schedule',
                    'Start accepting batches and earning!'
                ]
            }
        ],
        'tips': {
            'title': 'Pro Tips for Success',
            'items': [
                'Apply in areas with many grocery stores',
                'Higher ratings lead to better batches',
                'Learn store layouts to shop faster',
                'Communicate with customers during shopping',
                'Weekends and holidays have higher demand'
            ]
        }
    },
    'es': {
        'title': 'Instacart Shopper - Guía Completa de Apertura de Cuenta',
        'subtitle': 'Servicio de Compras y Entrega de Abarrotes',
        'intro': '''Instacart te permite ganar dinero comprando abarrotes en tiendas como Costco, Safeway, Kroger y más, luego entregándolos a los clientes. Como Shopper de Servicio Completo, compras Y entregas. Esta guía te ayudará a comenzar.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Tener al menos 18 años de edad',
                'Ser elegible para trabajar en Estados Unidos',
                'Tener acceso a un smartphone con iOS 14+ o Android 8+',
                'Tener un vehículo confiable para entregas',
                'Poder cargar 30+ libras',
                'Pasar una verificación de antecedentes',
                'Tener licencia de conducir válida y seguro de auto'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Instacart Shopper',
                'content': [
                    'Abra la App Store (iPhone) o Google Play Store (Android)',
                    'Busque "Instacart Shopper"',
                    'Descargue la app con el ícono de bolsa de compras VERDE',
                    'NO descargue la app regular de cliente Instacart',
                    'Espere a que se complete la instalación',
                    'Abra la app para comenzar el registro'
                ]
            },
            {
                'title': 'Paso 2: Crear Su Cuenta de Shopper',
                'content': [
                    'Toque "Convertirse en Shopper" o "Registrarse"',
                    'Ingrese su dirección de correo electrónico',
                    'Cree una contraseña segura',
                    'Ingrese su número de teléfono',
                    'IMPORTANTE: Ingrese uno de los códigos postales de GIG ZipFinder como su zona de compras',
                    'Elija "Shopper de Servicio Completo" para comprar Y entregar (más ganancias)',
                    'Los Shoppers en Tienda solo compran y no entregan'
                ]
            },
            {
                'title': 'Paso 3: Completar Verificación de Identidad',
                'content': [
                    'Ingrese su nombre legal completo exactamente como aparece en su ID',
                    'Ingrese su fecha de nacimiento',
                    'Ingrese su Número de Seguro Social',
                    'Tome una foto clara de su licencia de conducir (frente y reverso)',
                    'Tome una selfie para verificación de identidad',
                    'Asegúrese de que su selfie coincida con su foto de ID'
                ]
            },
            {
                'title': 'Paso 4: Proporcionar Información del Vehículo',
                'content': [
                    'Ingrese la marca y modelo de su vehículo',
                    'Ingrese el año de su vehículo',
                    'Proporcione su número de placa',
                    'Confirme que su vehículo puede transportar pedidos de manera segura',
                    'Algunas áreas permiten entrega en bicicleta o scooter'
                ]
            },
            {
                'title': 'Paso 5: Proceso de Verificación de Antecedentes',
                'content': [
                    'Dé su consentimiento para la verificación de antecedentes',
                    'Instacart usa Checkr para verificación de antecedentes',
                    'La verificación revisa récord de manejo e historial criminal',
                    'Los resultados generalmente toman 5-10 días hábiles',
                    'Recibirá un email cuando la verificación esté completa',
                    'Revise su carpeta de spam para actualizaciones'
                ]
            },
            {
                'title': 'Paso 6: Completar Entrenamiento y Comenzar a Comprar',
                'content': [
                    'Una vez aprobado, complete el tutorial en la app',
                    'Aprenda a usar la app para comprar eficientemente',
                    'Configure su método de pago (retiro instantáneo o semanal)',
                    'Habilite servicios de ubicación en su teléfono',
                    'Configure su horario de disponibilidad',
                    '¡Comience a aceptar pedidos y a ganar!'
                ]
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para el Éxito',
            'items': [
                'Aplique en áreas con muchas tiendas de abarrotes',
                'Calificaciones más altas llevan a mejores pedidos',
                'Aprenda la distribución de las tiendas para comprar más rápido',
                'Comuníquese con los clientes durante las compras',
                'Fines de semana y días festivos tienen mayor demanda'
            ]
        }
    }
}

GOOGLE_VOICE_GUIDE = {
    'en': {
        'title': 'Google Voice - Free Second Phone Number Guide',
        'subtitle': 'Get a FREE Phone Number for Your Gig Apps',
        'intro': '''Google Voice provides a free second phone number that you can use for your gig app accounts. This keeps your personal number private and helps you manage work and personal calls separately. Here\'s how to set it up.''',
        'requirements': {
            'title': 'Requirements Before You Start',
            'items': [
                'A Google account (Gmail)',
                'A smartphone (iPhone or Android)',
                'Your current phone number (for verification)',
                'Internet connection'
            ]
        },
        'steps': [
            {
                'title': 'Step 1: Download Google Voice App',
                'content': [
                    'Open the App Store (iPhone) or Google Play Store (Android)',
                    'Search for "Google Voice"',
                    'Download the official Google Voice app (blue phone icon)',
                    'Wait for installation to complete',
                    'You can also set up via voice.google.com on a computer'
                ]
            },
            {
                'title': 'Step 2: Sign In to Google Voice',
                'content': [
                    'Open the Google Voice app',
                    'Sign in with your Google account (Gmail)',
                    'If you don\'t have a Google account, create one first',
                    'Accept the terms of service',
                    'Grant necessary permissions when prompted'
                ]
            },
            {
                'title': 'Step 3: Choose Your New Phone Number',
                'content': [
                    'Tap "Search" to find available phone numbers',
                    'Enter a city name or area code to search',
                    'Browse through the available numbers',
                    'Choose a number that\'s easy to remember',
                    'Tap "Select" on your preferred number',
                    'Numbers are completely FREE'
                ]
            },
            {
                'title': 'Step 4: Verify with Your Existing Number',
                'content': [
                    'Google will ask you to verify with your existing phone number',
                    'Enter your current mobile phone number',
                    'Choose to receive a verification code via text or call',
                    'Enter the 6-digit verification code',
                    'This links your Google Voice number to your account',
                    'Your personal number remains private'
                ]
            },
            {
                'title': 'Step 5: Set Up Your Google Voice Number',
                'content': [
                    'Your new number is now active!',
                    'Set up voicemail by recording a greeting',
                    'Enable notifications for calls and texts',
                    'Configure call forwarding if desired',
                    'Test your number by calling it from another phone'
                ]
            },
            {
                'title': 'Step 6: Use Your New Number for Gig Apps',
                'content': [
                    'When signing up for Spark, DoorDash, or Instacart, use your Google Voice number',
                    'You\'ll receive verification codes through the Google Voice app',
                    'Manage all work calls from the Google Voice app',
                    'Your personal number stays private',
                    'Works anywhere with internet connection (WiFi or data)'
                ]
            }
        ],
        'tips': {
            'title': 'Pro Tips for Using Google Voice',
            'items': [
                'Keep the Google Voice app installed on your phone',
                'Enable notifications so you don\'t miss verification codes',
                'You can use Google Voice on multiple devices',
                'Set quiet hours to avoid late-night work calls',
                'Use the web version at voice.google.com for convenience'
            ]
        }
    },
    'es': {
        'title': 'Google Voice - Guía de Segundo Número de Teléfono Gratis',
        'subtitle': 'Obtén un Número de Teléfono GRATIS para Tus Apps de Gig',
        'intro': '''Google Voice proporciona un segundo número de teléfono gratuito que puedes usar para tus cuentas de apps de gig. Esto mantiene tu número personal privado y te ayuda a administrar llamadas de trabajo y personales por separado. Aquí está cómo configurarlo.''',
        'requirements': {
            'title': 'Requisitos Antes de Comenzar',
            'items': [
                'Una cuenta de Google (Gmail)',
                'Un smartphone (iPhone o Android)',
                'Tu número de teléfono actual (para verificación)',
                'Conexión a internet'
            ]
        },
        'steps': [
            {
                'title': 'Paso 1: Descargar la App Google Voice',
                'content': [
                    'Abra la App Store (iPhone) o Google Play Store (Android)',
                    'Busque "Google Voice"',
                    'Descargue la app oficial de Google Voice (ícono de teléfono azul)',
                    'Espere a que se complete la instalación',
                    'También puede configurar vía voice.google.com en una computadora'
                ]
            },
            {
                'title': 'Paso 2: Iniciar Sesión en Google Voice',
                'content': [
                    'Abra la app de Google Voice',
                    'Inicie sesión con su cuenta de Google (Gmail)',
                    'Si no tiene una cuenta de Google, cree una primero',
                    'Acepte los términos de servicio',
                    'Otorgue los permisos necesarios cuando se le solicite'
                ]
            },
            {
                'title': 'Paso 3: Elegir Su Nuevo Número de Teléfono',
                'content': [
                    'Toque "Buscar" para encontrar números de teléfono disponibles',
                    'Ingrese el nombre de una ciudad o código de área para buscar',
                    'Explore los números disponibles',
                    'Elija un número que sea fácil de recordar',
                    'Toque "Seleccionar" en su número preferido',
                    'Los números son completamente GRATIS'
                ]
            },
            {
                'title': 'Paso 4: Verificar con Su Número Existente',
                'content': [
                    'Google le pedirá verificar con su número de teléfono existente',
                    'Ingrese su número de teléfono móvil actual',
                    'Elija recibir un código de verificación por texto o llamada',
                    'Ingrese el código de verificación de 6 dígitos',
                    'Esto vincula su número de Google Voice a su cuenta',
                    'Su número personal permanece privado'
                ]
            },
            {
                'title': 'Paso 5: Configurar Su Número de Google Voice',
                'content': [
                    '¡Su nuevo número ahora está activo!',
                    'Configure el buzón de voz grabando un saludo',
                    'Habilite notificaciones para llamadas y textos',
                    'Configure el desvío de llamadas si lo desea',
                    'Pruebe su número llamándolo desde otro teléfono'
                ]
            },
            {
                'title': 'Paso 6: Usar Su Nuevo Número para Apps de Gig',
                'content': [
                    'Al registrarse en Spark, DoorDash o Instacart, use su número de Google Voice',
                    'Recibirá códigos de verificación a través de la app Google Voice',
                    'Administre todas las llamadas de trabajo desde la app Google Voice',
                    'Su número personal se mantiene privado',
                    'Funciona en cualquier lugar con conexión a internet (WiFi o datos)'
                ]
            }
        ],
        'tips': {
            'title': 'Consejos Profesionales para Usar Google Voice',
            'items': [
                'Mantenga la app de Google Voice instalada en su teléfono',
                'Habilite notificaciones para no perder códigos de verificación',
                'Puede usar Google Voice en múltiples dispositivos',
                'Configure horas de silencio para evitar llamadas de trabajo tarde en la noche',
                'Use la versión web en voice.google.com para conveniencia'
            ]
        }
    }
}

def create_pdf(guide_content, language, output_filename, app_type):
    """Create a PDF guide from content"""
    
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = create_styles()
    story = []
    
    content = guide_content[language]
    
    # Logo
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image(LOGO_PATH, width=2.5*inch, height=2.5*inch)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 20))
        except:
            pass
    
    # Title
    story.append(Paragraph(content['title'], styles['MainTitle']))
    story.append(Paragraph(content['subtitle'], styles['SectionTitle']))
    story.append(Spacer(1, 20))
    
    # Introduction
    story.append(Paragraph(content['intro'], styles['CustomBodyText']))
    story.append(Spacer(1, 20))
    
    # Requirements
    story.append(Paragraph(content['requirements']['title'], styles['SectionTitle']))
    for item in content['requirements']['items']:
        story.append(Paragraph(f"• {item}", styles['BulletPoint']))
    story.append(Spacer(1, 20))
    
    # Steps
    for step in content['steps']:
        story.append(Paragraph(step['title'], styles['StepTitle']))
        for item in step['content']:
            story.append(Paragraph(f"• {item}", styles['BulletPoint']))
        story.append(Spacer(1, 10))
    
    # Tips
    story.append(Spacer(1, 15))
    story.append(Paragraph(content['tips']['title'], styles['SectionTitle']))
    for item in content['tips']['items']:
        story.append(Paragraph(f"✓ {item}", styles['BulletPoint']))
    
    # Footer
    story.append(Spacer(1, 30))
    footer_text = "Generated by GIG ZipFinder | www.gigzipfinder.com"
    if language == 'es':
        footer_text = "Generado por GIG ZipFinder | www.gigzipfinder.com"
    story.append(Paragraph(footer_text, styles['Footer']))
    story.append(Paragraph(f"© {datetime.now().year} GIG ZipFinder. All Rights Reserved.", styles['Footer']))
    
    doc.build(story)
    print(f"✅ Created: {output_filename}")

def generate_all_guides():
    """Generate all PDF guides in both languages"""
    
    # Create output directory
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
    for f in os.listdir(output_dir):
        print(f"  - {f}")

if __name__ == '__main__':
    generate_all_guides()
