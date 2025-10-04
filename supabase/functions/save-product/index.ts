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
    const { product_name, barcode, brand, category, ingredients, analysis_id } = await req.json();
    
    if (!product_name || !ingredients || !Array.isArray(ingredients)) {
      return new Response(
        JSON.stringify({ error: 'product_name and ingredients array are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Saving product:', product_name, 'by user:', user.id);

    // Check if product already exists (by barcode or exact name match)
    let existingProduct = null;
    if (barcode) {
      const { data } = await supabase
        .from('products')
        .select('id, verification_count')
        .eq('barcode', barcode)
        .maybeSingle();
      existingProduct = data;
    }

    if (!existingProduct) {
      const { data } = await supabase
        .from('products')
        .select('id, verification_count')
        .ilike('product_name', product_name)
        .maybeSingle();
      existingProduct = data;
    }

    let productId: string;
    let verificationCount: number;
    let isNew = false;

    if (existingProduct) {
      // Product exists - increment verification count
      const newCount = (existingProduct.verification_count || 1) + 1;
      const { error: updateError } = await supabase
        .from('products')
        .update({
          verification_count: newCount,
          last_verified_date: new Date().toISOString(),
        })
        .eq('id', existingProduct.id);

      if (updateError) {
        console.error('Error updating product:', updateError);
        throw updateError;
      }

      productId = existingProduct.id;
      verificationCount = newCount;
      console.log('Product verified. New count:', verificationCount);
    } else {
      // New product - insert
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert({
          product_name,
          barcode,
          brand,
          category,
          contributed_by_user_id: user.id,
          verification_count: 1,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting product:', insertError);
        throw insertError;
      }

      productId = newProduct.id;
      verificationCount = 1;
      isNew = true;
      console.log('New product created:', productId);

      // Insert ingredients
      const ingredientRecords = ingredients.map((ingredient: any, index: number) => ({
        product_id: productId,
        ingredient_name: ingredient.name || ingredient,
        ingredient_order: index + 1,
        pubchem_cid: ingredient.pubchem_cid || null,
      }));

      const { error: ingredientsError } = await supabase
        .from('product_ingredients')
        .insert(ingredientRecords);

      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError);
        throw ingredientsError;
      }

      console.log('Inserted', ingredientRecords.length, 'ingredients');
    }

    // Link analysis to product
    if (analysis_id) {
      const { error: linkError } = await supabase
        .from('user_analyses')
        .update({ product_id: productId })
        .eq('id', analysis_id);

      if (linkError) {
        console.error('Error linking analysis:', linkError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        product_id: productId,
        verification_count: verificationCount,
        is_new: isNew,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in save-product:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
