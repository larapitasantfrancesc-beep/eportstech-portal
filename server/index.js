// server/index.js
// Backend Express per desplegar EportsTech Portal en servidor propi
// Substitueix Netlify Functions quan es desplega fora de Netlify

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carregar variables d'entorn
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Crear client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY són obligatoris');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// SEND NOTIFICATION
// ============================================
app.post('/api/send-notification', async (req, res) => {
  try {
    const { type, recipients, data } = req.body;
    
    // Validar dades
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients configured' });
    }

    if (!data?.email) {
      return res.status(400).json({ error: 'Missing email in data' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@eportstech.com';

    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - emails disabled');
      // Continuar sense enviar email (per desenvolupament)
      return res.json({ success: true, message: 'Email service not configured (dev mode)' });
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
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }

    const result = await response.json();
    console.log('✅ Email sent:', result.id);
    res.json({ success: true, id: result.id });

  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// AUTH LOGIN
// ============================================
app.post('/api/auth-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD;

    // Validar credencials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = 'admin-session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      res.json({ 
        success: true, 
        token,
        user: { 
          email, 
          role: 'admin',
          name: 'Administrator'
        }
      });
    } else {
      // Intentar autenticació amb Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
          success: true,
          token: data.session?.access_token,
          user: {
            email: data.user?.email,
            role: 'user',
            id: data.user?.id
          }
        });
      } catch (authError) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SYNC DATA
// ============================================
app.get('/api/sync-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brand_config')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('❌ Sync error:', error);
      return res.status(500).json({ error: 'Failed to fetch config' });
    }

    res.json({ 
      success: true, 
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// UPDATE BRAND CONFIG
// ============================================
app.post('/api/update-brand-config', async (req, res) => {
  try {
    const config = req.body;
    
    if (!config || Object.keys(config).length === 0) {
      return res.status(400).json({ error: 'No config data provided' });
    }

    // Obtenir versió actual
    const { data: current } = await supabase
      .from('brand_config')
      .select('config_version')
      .eq('id', 1)
      .single();
    
    const newVersion = (current?.config_version || 0) + 1;
    
    // Preparar dades per actualitzar
    const updateData = {
      ...config,
      config_version: newVersion,
      updated_at: new Date().toISOString()
    };

    // Mapping especial per camps de hero video
    if (config.hero !== undefined) {
      if (config.hero.video !== undefined) updateData.hero_video = config.hero.video || null;
      if (config.hero.videoFallbackGif !== undefined) updateData.hero_video_fallback_gif = config.hero.videoFallbackGif || null;
      if (config.hero.mediaType !== undefined) updateData.hero_media_type = config.hero.mediaType || 'auto';
      if (config.hero.videoAutoplay !== undefined) updateData.hero_video_autoplay = config.hero.videoAutoplay;
      if (config.hero.videoLoop !== undefined) updateData.hero_video_loop = config.hero.videoLoop;
      if (config.hero.videoMuted !== undefined) updateData.hero_video_muted = config.hero.videoMuted;
    }

    const { data, error } = await supabase
      .from('brand_config')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('❌ Update error:', error);
      return res.status(500).json({ error: 'Failed to update config', details: error.message });
    }
    
    console.log('✅ Brand config updated to version', newVersion);
    res.json({ success: true, data, version: newVersion });

  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// LEADS API
// ============================================

// Obtenir tots els leads
app.get('/api/leads', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Crear nou lead
app.post('/api/leads', async (req, res) => {
  try {
    const leadData = req.body;
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Actualitzar lead
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// ============================================
// STATIC FILES (Frontend)
// ============================================

// Servir fitxers estàtics del build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Servir assets amb cache llarg
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true
}));

// SPA fallback - totes les rutes que no són API van a index.html
app.get('*', (req, res) => {
  // No servir index.html per rutes d'API
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateEmailContent(type, data) {
  const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  
  const baseStyles = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  if (type === 'catalog') {
    return {
      subject: '📥 Nueva descarga de catálogo - EportsTech',
      html: `
        <div style="${baseStyles}">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📥 Nueva Descarga de Catálogo</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Se ha registrado una nueva descarga del catálogo:</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 8px 0; color: #475569;"><strong>📧 Email:</strong> ${data.email}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>📍 Origen:</strong> ${data.source || 'footer'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Este lead ha mostrado interés en descargar el catálogo de productos.
              Es un buen momento para hacer seguimiento.
            </p>
          </div>
          <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">EportsTech - Grupo EACOM</p>
          </div>
        </div>
      `,
    };
  }

  if (type === 'configurator') {
    const itemsList = data.selectedItems?.map(item => `<li style="padding: 4px 0; color: #475569;">${item}</li>`).join('') || '';
    return {
      subject: '🛠️ Nueva solicitud de paquete personalizado - EportsTech',
      html: `
        <div style="${baseStyles}">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🛠️ Paquete Personalizado</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Nueva solicitud de presupuesto personalizado:</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #7c3aed;">
              <p style="margin: 8px 0; color: #475569;"><strong>👤 Nombre:</strong> ${data.fullName || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>📧 Email:</strong> ${data.email}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>📱 Teléfono:</strong> ${data.phone || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🏢 Empresa:</strong> ${data.company || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
            </div>
            
            ${itemsList ? `
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0; margin-bottom: 12px;">📋 Servicios seleccionados:</h3>
              <ul style="margin: 0; padding-left: 20px;">${itemsList}</ul>
            </div>
            ` : ''}
          </div>
          <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">EportsTech - Grupo EACOM</p>
          </div>
        </div>
      `,
    };
  }

  if (type === 'chatbot') {
    return {
      subject: '🤖 Nuevo lead del chatbot - EportsTech',
      html: `
        <div style="${baseStyles}">
          <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🤖 Lead del Chatbot</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Nuevo lead capturado por el asistente virtual:</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #06b6d4;">
              <p style="margin: 8px 0; color: #475569;"><strong>👤 Nombre:</strong> ${data.fullName || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>📧 Email:</strong> ${data.email || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>📱 Teléfono:</strong> ${data.phone || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🏢 Empresa:</strong> ${data.company || 'No especificado'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🎯 Lead Score:</strong> ${data.score || 'N/A'}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
            </div>
            
            ${data.summary ? `
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">💬 Resumen de la conversación:</h3>
              <p style="color: #64748b; white-space: pre-wrap;">${data.summary}</p>
            </div>
            ` : ''}
          </div>
          <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">EportsTech - Grupo EACOM</p>
          </div>
        </div>
      `,
    };
  }

  // Default: lead general (formulari de contacte)
  return {
    subject: '📬 Nuevo lead de contacto - EportsTech',
    html: `
      <div style="${baseStyles}">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📬 Nuevo Lead de Contacto</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Se ha recibido una nueva solicitud de contacto:</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 8px 0; color: #475569;"><strong>👤 Nombre:</strong> ${data.fullName || 'No especificado'}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>📧 Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>📱 Teléfono:</strong> ${data.phone || 'No especificado'}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>🏢 Empresa:</strong> ${data.company || 'No especificado'}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>🎯 Servicio de interés:</strong> ${data.serviceInterest || 'General'}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
          </div>
          
          ${data.message ? `
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">💬 Mensaje:</h3>
            <p style="color: #64748b; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Este lead ha sido capturado desde el formulario de contacto del portal web.
          </p>
        </div>
        <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">EportsTech - Grupo EACOM</p>
        </div>
      </div>
    `,
  };
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ════════════════════════════════════════════');
  console.log('   EportsTech Portal Server');
  console.log('═══════════════════════════════════════════════');
  console.log(`   🌐 URL:         http://localhost:${PORT}`);
  console.log(`   📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🗄️  Supabase:    ${supabaseUrl ? 'Connected' : 'Not configured'}`);
  console.log(`   📧 Email:       ${process.env.RESEND_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
});

export default app;
