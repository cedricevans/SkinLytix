-- Create saved_dupes table for favorites
CREATE TABLE public.saved_dupes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  brand TEXT,
  image_url TEXT,
  reasons TEXT[],
  shared_ingredients TEXT[],
  price_estimate TEXT,
  source_product_id UUID REFERENCES public.user_analyses(id) ON DELETE SET NULL,
  saved_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_dupes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own saved dupes
CREATE POLICY "Users can view their own saved dupes"
ON public.saved_dupes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save dupes"
ON public.saved_dupes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave dupes"
ON public.saved_dupes FOR DELETE
USING (auth.uid() = user_id);