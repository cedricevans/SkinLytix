-- Create ingredient_validations table for per-ingredient validation by students
CREATE TABLE public.ingredient_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to analysis and ingredient
  analysis_id UUID REFERENCES public.user_analyses(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  
  -- Validation data
  validator_id UUID NOT NULL,
  validator_institution TEXT,
  
  -- Source verification
  pubchem_data_correct BOOLEAN,
  pubchem_cid_verified TEXT,
  molecular_weight_correct BOOLEAN,
  
  -- AI verification
  ai_explanation_accurate BOOLEAN,
  ai_role_classification_correct BOOLEAN,
  
  -- Corrections
  corrected_role TEXT,
  corrected_safety_level TEXT,
  correction_notes TEXT,
  
  -- Reference sources used
  reference_sources JSONB DEFAULT '[]',
  
  -- Status
  validation_status TEXT DEFAULT 'validated',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one validation per ingredient per analysis per validator
CREATE UNIQUE INDEX idx_ingredient_validations_unique 
  ON public.ingredient_validations(analysis_id, ingredient_name, validator_id);

-- Enable RLS
ALTER TABLE public.ingredient_validations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Validators can insert their own validations"
  ON public.ingredient_validations FOR INSERT
  WITH CHECK (validator_id = auth.uid());

CREATE POLICY "Validators can update their own validations"
  ON public.ingredient_validations FOR UPDATE
  USING (validator_id = auth.uid());

CREATE POLICY "Anyone can view validations"
  ON public.ingredient_validations FOR SELECT
  USING (true);

-- Create ingredient_corrections table for curated verified ingredient data
CREATE TABLE public.ingredient_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ingredient identity
  ingredient_name TEXT NOT NULL UNIQUE,
  canonical_name TEXT,
  
  -- Verified data
  verified_pubchem_cid TEXT,
  verified_molecular_weight NUMERIC,
  verified_role TEXT,
  verified_safety_level TEXT,
  
  -- Educational content
  verified_explanation TEXT,
  common_names TEXT[],
  
  -- Provenance
  validation_count INTEGER DEFAULT 1,
  last_validated_by UUID,
  last_validated_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ingredient_corrections ENABLE ROW LEVEL SECURITY;

-- Policy for reviewers to manage corrections
CREATE POLICY "Reviewers can manage corrections"
  ON public.ingredient_corrections FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
    OR EXISTS (
      SELECT 1 FROM public.student_certifications
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') 
    OR public.has_role(auth.uid(), 'moderator')
    OR EXISTS (
      SELECT 1 FROM public.student_certifications
      WHERE user_id = auth.uid()
    )
  );

-- Anyone can view corrections
CREATE POLICY "Anyone can view corrections"
  ON public.ingredient_corrections FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_ingredient_corrections_updated_at
  BEFORE UPDATE ON public.ingredient_corrections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();