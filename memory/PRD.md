# GIG ZipFinder - Product Requirements Document (PRD)

## Original Problem Statement
El usuario quiere crear una aplicación móvil para Android e iOS que proporcione guías y códigos postales para aplicaciones de economía gig (Instacart, DoorDash, Spark Driver).

## Core Requirements
1. **Códigos Postales AI**: Proporcionar 5 códigos postales generados por IA para ciudades de EE.UU. con alta demanda para apps gig
2. **Búsqueda en Tiempo Real**: La IA busca en Reddit, YouTube, Twitter, foros para encontrar los códigos más recientes
3. **Códigos Distintos**: Códigos diferentes para cada app gig, rotación automática semanal
4. **Expiración**: Acceso de 7 días después de la compra
5. **Panel Admin**: Login funcional, ver pagos, rotar códigos manualmente
6. **Pagos LIVE**: Usar claves Stripe LIVE para pagos reales de $5.00 USD

## User Personas
- **Usuario Principal**: Trabajadores que buscan registrarse en apps de delivery
- **Administrador**: Gestión de códigos postales y monitoreo de pagos

## Architecture
```
Frontend: React Native + Expo
Backend: FastAPI (Python) en Railway
Database: MongoDB Atlas
AI: OpenAI GPT-4o con Emergent LLM Key
Payments: Stripe LIVE
```

## What's Been Implemented
- [x] Backend completo con FastAPI
- [x] Despliegue en Railway (producción permanente)
- [x] MongoDB Atlas conectado
- [x] Stripe LIVE integrado
- [x] Búsqueda AI en tiempo real (Reddit, YouTube, Twitter, Foros)
- [x] Panel de administración con 2FA
- [x] Rotación automática de códigos postales
- [x] Términos y condiciones bilingües
- [x] Deep linking para la app móvil
- [x] Múltiples builds AAB generados

## Prioritized Backlog

### P0 (Critical)
- [x] ~~Revisión final de la aplicación~~
- [x] ~~Documentación PDF creada~~
- [ ] Generar AAB versión 1.0.6 final

### P1 (High Priority)
- [ ] Build iOS (IPA) - requiere credenciales Apple Developer
- [ ] Probar app en dispositivo físico via Expo Go

### P2 (Medium Priority)
- [ ] Notificaciones push cuando hay nuevos códigos
- [ ] Sistema de referidos
- [ ] Historial de compras del usuario

### P3 (Low Priority)
- [ ] Analytics avanzados
- [ ] Soporte para más apps gig
- [ ] Chat de soporte in-app

## Key URLs
- **Railway Backend**: https://alorayz-gigzipfinder-production.up.railway.app
- **Expo Project**: ramalhosa/gig-zipfinder

## Status
**Fecha**: Febrero 2026  
**Estado**: Revisión completada, listo para AAB final
