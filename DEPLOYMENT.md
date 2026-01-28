# 🚀 Deployment Guide - EportsTech Portal

## Opción 1: Deployment a Netlify (Recomendado para Demo)

### Step 1: Preparar GitHub

1. Inicializar repositorio Git (si no está hecho)
   ```bash
   cd eportstech-portal
   git init
   git add .
   git commit -m "Initial commit: EportsTech Corporate Portal"
   ```

2. Crear repositorio en GitHub
   - Ir a https://github.com/new
   - Nombre: `eportstech-portal`
   - Privado o público según prefiera
   - NO inicializar con README (ya tenemos)

3. Subir código a GitHub
   ```bash
   git remote add origin https://github.com/tu-usuario/eportstech-portal.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Conectar con Netlify

1. **Sign up/Login en Netlify**
   - Ir a https://netlify.com
   - Login con GitHub

2. **Crear nuevo sitio**
   - Click "Add new site" → "Import an existing project"
   - Seleccionar GitHub
   - Buscar `eportstech-portal`
   - Click "Import"

3. **Configurar variables de entorno**
   - En Netlify Dashboard → Sitio → Settings → Build & Deploy → Environment
   - Agregar variables:
     ```
     VITE_SUPABASE_URL=https://[project].supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
     VITE_GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key-here
     VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
     ```

4. **Deploy automático**
   - Netlify detectará `netlify.toml`
   - Build automático al hacer push a main
   - Obtiene URL como: https://eportstech-portal.netlify.app

### Step 3: Configuración de Dominio (Opcional)

1. **Dominio personalizado**
   - Sitio Settings → Domain management → Add domain
   - Apuntar DNS a Netlify
   - Esperar propagación DNS (~24h)

2. **SSL Certificate**
   - Automático con Let's Encrypt
   - Renueva automáticamente

3. **Custom email**
   - Configurar DNS MX records
   - Usar servicio como Mailgun o SendGrid

## Opción 2: Self-hosting en Servidor Propio

### Requisitos
- Servidor Linux (Ubuntu 20.04+)
- Node.js 20+
- PM2 para process management
- Nginx como reverse proxy
- SSL certificate (Let's Encrypt)

### Instalación

1. **Conectarse al servidor**
   ```bash
   ssh usuario@servidor.com
   ```

2. **Instalar dependencias**
   ```bash
   sudo apt update && sudo apt upgrade
   sudo apt install nodejs npm curl git
   npm install -g pm2
   ```

3. **Clonar repositorio**
   ```bash
   cd /var/www
   git clone https://github.com/tu-usuario/eportstech-portal.git
   cd eportstech-portal
   npm install
   ```

4. **Variables de entorno**
   ```bash
   cp .env.example .env.local
   nano .env.local
   # Editar con credenciales reales
   ```

5. **Build producción**
   ```bash
   npm run build
   # Genera carpeta 'dist' con archivos estáticos
   ```

6. **Servir con Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/eportstech
   ```

   Configuración:
   ```nginx
   server {
     listen 80;
     server_name eportstech.com www.eportstech.com;

     root /var/www/eportstech-portal/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }

     gzip on;
     gzip_types text/plain text/css text/javascript application/json;
     gzip_min_length 1000;
   }
   ```

   Habilitar:
   ```bash
   sudo ln -s /etc/nginx/sites-available/eportstech \
     /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **SSL con Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d eportstech.com -d www.eportstech.com
   # Renovación automática con timer systemd
   ```

## Opción 3: Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_GOOGLE_GEMINI_API_KEY=${VITE_GOOGLE_GEMINI_API_KEY}
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Supabase tablas creadas
- [ ] Google Gemini API key activa
- [ ] Google Analytics configurado
- [ ] README actualizado
- [ ] CONTRIBUTING.md disponible
- [ ] .env.local no incluido en git
- [ ] Build pasa sin errores: `npm run build`
- [ ] Tests pasan (si existen)
- [ ] No hay warnings de seguridad

## Monitoreo Post-Deploy

### Netlify Dashboard
- Build logs: https://app.netlify.com/sites/eportstech-portal/deploys
- Analytics: Traffic y performance
- Form submissions (si activas)

### Supabase Console
- Database: Ver leads y configuraciones
- Authentication: Monitor usuarios admin
- Realtime: Conexiones activas

### Google Analytics
- https://analytics.google.com
- Usuarios en tiempo real
- Páginas más visitadas
- Conversiones

### Alertas útiles

```bash
# Si usas self-hosted, monitorea logs:
tail -f /var/log/nginx/access.log | grep -i error

# Monitorea SSL expiration:
certbot renew --dry-run

# Monitorea disk space:
df -h
```

## Rollback

### Si algo sale mal:

**Netlify:**
- Dashboard → Deploys → Click versión anterior → "Publish deploy"
- Instantáneo

**Self-hosted:**
```bash
cd /var/www/eportstech-portal
git log --oneline # ver commits
git revert <commit-hash>
npm run build
sudo systemctl restart nginx
```

## Performance Tips

1. **Compresión**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **CDN para Assets**
   - Usar Cloudflare gratis
   - Cachea imágenes y JS

3. **Database Optimization**
   - Indexar campos frecuentes
   - Analizar queries lentas

4. **Monitoreo**
   ```bash
   # Lighthouse audit
   npm install -g lighthouse
   lighthouse https://eportstech-portal.netlify.app
   ```

## Troubleshooting

### Build falla
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Variables no se aplican
- Verificar nombre: `VITE_` prefix es requerido
- Redeployer después de cambiar variables
- Limpiar cache del navegador

### Conexión a Supabase falla
```typescript
// En supabaseClient.ts, agregar:
console.log('Supabase URL:', process.env.VITE_SUPABASE_URL);
console.log('Env vars:', Object.keys(process.env).filter(k => k.startsWith('VITE_')));
```

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite Guide**: https://vitejs.dev/guide/

---

**Actualizado**: Diciembre 2024  
**Estado**: Listo para producción
