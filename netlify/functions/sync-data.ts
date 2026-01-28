import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

interface SyncRequest {
  services: any[];
  configuratorItems: any[];
}

interface SyncResponse {
  success: boolean;
  message: string;
  data?: {
    servicesCount: number;
    itemsCount: number;
  };
  error?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body: SyncRequest = JSON.parse(event.body || '{}');
    let { services, configuratorItems } = body;

    if (!services || !configuratorItems) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing services or configuratorItems',
        } as SyncResponse),
      };
    }

    console.log('📤 [Sync Function] Iniciando sincronización...');
    console.log(`   Services: ${services.length} items`);
    console.log(`   Items: ${configuratorItems.length} items`);

    // Clean services - remove optional fields that might not exist in schema
    services = services.map(s => ({
      id: s.id,
      icon: s.icon,
      title: s.title,
      description: s.description,
      category: s.category,
      visible: s.visible,
      sort_order: s.sort_order
    }));

    // Clean configurator items
    configuratorItems = configuratorItems.map(item => ({
      id: item.id,
      icon: item.icon,
      category: item.category,
      title: item.title,
      benefit: item.benefit,
      visible: item.visible,
      sort_order: item.sort_order
    }));

    console.log('📤 [1/2] Sincronizando SERVICIOS...');
    const { error: servicesError, data: servicesData } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'id' })
      .select();

    if (servicesError) {
      console.error('❌ Services error:', servicesError);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: `Services sync failed: ${servicesError.message}`,
        } as SyncResponse),
      };
    }

    console.log(`✅ Services sincronizados: ${servicesData?.length || services.length}`);

    console.log('📤 [2/2] Sincronizando CONFIGURATOR ITEMS...');
    const { error: itemsError, data: itemsData } = await supabase
      .from('configurator_items')
      .upsert(configuratorItems, { onConflict: 'id' })
      .select();

    if (itemsError) {
      console.error('❌ Items error:', itemsError);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: `Items sync failed: ${itemsError.message}`,
        } as SyncResponse),
      };
    }

    console.log(`✅ Items sincronizados: ${itemsData?.length || configuratorItems.length}`);
    console.log('✅ === SINCRONIZACIÓN COMPLETADA ===\n');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Sincronización completada exitosamente',
        data: {
          servicesCount: servicesData?.length || services.length,
          itemsCount: itemsData?.length || configuratorItems.length,
        },
      } as SyncResponse),
    };
  } catch (error) {
    console.error('❌ Sync function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as SyncResponse),
    };
  }
};
