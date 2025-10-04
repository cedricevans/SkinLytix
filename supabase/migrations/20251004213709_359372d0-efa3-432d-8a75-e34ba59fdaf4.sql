-- Create routines table
CREATE TABLE public.routines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routine_products junction table
CREATE TABLE public.routine_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES public.user_analyses(id) ON DELETE CASCADE,
  usage_frequency TEXT NOT NULL CHECK (usage_frequency IN ('AM', 'PM', 'Both')),
  product_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create routine_optimizations table to store analysis results
CREATE TABLE public.routine_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  optimization_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_optimizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routines
CREATE POLICY "Users can view their own routines"
ON public.routines FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines"
ON public.routines FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines"
ON public.routines FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines"
ON public.routines FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for routine_products
CREATE POLICY "Users can view their routine products"
ON public.routine_products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_products.routine_id
    AND routines.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add products to their routines"
ON public.routine_products FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_products.routine_id
    AND routines.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their routine products"
ON public.routine_products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_products.routine_id
    AND routines.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their routine products"
ON public.routine_products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_products.routine_id
    AND routines.user_id = auth.uid()
  )
);

-- RLS Policies for routine_optimizations
CREATE POLICY "Users can view their routine optimizations"
ON public.routine_optimizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_optimizations.routine_id
    AND routines.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create routine optimizations"
ON public.routine_optimizations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_optimizations.routine_id
    AND routines.user_id = auth.uid()
  )
);

-- Add trigger for updating routines updated_at
CREATE TRIGGER update_routines_updated_at
BEFORE UPDATE ON public.routines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();