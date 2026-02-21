# GIG ZIPFINDER - DOCUMENTACIÓN COMPLETA
## Manual del Proyecto y Credenciales

---

## 1. INFORMACIÓN GENERAL

**Nombre de la App**: GIG ZipFinder  
**Versión**: 1.0.5  
**Plataformas**: Android (Google Play Store), iOS (próximamente)  
**Fecha de Documentación**: Febrero 2026

---

## 2. URLS Y ENDPOINTS

### Backend de Producción (Railway)
- **URL Base**: `https://alorayz-gigzipfinder-production.up.railway.app`
- **Health Check**: `https://alorayz-gigzipfinder-production.up.railway.app/api/health`

### Endpoints Principales
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/health` | GET | Verificar estado del servidor |
| `/api/stripe/config` | GET | Obtener clave pública de Stripe |
| `/api/stripe/create-checkout-session` | POST | Crear sesión de pago |
| `/api/stripe/verify-checkout/{session_id}` | POST | Verificar pago completado |
| `/api/search-zip-codes-realtime/{app_name}` | POST | Búsqueda AI de códigos postales |
| `/api/search-zip-codes/{app_name}` | POST | Búsqueda AI estándar |
| `/api/zip-codes/{app_name}` | GET | Obtener códigos postales por app |
| `/api/guides/{app_name}` | GET | Obtener guías por app |
| `/api/terms` | GET | Obtener términos y condiciones |
| `/api/admin/login` | POST | Login de administrador |
| `/api/admin/stats` | GET | Estadísticas de pagos |
| `/api/admin/rotate-zip-codes` | POST | Rotar códigos postales manualmente |

---

## 3. CREDENCIALES

### Stripe (MODO LIVE - Producción)
```
STRIPE_SECRET_KEY=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

STRIPE_PUBLISHABLE_KEY=pk_live_51Sz8H72STw3g54WACbPaL387dozfL7vQRaf5puX5DolEoVdM16B27RMfOlCC8NNOtXc2yXBeAA2G4QG5aXOqgeyc00WNUE0AhH
```

### MongoDB Atlas (Base de Datos)
```
MONGO_URL=mongodb+srv://gigzipfinder:YOUR_MONGODB_PASSWORD@cluster.mongodb.net/gig_zipfinder?retryWrites=true&w=majority
DB_NAME=gig_zipfinder
```
*Nota: La conexión a MongoDB Atlas está configurada en Railway*

### API de IA (Emergent LLM Key)
```
EMERGENT_LLM_KEY=sk-emergent-5925220033f944a85B
```

### Panel de Administración
```
Usuario: admin
Contraseña: admin_password_123
TOTP Secret: GXMYOWV77JP4ONEAQRRBGK4PJHUTMKEO
```
*Nota: Escanear el código QR con Google Authenticator para 2FA*

---

## 4. FUNCIONALIDADES

### Búsqueda de Códigos Postales con IA
La aplicación utiliza **GPT-4o** para buscar códigos postales en tiempo real:
- Busca en **Reddit** (r/InstacartShoppers, r/doordash_drivers, r/Sparkdriver)
- Busca en **YouTube** (videos recientes sobre registro)
- Busca en **Twitter/X** y **Facebook Groups**
- Busca en **Foros** de trabajadores gig

### Apps Soportadas
1. **Instacart** - Shopper
2. **DoorDash** - Driver/Dasher
3. **Spark Driver** - Walmart Delivery

### Flujo de Usuario
1. Usuario abre la app
2. Selecciona el idioma (Inglés/Español)
3. Selecciona la aplicación (Instacart, DoorDash, Spark)
4. Acepta términos y condiciones
5. Paga $5.00 USD vía Stripe
6. Recibe 5 códigos postales con fuentes y razones
7. Acceso válido por 7 días

### Rotación de Códigos Postales
- Los códigos postales se rotan **automáticamente cada semana**
- El admin puede forzar rotación manual desde el panel
- Cada app tiene diferentes conjuntos de códigos

---

## 5. ARQUITECTURA TÉCNICA

### Frontend (React Native/Expo)
```
/app/frontend/
├── app/                    # Pantallas y rutas
│   ├── (tabs)/            # Pestañas principales
│   └── results.tsx        # Pantalla de resultados
├── src/
│   ├── stores/            # Estado global (Zustand)
│   ├── services/          # API y servicios
│   └── components/        # Componentes reutilizables
├── app.json               # Configuración de Expo
└── eas.json               # Configuración de builds
```

### Backend (FastAPI)
```
/app/backend/
├── server.py              # Servidor principal
├── railway.toml           # Configuración de Railway
├── requirements.txt       # Dependencias Python
└── Dockerfile             # Container para Railway
```

---

## 6. DESPLIEGUE

### Railway (Backend)
- **URL del Proyecto**: https://railway.app/project/alorayz-gigzipfinder
- **Comando de Inicio**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Health Check**: `/api/health`

### Google Play Store
- **Package Name**: `com.gigzipfinder.app`
- **Version Code**: 12
- **Versión**: 1.0.5
- **Cuenta Expo**: ramalhosa

### Generar Nuevo Build (AAB)
```bash
cd /app/frontend
# Incrementar versionCode en app.json
npx eas build --platform android --profile production
```

---

## 7. ESQUEMA DE BASE DE DATOS

### Colección: zip_codes
```json
{
  "id": "uuid",
  "zip_code": "12345",
  "city": "Ciudad",
  "state": "ST",
  "app_name": "instacart|doordash|spark",
  "availability_score": 85,
  "source": "realtime_web_search|ai_search|manual",
  "reason": "Mencionado en Reddit...",
  "expires_at": "2026-02-28T00:00:00"
}
```

### Colección: payments
```json
{
  "id": "uuid",
  "user_id": "device_id",
  "stripe_payment_intent_id": "cs_...",
  "app_name": "instacart",
  "amount": 500,
  "status": "succeeded|pending|failed",
  "created_at": "2026-02-21T00:00:00"
}
```

### Colección: admins
```json
{
  "id": "uuid",
  "username": "admin",
  "password_hash": "sha256...",
  "totp_secret": "BASE32...",
  "is_active": true
}
```

---

## 8. SOLUCIÓN DE PROBLEMAS

### El backend no responde
1. Verificar Railway: https://railway.app
2. Revisar logs de deployment
3. Verificar que MONGO_URL esté configurado

### Pagos no funcionan
1. Verificar claves Stripe en Railway
2. Confirmar que son claves LIVE (sk_live_...)
3. Revisar webhook de Stripe

### Búsqueda AI falla
1. Verificar EMERGENT_LLM_KEY en Railway
2. Revisar logs para errores de parsing JSON
3. Fallback a códigos en caché

---

## 9. PRÓXIMOS PASOS

- [ ] Generar AAB versión 1.0.6 para Google Play
- [ ] Configurar Apple Developer para iOS
- [ ] Agregar notificaciones push
- [ ] Implementar sistema de referidos

---

## 10. DESCARGAS Y BUILDS

### Links de Descarga (Expo EAS)

| Tipo | Perfil | Link |
|------|--------|------|
| AAB (Google Play) | production | https://expo.dev/accounts/alorayz1/projects/gig-zipfinder/builds/e8d5786c-4555-4086-a9af-4f7ea9b2e8de |
| APK (Instalación directa) | preview-apk | https://expo.dev/accounts/alorayz1/projects/gig-zipfinder/builds/c236abb6-912a-41d9-ac74-589dea12bbc2 |

### Panel de Builds
- **Todos los builds**: https://expo.dev/accounts/alorayz1/projects/gig-zipfinder/builds

### Versión Actual
- **Versión**: 1.0.6
- **Version Code**: 13
- **Fecha Build**: Febrero 2026

---

**Última Actualización**: Febrero 2026
**Contacto Técnico**: support@gigzipfinder.app
