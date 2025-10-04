import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: 1-2 requests per second
const RATE_LIMIT_DELAY = 1500; // 1.5 seconds between requests

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();
    
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Ingredients array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    for (const ingredientName of ingredients) {
      const cleanName = ingredientName.trim().toLowerCase();
      
      // Check cache first (permanent cache)
      const { data: cached } = await supabase
        .from('ingredient_cache')
        .select('*')
        .eq('ingredient_name', cleanName)
        .maybeSingle();

      if (cached) {
        console.log('Cache hit for ingredient:', cleanName);
        results.push({
          name: ingredientName,
          data: {
            pubchem_cid: cached.pubchem_cid,
            molecular_weight: cached.molecular_weight,
            properties: cached.properties_json
          },
          source: 'cache'
        });
        continue;
      }

      // Cache miss - query PubChem
      console.log('Cache miss, querying PubChem for:', cleanName);
      
      try {
        // Search for compound by name
        const searchResponse = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(cleanName)}/JSON`
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const compound = searchData.PC_Compounds?.[0];
          
          if (compound) {
            const cid = compound.id?.id?.cid;
            const molecularWeight = compound.props?.find((p: any) => 
              p.urn?.label === 'Molecular Weight'
            )?.value?.fval;

            // Store in cache
            await supabase
              .from('ingredient_cache')
              .insert({
                ingredient_name: cleanName,
                pubchem_cid: cid?.toString(),
                molecular_weight: molecularWeight,
                properties_json: { compound }
              });

            results.push({
              name: ingredientName,
              data: {
                pubchem_cid: cid?.toString(),
                molecular_weight: molecularWeight,
                properties: { compound }
              },
              source: 'api'
            });
          } else {
            results.push({
              name: ingredientName,
              data: null,
              source: 'api',
              message: 'Not found in PubChem'
            });
          }
        } else {
          results.push({
            name: ingredientName,
            data: null,
            source: 'api',
            message: 'Not found in PubChem'
          });
        }

        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

      } catch (error) {
        console.error(`Error querying PubChem for ${cleanName}:`, error);
        results.push({
          name: ingredientName,
          data: null,
          source: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in query-pubchem:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
