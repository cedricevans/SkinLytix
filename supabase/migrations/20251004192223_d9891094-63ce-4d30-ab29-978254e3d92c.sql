-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table (user-contributed)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE,
  product_name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  image_url TEXT,
  contributed_by_user_id UUID REFERENCES public.profiles(id),
  verification_count INTEGER DEFAULT 1,
  last_verified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_products_contributed_by ON public.products(contributed_by_user_id);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- Authenticated users can insert products
CREATE POLICY "Authenticated users can contribute products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = contributed_by_user_id);

-- Users can update their own products
CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = contributed_by_user_id);

-- Product ingredients table
CREATE TABLE public.product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  ingredient_name TEXT NOT NULL,
  ingredient_order INTEGER NOT NULL,
  pubchem_cid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ingredients_product ON public.product_ingredients(product_id);
CREATE INDEX idx_ingredients_name ON public.product_ingredients(ingredient_name);

ALTER TABLE public.product_ingredients ENABLE ROW LEVEL SECURITY;

-- Anyone can view ingredients
CREATE POLICY "Anyone can view ingredients"
  ON public.product_ingredients FOR SELECT
  USING (true);

-- Authenticated users can insert ingredients
CREATE POLICY "Authenticated users can add ingredients"
  ON public.product_ingredients FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ingredient cache table (PubChem data - permanent cache)
CREATE TABLE public.ingredient_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_name TEXT UNIQUE NOT NULL,
  pubchem_cid TEXT,
  molecular_weight NUMERIC,
  properties_json JSONB,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ingredient_cache_name ON public.ingredient_cache(ingredient_name);

ALTER TABLE public.ingredient_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read ingredient cache
CREATE POLICY "Anyone can read ingredient cache"
  ON public.ingredient_cache FOR SELECT
  USING (true);

-- Product cache table (Open Beauty Facts - 30 day TTL)
CREATE TABLE public.product_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT UNIQUE NOT NULL,
  obf_data_json JSONB NOT NULL,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_cache_barcode ON public.product_cache(barcode);

ALTER TABLE public.product_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read product cache
CREATE POLICY "Anyone can read product cache"
  ON public.product_cache FOR SELECT
  USING (true);

-- User analyses table
CREATE TABLE public.user_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  ingredients_list TEXT NOT NULL,
  epiq_score INTEGER CHECK (epiq_score >= 0 AND epiq_score <= 100),
  recommendations_json JSONB,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON public.user_analyses(user_id);
CREATE INDEX idx_analyses_product ON public.user_analyses(product_id);
CREATE INDEX idx_analyses_date ON public.user_analyses(analyzed_at DESC);

ALTER TABLE public.user_analyses ENABLE ROW LEVEL SECURITY;

-- Users can only view their own analyses
CREATE POLICY "Users can view their own analyses"
  ON public.user_analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own analyses
CREATE POLICY "Users can create their own analyses"
  ON public.user_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update timestamp trigger for products
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();