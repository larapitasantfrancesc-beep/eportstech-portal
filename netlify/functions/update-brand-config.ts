import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Usar process.env.VITE_* para Netlify
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Env check:');
console.log('URL:', supabaseUrl ? '✓ present' : '✗ MISSING');
console.log('Service Key:', supabaseServiceKey ? '✓ present' : '✗ MISSING');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

interface UpdateRequest {
  config: any;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { config } = JSON.parse(event.body || '{}') as UpdateRequest;

    if (!config) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Config required' }),
      };
    }

    console.log('📤 [Update Brand Config] Updating...');

    const { error } = await supabase
      .from('brand_config')
      .update(config)
      .eq('id', 1);

    if (error) {
      console.error('❌ Update error:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: error.message }),
      };
    }

    console.log('✅ Brand config updated');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Config updated' }),
    };
  } catch (error) {
    console.error('❌ Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
