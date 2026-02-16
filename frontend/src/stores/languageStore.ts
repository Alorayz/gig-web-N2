import { create } from 'zustand';

interface LanguageState {
  language: 'en' | 'es';
  isLoading: boolean;
  setLanguage: (lang: 'en' | 'es') => void;
  t: (key: string) => string;
}

// Brand colors from logo
export const COLORS = {
  // Primary colors
  primaryDark: '#1a2a4a',      // Navy blue from logo
  primaryLight: '#2a3a5a',    // Lighter navy
  accent: '#00b4d8',          // Electric blue/cyan arrow
  accentLight: '#48cae4',     // Light cyan
  
  // Metallic/Silver
  silver: '#a8b2c1',
  silverLight: '#d1d5db',
  
  // Background
  background: '#0d1525',      // Dark background
  backgroundLight: '#1a2a4a', // Card background
  surface: '#243454',         // Surface color
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#a8b2c1',
  textMuted: '#6b7280',
  
  // Status
  success: '#00b4d8',
  error: '#ef4444',
  warning: '#f59e0b',
};

const translations: Record<string, Record<string, string>> = {
  en: {
    // Home Screen
    'app.title': 'GIG ZipFinder',
    'app.subtitle': 'Find Your Next Opportunity',
    'app.description': 'Get access to zip codes with availability for Instacart, DoorDash, and Spark Driver plus step-by-step guides!',
    'app.getStarted': 'Get Started - $5.00',
    'app.selectLanguage': 'Select Language',
    'app.adminAccess': 'Admin Access',
    
    // Select App Screen
    'select.title': 'Select Your App',
    'select.subtitle': 'Choose which gig app you want to open',
    'select.spark': 'Spark Driver',
    'select.doordash': 'DoorDash',
    'select.instacart': 'Instacart',
    'select.sparkDesc': 'Walmart delivery service',
    'select.doordashDesc': 'Food & grocery delivery',
    'select.instacartDesc': 'Grocery shopping & delivery',
    'select.perApp': '$5.00 per app',
    
    // Terms Screen
    'terms.title': 'Terms & Conditions',
    'terms.accept': 'I Accept the Terms & Conditions',
    'terms.continue': 'Continue to Payment',
    'terms.mustAccept': 'You must accept the terms to continue',
    
    // Payment Screen
    'payment.title': 'Complete Payment',
    'payment.amount': '$5.00 USD',
    'payment.description': 'Payment for app opening guides and zip code suggestions',
    'payment.processing': 'Processing Payment...',
    'payment.verifying': 'Verifying Payment...',
    'payment.pay': 'Pay $5.00',
    'payment.secure': 'Secure payment powered by Stripe',
    'payment.includes': 'Your purchase includes:',
    'payment.item1': '5 zip codes with high availability potential',
    'payment.item2': 'Comprehensive step-by-step account opening guide',
    'payment.item3': 'Complete free phone number guide',
    'payment.success': 'Payment Successful!',
    'payment.failed': 'Payment Failed',
    'payment.tryAgain': 'Please try again',
    
    // Results Screen
    'results.title': 'Your Results',
    'results.zipCodes': 'Available Zip Codes',
    'results.guide': 'Opening Guide',
    'results.voiceGuide': 'Free Phone Number Guide',
    'results.score': 'Availability Score',
    'results.noZipCodes': 'No zip codes available at this time',
    'results.tryAnother': 'Try Another App',
    'results.backHome': 'Back to Home',
    'results.downloadPdf': 'Download PDF Guide',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.totpCode': '2FA Code (Google Authenticator)',
    'admin.loginBtn': 'Login',
    'admin.dashboard': 'Admin Dashboard',
    'admin.payments': 'Payments',
    'admin.zipCodes': 'Zip Codes',
    'admin.guides': 'Guides',
    'admin.stats': 'Statistics',
    'admin.logout': 'Logout',
    'admin.totalRevenue': 'Total Revenue',
    'admin.totalPayments': 'Total Payments',
    'admin.successfulPayments': 'Successful',
    'admin.aiSearch': 'AI Search',
    'admin.addZipCode': 'Add Zip Code',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.retry': 'Retry',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.cancel': 'Cancel',
    'general.save': 'Save',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
  },
  es: {
    // Home Screen
    'app.title': 'GIG ZipFinder',
    'app.subtitle': 'Encuentra Tu Próxima Oportunidad',
    'app.description': '¡Obtén acceso a códigos postales con disponibilidad para Instacart, DoorDash y Spark Driver más guías paso a paso!',
    'app.getStarted': 'Comenzar - $5.00',
    'app.selectLanguage': 'Seleccionar Idioma',
    'app.adminAccess': 'Acceso Admin',
    
    // Select App Screen
    'select.title': 'Selecciona Tu App',
    'select.subtitle': 'Elige qué aplicación de gig quieres abrir',
    'select.spark': 'Spark Driver',
    'select.doordash': 'DoorDash',
    'select.instacart': 'Instacart',
    'select.sparkDesc': 'Servicio de entrega de Walmart',
    'select.doordashDesc': 'Entrega de comida y abarrotes',
    'select.instacartDesc': 'Compras y entrega de abarrotes',
    'select.perApp': '$5.00 por app',
    
    // Terms Screen
    'terms.title': 'Términos y Condiciones',
    'terms.accept': 'Acepto los Términos y Condiciones',
    'terms.continue': 'Continuar al Pago',
    'terms.mustAccept': 'Debe aceptar los términos para continuar',
    
    // Payment Screen
    'payment.title': 'Completar Pago',
    'payment.amount': '$5.00 USD',
    'payment.description': 'Pago por guías de apertura de apps y sugerencias de códigos postales',
    'payment.processing': 'Procesando Pago...',
    'payment.verifying': 'Verificando Pago...',
    'payment.pay': 'Pagar $5.00',
    'payment.secure': 'Pago seguro con Stripe',
    'payment.includes': 'Tu compra incluye:',
    'payment.item1': '5 códigos postales con alto potencial de disponibilidad',
    'payment.item2': 'Guía completa paso a paso para abrir cuenta',
    'payment.item3': 'Guía completa de número de teléfono gratuito',
    'payment.success': '¡Pago Exitoso!',
    'payment.failed': 'Pago Fallido',
    'payment.tryAgain': 'Por favor intente de nuevo',
    
    // Results Screen
    'results.title': 'Tus Resultados',
    'results.zipCodes': 'Códigos Postales Disponibles',
    'results.guide': 'Guía de Apertura',
    'results.voiceGuide': 'Guía Número Gratuito',
    'results.score': 'Puntuación de Disponibilidad',
    'results.noZipCodes': 'No hay códigos postales disponibles en este momento',
    'results.tryAnother': 'Probar Otra App',
    'results.backHome': 'Volver al Inicio',
    'results.downloadPdf': 'Descargar Guía PDF',
    
    // Admin
    'admin.login': 'Acceso Admin',
    'admin.username': 'Usuario',
    'admin.password': 'Contraseña',
    'admin.totpCode': 'Código 2FA (Google Authenticator)',
    'admin.loginBtn': 'Iniciar Sesión',
    'admin.dashboard': 'Panel de Admin',
    'admin.payments': 'Pagos',
    'admin.zipCodes': 'Códigos Postales',
    'admin.guides': 'Guías',
    'admin.stats': 'Estadísticas',
    'admin.logout': 'Cerrar Sesión',
    'admin.totalRevenue': 'Ingresos Totales',
    'admin.totalPayments': 'Total de Pagos',
    'admin.successfulPayments': 'Exitosos',
    'admin.aiSearch': 'Búsqueda IA',
    'admin.addZipCode': 'Agregar Código Postal',
    
    // General
    'general.loading': 'Cargando...',
    'general.error': 'Ocurrió un error',
    'general.retry': 'Reintentar',
    'general.back': 'Atrás',
    'general.next': 'Siguiente',
    'general.cancel': 'Cancelar',
    'general.save': 'Guardar',
    'general.delete': 'Eliminar',
    'general.edit': 'Editar',
  },
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  isLoading: false,
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get();
    return translations[language]?.[key] || key;
  },
}));
