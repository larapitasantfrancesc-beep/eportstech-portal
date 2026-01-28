import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { config } = JSON.parse(event.body || '{}');

    if (!config) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Config is required' }),
      };
    }

    // Primer, obtenir la versió actual
    const { data: currentData, error: fetchError } = await supabase
      .from('brand_config')
      .select('config_version')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current version:', fetchError);
    }

    // Calcular nova versió
    const currentVersion = currentData?.config_version || 0;
    const newVersion = currentVersion + 1;

    // Preparar dades per actualitzar (convertir a lowercase per Supabase)
    const updateData: Record<string, unknown> = {
      config_version: newVersion,  // ✅ Incrementar versió!
      updated_at: new Date().toISOString(),
    };

    // Map camelCase to lowercase column names
    if (config.siteName !== undefined) updateData.sitename = config.siteName;
    if (config.favicon !== undefined) updateData.favicon = config.favicon;
    if (config.navLogo !== undefined) updateData.navlogo = config.navLogo;
    if (config.footerLogo !== undefined) updateData.footerlogo = config.footerLogo;
    if (config.contactEmail !== undefined) updateData.contactemail = config.contactEmail;
    if (config.contactPhone !== undefined) updateData.contactphone = config.contactPhone;
    if (config.hero !== undefined) {
      updateData.hero = config.hero;
      // També guardar camps de vídeo separats
      if (config.hero.video !== undefined) updateData.hero_video = config.hero.video || null;
      if (config.hero.videoFallbackGif !== undefined) updateData.hero_video_fallback_gif = config.hero.videoFallbackGif || null;
      if (config.hero.mediaType !== undefined) updateData.hero_media_type = config.hero.mediaType || 'auto';
      if (config.hero.videoAutoplay !== undefined) updateData.hero_video_autoplay = config.hero.videoAutoplay;
      if (config.hero.videoLoop !== undefined) updateData.hero_video_loop = config.hero.videoLoop;
      if (config.hero.videoMuted !== undefined) updateData.hero_video_muted = config.hero.videoMuted;
    }
    if (config.benefits !== undefined) updateData.benefits = config.benefits;
    if (config.footer !== undefined) updateData.footer = config.footer;

    console.log('📝 Updating brand_config with version:', newVersion);
    console.log('📦 Update data:', JSON.stringify(updateData, null, 2));

    // Actualitzar
    const { data, error } = await supabase
      .from('brand_config')
      .update(updateData)
      .eq('id', 1)
      .select();

    if (error) {
      console.error('❌ Supabase update error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error 
        }),
      };
    }

    console.log('✅ Brand config updated successfully, new version:', newVersion);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data,
        newVersion 
      }),
    };

  } catch (err) {
    console.error('❌ Exception:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }),
    };
  }
};
