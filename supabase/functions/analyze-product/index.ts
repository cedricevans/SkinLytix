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
    const { product_name, barcode, ingredients_list, user_id } = await req.json();
    
    if (!product_name || !ingredients_list || !user_id) {
      return new Response(
        JSON.stringify({ error: 'product_name, ingredients_list, and user_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Analyzing product:', product_name);

    // Parse ingredients list
    const ingredientsArray = ingredients_list
      .split(/[,\n]/)
      .map((i: string) => i.trim())
      .filter((i: string) => i.length > 0);

    // Query PubChem for ingredient data (this will use caching)
    const pubchemResponse = await fetch(
      `${supabaseUrl}/functions/v1/query-pubchem`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ ingredients: ingredientsArray })
      }
    );

    const pubchemData = await pubchemResponse.json();
    const ingredientResults = pubchemData.results || [];

    // Simple rule-based analysis (placeholder logic)
    // TODO: Implement actual interaction logic and EpiQ scoring
    const concerns = [];
    const safe = [];
    
    for (const result of ingredientResults) {
      if (result.data) {
        safe.push(result.name);
      } else {
        // Unknown ingredients are potential concerns
        concerns.push(result.name);
      }
    }

    // Calculate basic EpiQ score (0-100)
    // Higher score = safer/better formulation
    const totalIngredients = ingredientsArray.length;
    const safeCount = safe.length;
    const epiqScore = totalIngredients > 0 
      ? Math.round((safeCount / totalIngredients) * 100) 
      : 50;

    // Generate recommendations
    const recommendations = {
      safe_ingredients: safe,
      concern_ingredients: concerns,
      summary: epiqScore >= 70 
        ? 'This product has a good ingredient profile.' 
        : epiqScore >= 50 
          ? 'This product has some ingredients that may require attention.' 
          : 'Consider alternative products with safer ingredient profiles.',
      routine_suggestions: [
        'Use this product in your evening routine',
        'Follow with a moisturizer to lock in benefits'
      ]
    };

    // Check if product exists in database
    let productId = null;
    if (barcode) {
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('barcode', barcode)
        .maybeSingle();
      
      productId = existingProduct?.id || null;
    }

    // Store analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('user_analyses')
      .insert({
        user_id,
        product_id: productId,
        product_name,
        ingredients_list,
        epiq_score: epiqScore,
        recommendations_json: recommendations
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis complete for:', product_name, 'EpiQ Score:', epiqScore);

    return new Response(
      JSON.stringify({
        analysis_id: analysis.id,
        epiq_score: epiqScore,
        recommendations,
        ingredient_data: ingredientResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-product:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
