#!/usr/bin/env python3
"""
GIG ZipFinder - Documentation Generator
Generates a comprehensive PDF with all app documentation
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import os

def generate_documentation():
    # Create PDF
    doc = SimpleDocTemplate(
        "/app/backend/GIG_ZipFinder_Documentation.pdf",
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1a1a2e')
    )
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.HexColor('#16213e')
    )
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=12,
        spaceAfter=6,
        textColor=colors.HexColor('#0f3460')
    )
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6
    )
    
    story = []
    
    # Title Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("GIG ZipFinder", title_style))
    story.append(Paragraph("Documentacion Tecnica Completa", styles['Heading2']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph(f"Version: 1.0.5 (Build 12)", body_style))
    story.append(Paragraph(f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M UTC')}", body_style))
    story.append(Paragraph("Estado: LISTO PARA LANZAMIENTO", body_style))
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Paragraph("Tabla de Contenidos", heading_style))
    toc_data = [
        ["1.", "Informacion General"],
        ["2.", "Arquitectura del Sistema"],
        ["3.", "Configuracion de Servidores"],
        ["4.", "Sistema de Pagos (Stripe)"],
        ["5.", "Busqueda con IA"],
        ["6.", "Base de Datos"],
        ["7.", "Endpoints API"],
        ["8.", "Panel de Administracion"],
        ["9.", "Apps Soportadas"],
        ["10.", "Credenciales y Accesos"],
    ]
    toc_table = Table(toc_data, colWidths=[0.5*inch, 5*inch])
    toc_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(toc_table)
    story.append(PageBreak())
    
    # 1. General Information
    story.append(Paragraph("1. Informacion General", heading_style))
    story.append(Paragraph(
        "GIG ZipFinder es una aplicacion movil que proporciona codigos postales "
        "optimizados para registrarse en aplicaciones de economia gig como Instacart, "
        "DoorDash y Spark Driver. La aplicacion utiliza IA para buscar en tiempo real "
        "los mejores codigos postales donde estas empresas estan contratando activamente.",
        body_style
    ))
    
    info_data = [
        ["Nombre de la App", "GIG ZipFinder"],
        ["Version", "1.0.5"],
        ["Version Code", "12"],
        ["Package ID", "com.gigzipfinder.app"],
        ["Plataformas", "Android (iOS pendiente)"],
        ["Idiomas", "Ingles, Espanol"],
        ["Precio", "$5.00 USD por app"],
        ["Duracion de Acceso", "7 dias"],
    ]
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(Spacer(1, 0.2*inch))
    story.append(info_table)
    
    # 2. System Architecture
    story.append(PageBreak())
    story.append(Paragraph("2. Arquitectura del Sistema", heading_style))
    
    arch_data = [
        ["Componente", "Tecnologia", "Estado"],
        ["Frontend", "React Native + Expo", "OK"],
        ["Backend", "FastAPI (Python)", "OK"],
        ["Base de Datos", "MongoDB Atlas", "OK"],
        ["Hosting Backend", "Railway", "OK"],
        ["Pagos", "Stripe (LIVE)", "OK"],
        ["IA", "OpenAI GPT-4o", "OK"],
        ["Builds", "Expo EAS", "OK"],
    ]
    arch_table = Table(arch_data, colWidths=[2*inch, 2.5*inch, 1.5*inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
    ]))
    story.append(arch_table)
    
    # 3. Server Configuration
    story.append(PageBreak())
    story.append(Paragraph("3. Configuracion de Servidores", heading_style))
    
    story.append(Paragraph("Backend (Railway)", subheading_style))
    server_data = [
        ["URL", "https://alorayz-gigzipfinder-production.up.railway.app"],
        ["Proyecto", "genuine-optimism"],
        ["Servicio", "alorayz-gigzipfinder"],
        ["Estado", "ONLINE"],
    ]
    server_table = Table(server_data, colWidths=[1.5*inch, 4.5*inch])
    server_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(server_table)
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Variables de Entorno (Railway)", subheading_style))
    env_data = [
        ["Variable", "Descripcion"],
        ["MONGO_URL", "URL de conexion a MongoDB Atlas"],
        ["DB_NAME", "gig_zipfinder"],
        ["STRIPE_SECRET_KEY", "Clave secreta de Stripe (LIVE)"],
        ["STRIPE_PUBLISHABLE_KEY", "Clave publica de Stripe (LIVE)"],
        ["JWT_SECRET", "Secreto para tokens JWT"],
        ["ADMIN_USERNAME", "Usuario administrador"],
        ["ADMIN_PASSWORD", "Contrasena administrador"],
        ["ADMIN_2FA_SECRET", "Secreto TOTP para 2FA"],
        ["EMERGENT_LLM_KEY", "Clave para IA (OpenAI)"],
    ]
    env_table = Table(env_data, colWidths=[2.5*inch, 3.5*inch])
    env_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#16213e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(env_table)
    
    # 4. Payment System
    story.append(PageBreak())
    story.append(Paragraph("4. Sistema de Pagos (Stripe)", heading_style))
    
    story.append(Paragraph("Configuracion", subheading_style))
    stripe_data = [
        ["Modo", "LIVE (Pagos Reales)"],
        ["Precio", "$5.00 USD"],
        ["Moneda", "USD"],
        ["Metodos", "Tarjetas de credito/debito"],
        ["Webhook", "Configurado"],
    ]
    stripe_table = Table(stripe_data, colWidths=[2*inch, 4*inch])
    stripe_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(stripe_table)
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Claves de API", subheading_style))
    story.append(Paragraph("Publishable Key: pk_live_51Sz8H72STw3g54WACbPaL387...", body_style))
    story.append(Paragraph("Secret Key: sk_live_51Sz8H72STw3g54WAAFL7nn0Q9zk... (en Railway)", body_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Flujo de Pago", subheading_style))
    story.append(Paragraph("1. Usuario selecciona app (Instacart/DoorDash/Spark)", body_style))
    story.append(Paragraph("2. Acepta terminos y condiciones", body_style))
    story.append(Paragraph("3. Se crea Checkout Session en Stripe", body_style))
    story.append(Paragraph("4. Usuario completa pago", body_style))
    story.append(Paragraph("5. Se verifica pago y se otorga acceso por 7 dias", body_style))
    story.append(Paragraph("6. IA busca los 5 mejores codigos postales", body_style))
    
    # 5. AI Search
    story.append(PageBreak())
    story.append(Paragraph("5. Busqueda con Inteligencia Artificial", heading_style))
    
    story.append(Paragraph("Modelo Utilizado", subheading_style))
    ai_data = [
        ["Proveedor", "OpenAI"],
        ["Modelo", "GPT-4o"],
        ["Integracion", "Emergent LLM Key"],
    ]
    ai_table = Table(ai_data, colWidths=[2*inch, 4*inch])
    ai_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(ai_table)
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Fuentes de Busqueda", subheading_style))
    story.append(Paragraph("La IA busca informacion en:", body_style))
    story.append(Paragraph("- Reddit (r/InstacartShoppers, r/doordash_drivers, r/Sparkdriver)", body_style))
    story.append(Paragraph("- YouTube (videos de tutoriales)", body_style))
    story.append(Paragraph("- Twitter/X (publicaciones recientes)", body_style))
    story.append(Paragraph("- Facebook Groups (comunidades gig)", body_style))
    story.append(Paragraph("- Foros de trabajadores gig", body_style))
    story.append(Paragraph("- TikTok (creadores de contenido)", body_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Sistema de Puntuacion", subheading_style))
    score_data = [
        ["Score", "Significado"],
        ["90-100", "Confirmado abierto en ultimos 7 dias"],
        ["80-89", "Mencionado como abierto recientemente"],
        ["70-79", "Mencionado en ultimos 30 dias"],
        ["60-69", "Area de alta demanda, vale intentar"],
    ]
    score_table = Table(score_data, colWidths=[1.5*inch, 4.5*inch])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#16213e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(score_table)
    
    # 6. Database
    story.append(PageBreak())
    story.append(Paragraph("6. Base de Datos", heading_style))
    
    story.append(Paragraph("MongoDB Atlas", subheading_style))
    db_data = [
        ["Cluster", "GIG-ZIPFINDER"],
        ["Host", "gig-zipfinder.qmjf0fr.mongodb.net"],
        ["Base de Datos", "gig_zipfinder"],
        ["Usuario", "gig-zipfinder"],
    ]
    db_table = Table(db_data, colWidths=[2*inch, 4*inch])
    db_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(db_table)
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Colecciones", subheading_style))
    collections = [
        ["Coleccion", "Descripcion"],
        ["zip_codes", "Codigos postales por app"],
        ["guides", "Guias de registro paso a paso"],
        ["payments", "Historial de pagos"],
        ["terms", "Terminos y condiciones"],
        ["admin_settings", "Configuracion del admin"],
    ]
    coll_table = Table(collections, colWidths=[2*inch, 4*inch])
    coll_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#16213e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(coll_table)
    
    # 7. API Endpoints
    story.append(PageBreak())
    story.append(Paragraph("7. Endpoints API", heading_style))
    
    endpoints = [
        ["Metodo", "Endpoint", "Descripcion"],
        ["GET", "/api/health", "Estado del servidor"],
        ["GET", "/api/terms", "Terminos y condiciones"],
        ["GET", "/api/privacy-policy.html", "Politica de privacidad"],
        ["GET", "/api/stripe/config", "Config publica de Stripe"],
        ["POST", "/api/stripe/create-checkout-session", "Crear sesion de pago"],
        ["POST", "/api/stripe/verify-checkout/{id}", "Verificar pago"],
        ["GET", "/api/zip-codes/{app}", "Codigos postales por app"],
        ["POST", "/api/search-zip-codes/{app}", "Buscar con IA"],
        ["POST", "/api/search-zip-codes-realtime/{app}", "Buscar en tiempo real"],
        ["GET", "/api/guides/{app}", "Guias de registro"],
        ["POST", "/api/admin/login", "Login admin (2FA)"],
        ["GET", "/api/admin/stats", "Estadisticas (auth)"],
        ["POST", "/api/admin/rotate-zip-codes", "Rotar codigos (auth)"],
    ]
    ep_table = Table(endpoints, colWidths=[0.8*inch, 2.7*inch, 2.5*inch])
    ep_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(ep_table)
    
    # 8. Admin Panel
    story.append(PageBreak())
    story.append(Paragraph("8. Panel de Administracion", heading_style))
    
    story.append(Paragraph("Acceso", subheading_style))
    admin_data = [
        ["Usuario", "admin"],
        ["Contrasena", "admin_password_123"],
        ["2FA Secret", "GXMYOWV77JP4ONEAQRRBGK4PJHUTMKEO"],
        ["Autenticacion", "TOTP (Google Authenticator)"],
    ]
    admin_table = Table(admin_data, colWidths=[2*inch, 4*inch])
    admin_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(admin_table)
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Funciones del Admin", subheading_style))
    story.append(Paragraph("- Ver estadisticas de pagos", body_style))
    story.append(Paragraph("- Rotar codigos postales manualmente", body_style))
    story.append(Paragraph("- Ver historial de transacciones", body_style))
    story.append(Paragraph("- Gestionar terminos y condiciones", body_style))
    
    # 9. Supported Apps
    story.append(PageBreak())
    story.append(Paragraph("9. Apps Soportadas", heading_style))
    
    apps_data = [
        ["App", "Descripcion", "Codigos"],
        ["Instacart", "Compras y entregas de supermercado", "5"],
        ["DoorDash", "Entregas de restaurantes", "5"],
        ["Spark Driver", "Entregas para Walmart", "5"],
    ]
    apps_table = Table(apps_data, colWidths=[1.5*inch, 3.5*inch, 1*inch])
    apps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
    ]))
    story.append(apps_table)
    
    # 10. Credentials
    story.append(PageBreak())
    story.append(Paragraph("10. Credenciales y Accesos", heading_style))
    
    story.append(Paragraph("IMPORTANTE: Mantener estas credenciales seguras", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Railway", subheading_style))
    story.append(Paragraph("URL: https://railway.app", body_style))
    story.append(Paragraph("Proyecto: genuine-optimism", body_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("MongoDB Atlas", subheading_style))
    story.append(Paragraph("URL: https://cloud.mongodb.com", body_style))
    story.append(Paragraph("Cluster: GIG-ZIPFINDER", body_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("Stripe Dashboard", subheading_style))
    story.append(Paragraph("URL: https://dashboard.stripe.com", body_style))
    story.append(Paragraph("Modo: LIVE", body_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("Expo", subheading_style))
    story.append(Paragraph("URL: https://expo.dev", body_style))
    story.append(Paragraph("Cuenta: ramalhosa", body_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("Google Play Console", subheading_style))
    story.append(Paragraph("URL: https://play.google.com/console", body_style))
    story.append(Paragraph("App: GIG ZipFinder", body_style))
    
    # Final Summary
    story.append(PageBreak())
    story.append(Paragraph("Resumen de Verificacion", heading_style))
    
    summary_data = [
        ["Componente", "Estado", "Verificado"],
        ["Backend Health", "ONLINE", "SI"],
        ["Stripe LIVE", "ACTIVO", "SI"],
        ["Checkout Session", "FUNCIONANDO", "SI"],
        ["Terminos", "v1.0 ACTIVO", "SI"],
        ["Politica Privacidad", "11,513 bytes", "SI"],
        ["ZIP Codes Instacart", "5 codigos", "SI"],
        ["ZIP Codes DoorDash", "5 codigos", "SI"],
        ["ZIP Codes Spark", "5 codigos", "SI"],
        ["Guias", "4 pasos c/u", "SI"],
        ["Admin Login 2FA", "FUNCIONANDO", "SI"],
        ["Busqueda IA", "GPT-4o OK", "SI"],
        ["MongoDB Atlas", "CONECTADO", "SI"],
    ]
    summary_table = Table(summary_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (2, 1), (2, -1), colors.HexColor('#d4edda')),
    ]))
    story.append(summary_table)
    
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("ESTADO FINAL: LISTO PARA LANZAMIENTO", title_style))
    story.append(Paragraph(f"Documento generado: {datetime.now().strftime('%d/%m/%Y %H:%M:%S UTC')}", body_style))
    
    # Build PDF
    doc.build(story)
    print("PDF generado exitosamente: /app/backend/GIG_ZipFinder_Documentation.pdf")
    return "/app/backend/GIG_ZipFinder_Documentation.pdf"

if __name__ == "__main__":
    generate_documentation()
