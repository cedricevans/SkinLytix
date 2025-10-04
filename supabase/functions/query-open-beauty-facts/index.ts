import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { barcode } = await req.json();
    
    if (!barcode) {
      return new Response(
        JSON.stringify({ error: 'Barcode is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first (30-day expiry)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: cached, error: cacheError } = await supabase
      .from('product_cache')
      .select('obf_data_json, cached_at')
      .eq('barcode', barcode)
      .gte('cached_at', thirtyDaysAgo.toISOString())
      .maybeSingle();

    if (cached) {
      console.log('Cache hit for barcode:', barcode);
      return new Response(
        JSON.stringify({ product: cached.obf_data_json, source: 'cache' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cache miss - query Open Beauty Facts API
    console.log('Cache miss, querying Open Beauty Facts for:', barcode);
    const obfResponse = await fetch(
      `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`
    );

    if (!obfResponse.ok) {
      return new Response(
        JSON.stringify({ product: null, source: 'api', message: 'Product not found in Open Beauty Facts' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const obfData = await obfResponse.json();
    
    if (obfData.status !== 1 || !obfData.product) {
      return new Response(
        JSON.stringify({ product: null, source: 'api', message: 'Product not found in Open Beauty Facts' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store in cache
    await supabase
      .from('product_cache')
      .upsert({
        barcode,
        obf_data_json: obfData.product,
        cached_at: new Date().toISOString()
      }, { onConflict: 'barcode' });

    console.log('Cached new product:', barcode);

    return new Response(
      JSON.stringify({ product: obfData.product, source: 'api' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in query-open-beauty-facts:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
