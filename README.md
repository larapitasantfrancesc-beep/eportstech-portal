# EportsTech Portal

Portal web corporatiu per a empreses de serveis tecnològics, telecomunicacions i IT. Inclou gestió de leads, chatbot amb IA (Google Gemini/Gemma), configurador de solucions i panell d'administració.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)

## 📋 Taula de continguts

- [Característiques](#-característiques)
- [Arquitectura](#-arquitectura)
- [Requisits](#-requisits)
- [Instal·lació ràpida](#-installació-ràpida)
- [Configuració de Supabase](#-configuració-de-supabase)
- [Variables d'entorn](#-variables-dentorn)
- [Desplegament](#-desplegament)
  - [Netlify (recomanat)](#opció-1-netlify-recomanat)
  - [Servidor propi amb Node.js](#opció-2-servidor-propi-amb-nodejs)
  - [Docker](#opció-3-docker)
- [Backend API](#-backend-api)
- [Chatbot IA](#-chatbot-ia)
- [Panell d'administració](#-panell-dadministració)
- [Personalització](#-personalització)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Característiques

### Frontend
- 🌐 **Multi-idioma**: ES, CA, EN, FR, DE, IT
- 📱 **Responsive**: Adaptat a mòbil, tauleta i escriptori
- 🎬 **Hero dinàmic**: Suport per imatge o vídeo de fons
- 🎨 **Branding personalitzable**: Logos, colors, textos des de l'admin

### Leads i CRM
- 📝 **Formulari de contacte** amb validació
- 🛠️ **Configurador de solucions** interactiu
- 📊 **Captura automàtica de leads** des del chatbot
- 📧 **Notificacions per email** (Resend/SendGrid)
- 🏷️ **UTM tracking** automàtic

### Chatbot IA
- 🤖 **Integració Google Gemini/Gemma 3**
- 💬 **Captura intel·ligent de leads** durant la conversa
- 📅 **Programació de cites**
- 🎯 **Lead scoring** automàtic
- ⚙️ **Configurable** des del panell admin

### Administració
- 🔐 **Login segur** amb Supabase Auth
- ✏️ **Editor de branding** en temps real
- 📈 **Gestió de leads**
- 🤖 **Configuració del chatbot**
- 📊 **Analytics** integrat

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    React 19 + TypeScript                         │
│                    Vite + TailwindCSS                            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND OPTIONS                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Netlify Functions│  │  Express.js     │  │   Docker        │  │
│  │   (Serverless)   │  │  (Node.js)      │  │   Container     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVEIS EXTERNS                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Supabase   │  │   Google    │  │   Resend    │              │
│  │  (Database) │  │   Gemini    │  │   (Email)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Estructura de fitxers

```
eportstech-portal/
├── components/           # Components React
│   ├── Hero.tsx          # Secció hero amb vídeo/imatge
│   ├── Navbar.tsx        # Navegació
│   ├── ServicesSection.tsx
│   ├── BenefitsSection.tsx
│   ├── ContactForm.tsx   # Formulari de contacte
│   ├── Chatbot.tsx       # Widget de chatbot
│   ├── Footer.tsx
│   └── CookieConsent.tsx
├── pages/
│   ├── AdminDashboard.tsx  # Panell d'administració
│   ├── PrivacyPolicy.tsx
│   ├── LegalNotice.tsx
│   └── CookiesPolicy.tsx
├── services/
│   ├── supabaseClient.ts   # Client Supabase
│   ├── supabaseMock.ts     # Funcions CRUD
│   ├── geminiService.ts    # API Gemini/Gemma
│   └── analytics.ts        # Google Analytics
├── hooks/
│   ├── useBrandConfigWithCache.ts
│   ├── useUtmTracking.ts
│   └── useLeadEnrichment.ts
├── netlify/functions/      # Serverless functions
│   ├── send-notification.ts
│   ├── auth-login.ts
│   ├── sync-data.ts
│   └── update-brand-config.ts
├── supabase/
│   └── functions/          # Edge functions (opcional)
├── public/                 # Assets estàtics
├── supabase_schema.sql     # Esquema de la BD
└── server/                 # Backend Express (crear si es necessita)
```

---

## 📋 Requisits

### Mínims
- **Node.js** 18.x o superior
- **npm** 9.x o **yarn** 1.22+
- **Compte Supabase** (gratuït disponible)
- **API Key Google AI** (Gemini/Gemma)

### Opcionals
- **Resend/SendGrid** per notificacions email
- **Google Analytics** per tracking
- **Domini propi** amb SSL

---

## 🚀 Instal·lació ràpida

### 1. Clonar el repositori

```bash
git clone https://github.com/yourusername/eportstech-portal.git
cd eportstech-portal
```

### 2. Instal·lar dependències

```bash
npm install
```

### 3. Configurar variables d'entorn

```bash
cp .env.example .env
```

Edita `.env` amb les teves credencials (veure secció [Variables d'entorn](#-variables-dentorn)).

### 4. Executar en desenvolupament

```bash
npm run dev
```

Obre http://localhost:5173

---

## 🗄️ Configuració de Supabase

### 1. Crear projecte

1. Ves a [supabase.com](https://supabase.com) i crea un compte
2. Crea un nou projecte
3. Anota la **Project URL** i l'**anon public key**

### 2. Executar esquema SQL

Ves a **SQL Editor** i executa el contingut de `supabase_schema.sql` o crea les taules manualment:

```sql
-- Taules principals
CREATE TABLE IF NOT EXISTS brand_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  sitename TEXT DEFAULT 'EportsTech Portal',
  favicon TEXT,
  navlogo TEXT DEFAULT '/logo-blue.png',
  footerlogo TEXT DEFAULT '/logo-white.png',
  contactemail TEXT DEFAULT 'contact@eportstech.com',
  contactphone TEXT DEFAULT '+34 900 123 456',
  hero JSONB,
  hero_video TEXT,
  hero_video_fallback_gif TEXT,
  hero_media_type TEXT DEFAULT 'auto',
  hero_video_autoplay BOOLEAN DEFAULT true,
  hero_video_loop BOOLEAN DEFAULT true,
  hero_video_muted BOOLEAN DEFAULT true,
  benefits JSONB,
  footer JSONB,
  config_version INTEGER DEFAULT 1,
  social_media JSONB DEFAULT '{}',
  catalog_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fullname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  serviceinterest TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact-form',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_config (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT DEFAULT 'NEXI_tech',
  tone TEXT DEFAULT 'professional',
  responselength TEXT DEFAULT 'balanced',
  highlightedproduct TEXT,
  businesshoursstart TEXT DEFAULT '09:00',
  businesshoursend TEXT DEFAULT '18:00',
  timezone TEXT DEFAULT 'Europe/Madrid',
  limitations JSONB,
  qualifyingquestions JSONB,
  custominstructions TEXT,
  knowledgebase JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  icon TEXT,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  category TEXT,
  visible BOOLEAN DEFAULT true,
  order_idx INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configurator_items (
  id TEXT PRIMARY KEY,
  icon TEXT,
  category TEXT,
  title JSONB NOT NULL,
  benefit JSONB NOT NULL,
  visible BOOLEAN DEFAULT true,
  order_idx INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuració inicial
INSERT INTO brand_config (id, sitename) VALUES (1, 'EportsTech Portal') ON CONFLICT DO NOTHING;
INSERT INTO bot_config (name) VALUES ('NEXI_tech') ON CONFLICT DO NOTHING;
```

### 3. Configurar Storage

1. Ves a **Storage** → **New bucket**
2. Crea bucket: `brand-assets`
3. Configura com a **Public**
4. Políticas RLS: Afegeix política per permetre lectura pública

```sql
-- Política per permetre lectura pública
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');

-- Política per permetre upload (usuaris autenticats)
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets');
```

### 4. Configurar autenticació (opcional)

Per a l'accés admin:
1. **Authentication** → **Users** → Crear usuari admin
2. O configurar OAuth amb Google/GitHub

---

## 🔐 Variables d'entorn

Crea un fitxer `.env` a l'arrel del projecte:

```env
# ===================================
# SUPABASE (OBLIGATORI)
# ===================================
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# ===================================
# GOOGLE AI - CHATBOT (OBLIGATORI)
# ===================================
VITE_GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key-here

# ===================================
# GOOGLE ANALYTICS (OPCIONAL)
# ===================================
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ===================================
# EMAIL - NOTIFICACIONS (OPCIONAL)
# ===================================
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# ===================================
# ADMIN (OPCIONAL)
# ===================================
VITE_ADMIN_EMAIL=admin@eportstech.com
VITE_ADMIN_PASSWORD=your-secure-password
```

### Com obtenir les claus

| Variable | Com obtenir |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public |
| `VITE_GOOGLE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics → Admin → Data Streams |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |

---

## 🚀 Desplegament

### Opció 1: Netlify (recomanat)

El projecte inclou configuració per Netlify amb serverless functions.

#### Pas 1: Connectar repositori

1. Ves a [netlify.com](https://netlify.com)
2. **Add new site** → **Import existing project**
3. Connecta el teu repositori GitHub

#### Pas 2: Configurar build

```
Build command: npm run build
Publish directory: dist
Functions directory: netlify/functions
```

#### Pas 3: Variables d'entorn

A **Site settings** → **Environment variables**, afegeix:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_GEMINI_API_KEY
VITE_GA_MEASUREMENT_ID
RESEND_API_KEY
FROM_EMAIL
```

#### Pas 4: Desplegar

```bash
git push origin main
```

Netlify desplegarà automàticament.

---

### Opció 2: Servidor propi amb Node.js

Per desplegar en un VPS (DigitalOcean, Hetzner, AWS EC2, etc.) sense Netlify.

#### Pas 1: Crear servidor Express

Crea la carpeta `server/` i el fitxer `server/index.js`:

```javascript
// server/index.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// API ENDPOINTS (substitueixen Netlify Functions)
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Send notification endpoint
app.post('/api/send-notification', async (req, res) => {
  try {
    const { type, recipients, data } = req.body;
    
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients configured' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@eportstech.com';

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const { subject, html } = generateEmailContent(type, data);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: recipients,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const result = await response.json();
    console.log('✅ Email sent:', result.id);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auth login endpoint
app.post('/api/auth-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        token: 'admin-session-' + Date.now(),
        user: { email, role: 'admin' }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync data endpoint
app.get('/api/sync-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brand_config')
      .select('*')
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Update brand config endpoint
app.post('/api/update-brand-config', async (req, res) => {
  try {
    const config = req.body;
    
    // Incrementar versió
    const { data: current } = await supabase
      .from('brand_config')
      .select('config_version')
      .eq('id', 1)
      .single();
    
    const newVersion = (current?.config_version || 0) + 1;
    
    const { data, error } = await supabase
      .from('brand_config')
      .update({ ...config, config_version: newVersion, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating brand config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// ============================================
// STATIC FILES (Frontend)
// ============================================

// Servir fitxers estàtics del build
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback - totes les rutes van a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ============================================
// HELPERS
// ============================================

function generateEmailContent(type, data) {
  const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  
  if (type === 'catalog') {
    return {
      subject: '📥 Nueva descarga de catálogo - EportsTech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">📥 Nueva Descarga de Catálogo</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>📍 Origen:</strong> ${data.source || 'footer'}</p>
            <p><strong>🕐 Fecha:</strong> ${timestamp}</p>
          </div>
        </div>
      `,
    };
  }

  if (type === 'configurator') {
    const itemsList = data.selectedItems?.map(item => `<li>${item}</li>`).join('') || '';
    return {
      subject: '🛠️ Nueva solicitud de paquete personalizado - EportsTech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛠️ Paquete Personalizado</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>🕐 Fecha:</strong> ${timestamp}</p>
            ${itemsList ? `<h3>Servicios seleccionados:</h3><ul>${itemsList}</ul>` : ''}
          </div>
        </div>
      `,
    };
  }

  // Default: lead general
  return {
    subject: '📬 Nuevo lead de contacto - EportsTech',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📬 Nuevo Lead de Contacto</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <p><strong>👤 Nombre:</strong> ${data.fullName || 'No especificado'}</p>
          <p><strong>📧 Email:</strong> ${data.email}</p>
          <p><strong>📱 Teléfono:</strong> ${data.phone || 'No especificado'}</p>
          <p><strong>🏢 Empresa:</strong> ${data.company || 'No especificado'}</p>
          <p><strong>🎯 Servicio:</strong> ${data.serviceInterest || 'General'}</p>
          <p><strong>🕐 Fecha:</strong> ${timestamp}</p>
          ${data.message ? `<h3>💬 Mensaje:</h3><p>${data.message}</p>` : ''}
        </div>
      </div>
    `,
  };
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 EportsTech Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

#### Pas 2: Actualitzar package.json

```json
{
  "name": "eportstech-portal",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js",
    "start": "npm run build && npm run server"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.555.0",
    "@google/genai": "^1.30.0",
    "react-router-dom": "^7.9.6",
    "react-hook-form": "^7.67.0",
    "@supabase/supabase-js": "^2.87.1",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

Instal·la les noves dependències:

```bash
npm install express cors dotenv
```

#### Pas 3: Build i executar

```bash
# Build del frontend
npm run build

# Iniciar servidor
npm run server
```

#### Pas 4: Configurar PM2 (producció)

```bash
# Instal·lar PM2 globalment
npm install -g pm2

# Iniciar amb PM2
pm2 start server/index.js --name eportstech

# Veure logs
pm2 logs eportstech

# Configurar auto-start al reiniciar servidor
pm2 startup
pm2 save
```

#### Pas 5: Configurar Nginx (reverse proxy)

```nginx
# /etc/nginx/sites-available/eportstech
server {
    listen 80;
    server_name eportstech.com www.eportstech.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name eportstech.com www.eportstech.com;

    # SSL (configurat per Certbot)
    ssl_certificate /etc/letsencrypt/live/eportstech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eportstech.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache per assets estàtics
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activar i reiniciar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/eportstech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Pas 6: SSL amb Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d eportstech.com -d www.eportstech.com
```

---

### Opció 3: Docker

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copiar només el necessari
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./

# Instal·lar només dependències de producció
RUN npm ci --only=production

# Usuari no-root per seguretat
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  eportstech:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_GOOGLE_GEMINI_API_KEY=${VITE_GOOGLE_GEMINI_API_KEY}
      - VITE_GA_MEASUREMENT_ID=${VITE_GA_MEASUREMENT_ID}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - FROM_EMAIL=${FROM_EMAIL}
      - VITE_ADMIN_EMAIL=${VITE_ADMIN_EMAIL}
      - VITE_ADMIN_PASSWORD=${VITE_ADMIN_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Executar:

```bash
# Crear fitxer .env amb les variables
cp .env.example .env
# Editar .env amb les credencials

# Build i executar
docker-compose up -d

# Veure logs
docker-compose logs -f
```

---

## 🔌 Backend API

### Endpoints disponibles

| Mètode | Endpoint | Descripció |
|--------|----------|------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/send-notification` | Enviar notificació email |
| `POST` | `/api/auth-login` | Login admin |
| `GET` | `/api/sync-data` | Obtenir configuració |
| `POST` | `/api/update-brand-config` | Actualitzar configuració |

### Exemple: Send Notification

```javascript
fetch('/api/send-notification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'lead',
    recipients: ['admin@eportstech.com'],
    data: {
      fullName: 'Joan Garcia',
      email: 'joan@example.com',
      phone: '+34 612 345 678',
      company: 'Empresa SL',
      message: 'Vull més informació sobre els vostres serveis'
    }
  })
});
```

---

## 🤖 Chatbot IA

### Configuració del model

El chatbot utilitza **Gemma 3 27B** per defecte (límits més generosos):

```typescript
// services/geminiService.ts
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent';
```

**Models disponibles:**

| Model | RPD (requests/dia) | Recomanat per |
|-------|-------------------|---------------|
| `gemma-3-27b-it` | 14.400 | Producció amb tràfic alt |
| `gemini-1.5-flash` | 20 | Proves/desenvolupament |
| `gemini-2.0-flash` | 20 | Última versió |

### Captura automàtica de leads

El chatbot extreu automàticament durant la conversa:
- ✅ Nom complet
- ✅ Telèfon
- ✅ Email
- ✅ Empresa
- ✅ Data/hora de cita proposada
- ✅ Interessos/necessitats
- ✅ Lead scoring automàtic

### Configuració des de l'admin

A `/admin` → **Chatbot** pots configurar:

| Opció | Descripció |
|-------|------------|
| Nom del bot | Nom que apareix al widget |
| To | Professional, Amigable, Tècnic |
| Longitud | Breu, Equilibrat, Detallat |
| Horari | Horari d'atenció |
| Instruccions | Instruccions personalitzades |
| Base de coneixement | FAQs i informació del negoci |

---

## ⚙️ Panell d'administració

Accedeix a `/admin` amb les credencials configurades a `.env`.

### Seccions disponibles

| Secció | Funcionalitat |
|--------|---------------|
| **Branding** | Logos, favicon, colors, nom del site |
| **Hero** | Imatge/vídeo de fons, títols, subtítols |
| **Serveis** | CRUD de serveis mostrats |
| **Configurador** | Items del configurador de solucions |
| **Chatbot** | Configuració del bot IA |
| **Leads** | Visualització i gestió de leads |
| **Analytics** | Estadístiques de visites |

---

## 🎨 Personalització

### Canviar colors principals

Edita `index.css`:

```css
:root {
  --color-primary-500: #3b82f6;  /* Color principal */
  --color-primary-600: #2563eb;  /* Hover */
  --color-primary-700: #1d4ed8;  /* Active */
}
```

### Canviar fonts

A `index.html`, canvia el link de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Afegir nous idiomes

Edita `constants.ts` i afegeix traduccions:

```typescript
export const TRANSLATIONS = {
  heroTitle: {
    es: 'Soluciones Tecnológicas',
    ca: 'Solucions Tecnològiques',
    en: 'Technology Solutions',
    pt: 'Soluções Tecnológicas',  // Nou idioma
  },
  // ... més traduccions
};
```

I afegeix l'idioma a `types.ts`:

```typescript
export type Language = 'es' | 'ca' | 'en' | 'fr' | 'de' | 'it' | 'pt';
```

---

## 🔧 Troubleshooting

### El chatbot no respon

1. ✅ Verifica `VITE_GOOGLE_GEMINI_API_KEY` a `.env`
2. ✅ Comprova la quota a [Google AI Studio](https://aistudio.google.com)
3. ⚠️ Error 503 = servei temporalment no disponible (espera i reintenta)
4. ✅ Comprova que `bot_config` existeix a Supabase

### Les imatges no carreguen

1. ✅ Verifica que el bucket `brand-assets` sigui **públic** a Supabase
2. ✅ Comprova les polítiques RLS de Storage
3. ✅ Verifica que la URL sigui correcta (sense espais)

### Error de CORS

1. ✅ Afegeix el domini a Supabase → Settings → API → CORS Origins
2. ✅ Si uses servidor propi, verifica la configuració de CORS a Express

### Build falla

```bash
# Neteja cache i reinstal·la
rm -rf node_modules dist .vite
npm install
npm run build
```

### El vídeo del Hero no es reprodueix

1. ✅ Format: MP4 (H.264) o WebM
2. ✅ Mida màxima: 50MB
3. ✅ El vídeo ha de ser `muted` per autoplay
4. ✅ Verifica que `hero_video` té la URL a Supabase

### Problemes amb Safari

1. ✅ Assegura't que els vídeos tinguin `playsinline` i `muted`
2. ✅ Neteja cache: `Cmd+Shift+R`

---

## 📄 Llicència

MIT License - Lliure per ús comercial i personal.

---

## 🤝 Contribucions

Les contribucions són benvingudes! Llegeix `CONTRIBUTING.md` per més detalls.

1. Fork del repositori
2. Crea una branca: `git checkout -b feature/nova-funcionalitat`
3. Commit: `git commit -m 'Afegeix nova funcionalitat'`
4. Push: `git push origin feature/nova-funcionalitat`
5. Obre un Pull Request

---

## 📞 Suport

- 📖 **Documentació**: Fitxers `*.md` del projecte
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/eportstech-portal/issues)
- 📧 **Email**: support@eportstech.com

---

Desenvolupat amb ❤️ per **EportsTech - Grup EACOM**
