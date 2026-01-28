import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  session?: any;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}') as LoginRequest;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Email and password required',
        } as LoginResponse),
      };
    }

    console.log('📤 [Auth Login] Attempting login for:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Auth error:', error);
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: error.message || 'Invalid credentials',
        } as LoginResponse),
      };
    }

    if (!data.session) {
      console.error('❌ No session returned');
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: 'No session created',
        } as LoginResponse),
      };
    }

    console.log('✅ Login successful for:', email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        session: {
          access_token: data.session.access_token,
          user: {
            id: data.user?.id,
            email: data.user?.email,
          },
        },
      } as LoginResponse),
    };
  } catch (error) {
    console.error('❌ Login function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as LoginResponse),
    };
  }
};
