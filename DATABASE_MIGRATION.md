# Arquitectura de Base de Datos - Migración Supabase → PostgreSQL Propio

## Visión General

Este documento describe cómo migramos de **Supabase** (temporalmente) a un **servidor PostgreSQL independiente** cuando eports tenga su propia infraestructura.

```
┌─────────────────────────────────────────────────┐
│  FASE 1: Desarrollo & Demo (Actual)            │
│  ├─ Supabase Gratuito (Temporal)               │
│  ├─ localhost:5173 (Vite Dev)                  │
│  └─ Deploy a Netlify para demo a dirección     │
├─────────────────────────────────────────────────┤
│  FASE 2: Producción (eports)                   │
│  ├─ PostgreSQL en servidor propio              │
│  ├─ API Backend customizado (Express/Node)     │
│  └─ Deploy en servidor corporativo             │
└─────────────────────────────────────────────────┘
```

## FASE 1: Desarrollo con Supabase

### Setup Supabase Gratuito

1. **Crear cuenta en https://supabase.com**
   ```
   Email: tu-email@eports.com
   Proyecto: eportstech-portal-dev
   Región: eu-west-1 (Europa)
   ```

2. **Obtener credenciales**
   - URL: `https://[project-id].supabase.co`
   - Anon Key: Desde Project Settings → API Keys
   - Service Role Key: ⚠️ Guardar en secreto

3. **Crear tablas** (ejecutar en SQL Editor)

```sql
-- 1. BRAND CONFIGURATION
CREATE TABLE brand_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  siteName TEXT NOT NULL DEFAULT 'EportsTech',
  favicon TEXT,
  navLogo TEXT DEFAULT '/logo-blue.png',
  footerLogo TEXT DEFAULT '/logo-white.png',
  contactEmail TEXT DEFAULT 'contact@eportstech.com',
  contactPhone TEXT DEFAULT '+34 900 123 456',
  heroImage TEXT DEFAULT '/hq-background.jpg',
  heroTitle JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroSubtitle JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroCtaText JSONB DEFAULT '{"es":"","ca":"","en":"","fr":"","de":"","it":""}',
  heroOverlayOpacity DECIMAL DEFAULT 0.6,
  heroPosition TEXT DEFAULT 'center',
  benefitsTitle JSONB,
  benefitsSubtitle JSONB,
  benefitsItems JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. LEADS (Formulario de contacto)
CREATE TABLE leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  serviceInterest TEXT,
  message TEXT NOT NULL,
  address TEXT,
  city TEXT,
  source TEXT DEFAULT 'contact-form',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. CONFIGURATOR LEADS (Presupuestos personalizados)
CREATE TABLE configurator_leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fullName TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  selectedItems JSONB NOT NULL,
  estimatedValue DECIMAL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. CHATBOT CONFIGURATION
CREATE TABLE bot_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT DEFAULT 'EportsTech Assistant',
  tone TEXT DEFAULT 'professional',
  responseLength TEXT DEFAULT 'balanced',
  highlightedProduct TEXT,
  businessHoursStart TEXT DEFAULT '09:00',
  businessHoursEnd TEXT DEFAULT '18:00',
  timezone TEXT DEFAULT 'Europe/Madrid',
  limitations JSONB,
  qualifyingQuestions JSONB,
  customInstructions TEXT,
  knowledgeBase JSONB,
  updated_at TIMESTAMP DEFAULT now()
);

-- 5. NOTIFICATION SETTINGS
CREATE TABLE notification_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  emailRecipients JSONB NOT NULL,
  notifyOnLead BOOLEAN DEFAULT true,
  notifyOnConfigurator BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. SERVICES (Servicios dinámicos)
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  icon TEXT,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  extendedDescription JSONB,
  features JSONB,
  category TEXT,
  visible BOOLEAN DEFAULT true,
  order_idx INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 7. CONFIGURATOR ITEMS
CREATE TABLE configurator_items (
  id TEXT PRIMARY KEY,
  icon TEXT,
  category TEXT,
  title JSONB NOT NULL,
  benefit JSONB NOT NULL,
  visible BOOLEAN DEFAULT true,
  order_idx INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 8. USERS (Admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE brand_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Ejemplo para leads - lectura pública)
CREATE POLICY "leads_insert" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read_leads" ON leads
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.email() IN (SELECT email FROM users WHERE role = 'admin')
  );

-- Indexes para performance
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_configurator_created ON configurator_leads(created_at DESC);
CREATE INDEX idx_services_visible ON services(visible);
```

4. **Configurar Storage** (para archivos/imágenes)
   - Ir a Storage → New Bucket
   - Crear bucket `brand-assets`
   - Crear bucket `uploads`
   - Configurar políticas de acceso público si es necesario

5. **Configurar Auth** (para Admin)
   - Authentication → Providers
   - Habilitar Email/Password
   - Crear usuario admin: admin@eportstech.com

### Variables de Entorno (Fase 1)

```env
# .env.local
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_GOOGLE_GEMINI_API_KEY=[gemini-api-key]
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## FASE 2: Migración a PostgreSQL Propio (Futuro)

### Cuando eports tenga servidor:

```
┌──────────────────────────┐
│  Servidor corporativo    │
│  ┌────────────────────┐  │
│  │  PostgreSQL DB     │  │
│  ├────────────────────┤  │
│  │  Express API       │  │
│  │  (Node.js)         │  │
│  └────────────────────┘  │
└──────────────────────────┘
          ↑
          │ REST/GraphQL
          │
┌──────────────────────────┐
│  React App               │
│  (Misma, sin cambios)    │
└──────────────────────────┘
```

### Pasos de Migración:

1. **Exportar datos desde Supabase**
   ```bash
   # Using pg_dump
   pg_dump "postgresql://user:password@host/database" > backup.sql
   ```

2. **Crear Backend Express**
   ```typescript
   // api/server.ts
   import express from 'express';
   import { Pool } from 'pg';

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL
   });

   app.post('/api/leads', async (req, res) => {
     const { fullName, email, phone, company, message } = req.body;
     const result = await pool.query(
       'INSERT INTO leads (fullName, email, phone, company, message) VALUES ($1, $2, $3, $4, $5)',
       [fullName, email, phone, company, message]
     );
     res.json(result.rows[0]);
   });
   ```

3. **Actualizar cliente en React**
   - Cambiar `supabaseClient.ts` para usar API propia
   - Mantener misma interfaz (cero cambios en componentes)

   ```typescript
   // services/apiClient.ts
   const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

   export const fetchLeads = async () => {
     const res = await fetch(`${API_URL}/leads`);
     return res.json();
   };
   ```

4. **Deployment en servidor propio**
   - Configurar PostgreSQL
   - Deployer Express API
   - Configurar proxy/nginx hacia React SPA
   - SSL certificados

### Ventajas de esta arquitectura:

✅ **Fase 1 (Supabase):**
- Setup rápido, sin ops
- Perfecto para demo
- Límites generosos de free tier
- Scaling automático

✅ **Fase 2 (PostgreSQL propio):**
- Control total de datos
- Zero vendor lock-in
- Costos predecibles
- Escalabilidad controlada
- Compliance y seguridad a medida

## Monitoreo y Debugging

### En Desarrollo (Supabase):
```typescript
// Enable debug logs
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Debug': 'true'
    }
  }
});
```

### Queries útiles Supabase:
```sql
-- Ver leads recientes
SELECT * FROM leads ORDER BY created_at DESC LIMIT 10;

-- Contar leads por servicio
SELECT serviceInterest, COUNT(*) as count FROM leads 
GROUP BY serviceInterest;

-- Verificar salud BD
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Backups y Recuperación

### Supabase:
- Backups automáticos diarios (plan Pro+)
- Manual backup: Project Settings → Backups → Download

### PostgreSQL Propio:
```bash
# Backup diario
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql

# Restaurar
psql $DATABASE_URL < /backups/db-20240101.sql
```

## Seguridad

### Credenciales
- 🔒 NUNCA commitear `.env.local`
- 🔑 Service Role Key solo en servidor (nunca en cliente)
- 🚨 Rotar keys regularmente

### Database
- Usar RLS (Row Level Security) en Supabase
- Validar inputs en backend
- SQL injection prevention (prepared statements)
- CORS configurado correctamente

### API Propia
- Authentication tokens (JWT)
- Rate limiting
- HTTPS obligatorio
- CORS whitelist

## Costos

### Supabase Gratuito:
- ✅ BD: 500MB
- ✅ API: 500K requests/mes
- ✅ Auth: 50 users
- ✅ Storage: 1GB
- Perfecto para desarrollo y demo

### PostgreSQL Propio:
- Hardware: Variable
- Mantenimiento: Interno
- Escalabilidad: Control total

## Contactos

- **Soporte Supabase**: https://supabase.com/support
- **Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions

---

**Estado**: Fase 1 Activa (Supabase)  
**Próximo**: Fase 2 cuando eports tenga infraestructura propia  
**Última actualización**: Diciembre 2024
