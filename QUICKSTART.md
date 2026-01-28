# ⚡ Quick Start Guide - EportsTech Portal

## 5 minutos para empezar

### 1️⃣ Clonar & Instalar
```bash
git clone https://github.com/tu-usuario/eportstech-portal.git
cd eportstech-portal
./setup.sh
```

### 2️⃣ Configurar Variables
```bash
nano .env.local
```

Necesitas:
- `VITE_SUPABASE_URL` - De tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Desde Project Settings
- `VITE_GOOGLE_GEMINI_API_KEY` - De Google AI Studio
- `VITE_GA_MEASUREMENT_ID` - De Google Analytics (opcional)

### 3️⃣ Crear Base de Datos
1. Ir a https://supabase.com → New Project
2. Copiar SQL de `supabase_schema.sql`
3. Ejecutar en Supabase → SQL Editor
4. Copiar credenciales a `.env.local`

### 4️⃣ Ejecutar Localmente
```bash
npm run dev
# Abre http://localhost:5173
```

### 5️⃣ Acceder a Admin
- URL: http://localhost:5173/#/admin
- Login: via Supabase Auth
- O usa el pequeño candado en footer (hidden link)

---

## 📋 Checklist Típico

```
Setup inicial
├─ [x] Proyecto en GitHub
├─ [x] Cuenta Supabase creada
├─ [ ] Tablas en Supabase (SQL ejecutado)
├─ [ ] Variables de entorno configuradas
├─ [ ] `npm install` completado
├─ [ ] `npm run dev` funcionando
└─ [ ] Admin accesible

Primeros cambios
├─ [ ] Logo actualizado (navLogo, footerLogo)
├─ [ ] Contenido Hero modificado
├─ [ ] Email de contacto actualizado
├─ [ ] Colores/branding ajustados
└─ [ ] Primer test form submission

Antes de demo a dirección
├─ [ ] Todos textos en CA/ES
├─ [ ] Imágenes optimizadas
├─ [ ] Mobile responsive verificado
├─ [ ] Formularios funcionan
├─ [ ] Analytics configurado
├─ [ ] Chatbot responde
└─ [ ] Sin errores en consola

Deploy a Netlify
├─ [ ] Push a GitHub main
├─ [ ] Conectar Netlify
├─ [ ] Variables de entorno en Netlify
├─ [ ] Deploy automático funciona
├─ [ ] HTTPS working
└─ [ ] URL personalizada (opcional)
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build para producción
npm run preview      # Vista previa del build
npm run lint         # Verificar código
```

### Debugging
```bash
# Ver variables de entorno
node -e "console.log(process.env.VITE_SUPABASE_URL)"

# Limpiar cache
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Git
```bash
git status           # Ver cambios
git add .            # Preparar cambios
git commit -m "msg"  # Hacer commit
git push origin main # Subir a GitHub
git log --oneline    # Ver historial
git revert [hash]    # Deshacer commit
```

---

## 📂 Estructura Rápida

```
eportstech-portal/
├── public/               # Static files (logos, images)
├── src/
│   ├── components/       # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Chatbot.tsx   ← Main chatbot widget
│   │   └── ...
│   ├── pages/            # Páginas completas
│   │   └── AdminDashboard.tsx  ← Admin panel
│   ├── services/         # Integración APIs
│   │   ├── supabaseClient.ts
│   │   ├── geminiService.ts
│   │   └── analytics.ts
│   ├── App.tsx           # Componente raiz
│   ├── types.ts          # TypeScript types
│   ├── constants.ts      # Datos estáticos
│   └── index.tsx         # Entry point
├── README.md             # Documentación principal
├── DEPLOYMENT.md         # Guía de deploy
├── DATABASE_MIGRATION.md # Estrategia BD
├── netlify.toml          # Config Netlify
├── .env.example          # Template de variables
└── package.json          # Dependencias
```

---

## 🎯 Funcionalidades Principales

### ✨ Frontend (Ya incluido)
- **Multilingüe**: ES, CA, EN, FR, DE, IT
- **Responsive**: Mobile, tablet, desktop
- **Hero Section**: Banner customizable
- **Services Grid**: Lista dinámicas de servicios
- **Solutions Configurator**: Herramienta de presupuestos
- **Contact Form**: Formulario con validación
- **Chatbot IA**: Widget con Gemini AI
- **Admin Dashboard**: Panel de control completo

### 🗄️ Backend (Supabase)
- **Base de datos**: PostgreSQL automático
- **Authentication**: Usuarios admin
- **Storage**: Para imágenes y assets
- **Realtime**: Actualizaciones en vivo
- **Row Level Security**: Seguridad por filas

### 🤖 AI Integration
- **Google Gemini**: Chatbot inteligente
- **Contexto configurable**: Instrucciones personalizadas
- **Knowledge base**: Hechos específicos de negocio

### 📊 Analytics
- **Google Analytics 4**: Tracking de eventos
- **Form submissions**: Tracking de conversiones
- **Page views**: Monitoreo de tráfico

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo cambiar los colores?**
A: Sí, todo es Tailwind CSS. Edita las clases en los componentes o crea archivo CSS custom.

**P: ¿Cómo agrego más idiomas?**
A: Edita `constants.ts` → TRANSLATIONS, agregar nueva `Language` en `types.ts`.

**P: ¿Dónde van las imágenes?**
A: Carpeta `public/` para locales, o supabase Storage para dinámicas.

**P: ¿El chatbot requiere entrenamiento?**
A: No, usa instrucciones en admin. Personaliza "knowledge base" y "tone".

**P: ¿Puedo usar una BD diferente?**
A: Sí, reemplaza `supabaseClient.ts` por tu propia API.

**P: ¿Es libre el código?**
A: Sí, usa según necesites. Propietario de eports.

---

## 🚀 Próximos Pasos (Después de Setup)

### Inmediato
1. [ ] Personalizar hero section
2. [ ] Actualizar logo y colores
3. [ ] Cambiar email de contacto
4. [ ] Traducir contenido a CA/ES

### Corto plazo
1. [ ] Configurar chatbot IA
2. [ ] Setup analytics
3. [ ] Test completo en móvil
4. [ ] Demo a dirección

### Mediano plazo
1. [ ] Deploy a Netlify
2. [ ] Dominio personalizado
3. [ ] Recopilar feedback
4. [ ] Ajustes basados en feedback

### Largo plazo
1. [ ] Migración a servidor propio (eports)
2. [ ] Integración con CRM
3. [ ] Blog/documentación dinámico
4. [ ] Expansión de funcionalidades

---

## 📞 Soporte

- **Docs**: README.md, DEPLOYMENT.md, DATABASE_MIGRATION.md
- **Issues**: GitHub issues para bugs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

**Última actualización**: Diciembre 2024  
**Status**: ✅ Listo para usar
