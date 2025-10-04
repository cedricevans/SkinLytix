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

    // Get user profile for personalized scoring
    const { data: profile } = await supabase
      .from('profiles')
      .select('skin_type, skin_concerns')
      .eq('id', user_id)
      .maybeSingle();

    console.log('User profile:', profile);

    // Check product_cache if barcode provided
    let cachedProductData = null;
    if (barcode) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: cachedProduct } = await supabase
        .from('product_cache')
        .select('obf_data_json')
        .eq('barcode', barcode)
        .gte('cached_at', thirtyDaysAgo)
        .maybeSingle();

      if (cachedProduct) {
        console.log('Product cache HIT for barcode:', barcode);
        cachedProductData = cachedProduct.obf_data_json;
      } else {
        console.log('Product cache MISS for barcode:', barcode);
        // Query Open Beauty Facts and cache result
        const obfResponse = await fetch(
          `${supabaseUrl}/functions/v1/query-open-beauty-facts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ barcode })
          }
        );
        const obfData = await obfResponse.json();
        if (obfData.product) {
          cachedProductData = obfData;
        }
      }
    }

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

    // Personalized rule-based analysis with skin profile
    const concerns = [];
    const safe = [];
    const warnings = [];
    
    // Common ingredient classifications (expanded)
    const beneficialIngredients: Record<string, string[]> = {
      oily: ['salicylic acid', 'niacinamide', 'zinc', 'tea tree'],
      dry: ['hyaluronic acid', 'ceramide', 'glycerin', 'squalane', 'shea butter'],
      sensitive: ['centella', 'aloe', 'oat', 'chamomile', 'allantoin'],
      aging: ['retinol', 'vitamin c', 'peptide', 'niacinamide', 'aha'],
      acne: ['salicylic acid', 'benzoyl peroxide', 'niacinamide', 'azelaic acid'],
    };

    const problematicIngredients: Record<string, string[]> = {
      sensitive: ['fragrance', 'alcohol denat', 'essential oil', 'citrus', 'menthol'],
      oily: ['coconut oil', 'palm oil', 'heavy oils'],
      acne: ['coconut oil', 'isopropyl myristate', 'lauric acid'],
    };

    for (const result of ingredientResults) {
      const ingredientLower = result.name.toLowerCase();
      
      if (result.data) {
        safe.push(result.name);
        
        // Check if beneficial for user's skin type/concerns
        if (profile) {
          if (profile.skin_type) {
            const beneficial = beneficialIngredients[profile.skin_type] || [];
            if (beneficial.some(b => ingredientLower.includes(b))) {
              safe.push(`${result.name} (beneficial for ${profile.skin_type} skin)`);
            }
          }
          
          if (profile.skin_concerns && Array.isArray(profile.skin_concerns)) {
            for (const concern of profile.skin_concerns) {
              const beneficial = beneficialIngredients[concern] || [];
              if (beneficial.some(b => ingredientLower.includes(b))) {
                safe.push(`${result.name} (targets ${concern})`);
              }
            }
          }
        }
      } else {
        concerns.push(result.name);
      }

      // Check for problematic ingredients based on profile
      if (profile) {
        if (profile.skin_type) {
          const problematic = problematicIngredients[profile.skin_type] || [];
          if (problematic.some(p => ingredientLower.includes(p))) {
            warnings.push(`⚠️ ${result.name} may not suit ${profile.skin_type} skin`);
          }
        }
        
        if (profile.skin_concerns && Array.isArray(profile.skin_concerns)) {
          for (const concern of profile.skin_concerns) {
            const problematic = problematicIngredients[concern] || [];
            if (problematic.some(p => ingredientLower.includes(p))) {
              warnings.push(`⚠️ ${result.name} may worsen ${concern}`);
            }
          }
        }
      }
    }

    // Calculate personalized EpiQ score (0-100)
    const totalIngredients = ingredientsArray.length;
    const safeCount = safe.length;
    let epiqScore = totalIngredients > 0 
      ? Math.round((safeCount / totalIngredients) * 100) 
      : 50;

    // Apply skin profile modifiers
    if (profile) {
      // Deduct points for warnings
      epiqScore = Math.max(0, epiqScore - (warnings.length * 5));
      
      // Bonus points for matching beneficial ingredients
      const beneficialMatches = safe.filter(s => s.includes('beneficial') || s.includes('targets'));
      epiqScore = Math.min(100, epiqScore + (beneficialMatches.length * 3));
    }

    // Generate personalized recommendations
    const routineSuggestions = [];
    if (profile?.skin_type === 'sensitive') {
      routineSuggestions.push('Patch test before full application');
      routineSuggestions.push('Use in the evening to minimize sun sensitivity');
    } else if (profile?.skin_type === 'oily') {
      routineSuggestions.push('Apply to clean, dry skin morning and night');
      routineSuggestions.push('Follow with oil-free moisturizer if needed');
    } else if (profile?.skin_type === 'dry') {
      routineSuggestions.push('Layer over hydrating toner for best results');
      routineSuggestions.push('Seal with rich moisturizer to prevent water loss');
    } else {
      routineSuggestions.push('Use consistently for best results');
      routineSuggestions.push('Follow with moisturizer and SPF in AM');
    }

    const recommendations = {
      safe_ingredients: safe,
      concern_ingredients: concerns,
      warnings: warnings,
      summary: epiqScore >= 70 
        ? `Great match for your ${profile?.skin_type || ''} skin! This product has a strong ingredient profile.` 
        : epiqScore >= 50 
          ? `Decent option. Some ingredients may need attention for your ${profile?.skin_type || ''} skin.` 
          : `Not ideal for your skin profile. Consider alternatives with safer formulations.`,
      routine_suggestions: routineSuggestions,
      personalized: !!profile,
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
