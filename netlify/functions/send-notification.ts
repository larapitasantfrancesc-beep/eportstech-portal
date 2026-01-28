// netlify/functions/send-notification.ts
// Funció per enviar notificacions per email quan es rep un lead

import { Handler } from '@netlify/functions';

// Configurar Resend (o canviar per SendGrid/Mailgun)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@eportstech.com';

interface NotificationPayload {
  type: 'lead' | 'configurator' | 'catalog';
  recipients: string[];
  data: {
    email: string;
    fullName?: string;
    phone?: string;
    company?: string;
    serviceInterest?: string;
    message?: string;
    selectedItems?: string[];
    source?: string;
  };
}

const handler: Handler = async (event) => {
  // Només acceptem POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload: NotificationPayload = JSON.parse(event.body || '{}');
    
    // Validar dades
    if (!payload.recipients || payload.recipients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No recipients configured' }),
      };
    }

    if (!payload.data?.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email in data' }),
      };
    }

    // Generar contingut email segons tipus
    const { subject, html } = generateEmailContent(payload);

    // Enviar amb Resend
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' }),
      };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.recipients,
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Resend error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email' }),
      };
    }

    const result = await response.json();
    console.log('✅ Email sent:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.id }),
    };

  } catch (error) {
    console.error('❌ Notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

function generateEmailContent(payload: NotificationPayload): { subject: string; html: string } {
  const { type, data } = payload;
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
            <p style="font-size: 16px; color: #334155;">Se ha registrado una nueva descarga del catálogo:</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email}</p>
              <p style="margin: 8px 0;"><strong>📍 Origen:</strong> ${data.source || 'footer'}</p>
              <p style="margin: 8px 0;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              Este lead ha mostrado interés en descargar el catálogo de productos.
              Es un buen momento para hacer seguimiento.
            </p>
          </div>
          <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
            <p>EportsTech - Grupo EACOM</p>
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
            <p style="font-size: 16px; color: #334155;">Nueva solicitud de presupuesto personalizado:</p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #7c3aed;">
              <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email}</p>
              <p style="margin: 8px 0;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
            </div>
            
            ${itemsList ? `
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #334155; margin-top: 0;">Servicios seleccionados:</h3>
              <ul style="color: #64748b;">${itemsList}</ul>
            </div>
            ` : ''}
          </div>
          <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
            <p>EportsTech - Grupo EACOM</p>
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
          <p style="font-size: 16px; color: #334155;">Se ha recibido una nueva solicitud de contacto:</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 8px 0;"><strong>👤 Nombre:</strong> ${data.fullName || 'No especificado'}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>📱 Teléfono:</strong> ${data.phone || 'No especificado'}</p>
            <p style="margin: 8px 0;"><strong>🏢 Empresa:</strong> ${data.company || 'No especificado'}</p>
            <p style="margin: 8px 0;"><strong>🎯 Servicio:</strong> ${data.serviceInterest || 'General'}</p>
            <p style="margin: 8px 0;"><strong>🕐 Fecha:</strong> ${timestamp}</p>
          </div>
          
          ${data.message ? `
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">💬 Mensaje:</h3>
            <p style="color: #64748b; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}
        </div>
        <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px;">
          <p>EportsTech - Grupo EACOM</p>
        </div>
      </div>
    `,
  };
}

export { handler };
