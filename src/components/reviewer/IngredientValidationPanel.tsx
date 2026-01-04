import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2, 
  XCircle, 
  FlaskConical, 
  Bot,
  ExternalLink,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IngredientValidationPanelProps {
  analysisId: string;
  ingredientName: string;
  pubchemCid?: string | null;
  molecularWeight?: number | null;
  aiRole?: string;
  aiExplanation?: string;
  existingValidation?: {
    pubchem_data_correct: boolean | null;
    ai_explanation_accurate: boolean | null;
    corrected_role: string | null;
    corrected_safety_level: string | null;
    correction_notes: string | null;
    reference_sources: string[];
    validation_status: string;
  } | null;
  institution: string;
  onValidationComplete: () => void;
}

const INGREDIENT_ROLES = [
  'humectant',
  'emollient',
  'surfactant',
  'preservative',
  'antioxidant',
  'fragrance',
  'colorant',
  'emulsifier',
  'thickener',
  'pH adjuster',
  'solvent',
  'active ingredient',
  'other'
];

const SAFETY_LEVELS = [
  { value: 'safe', label: 'Safe', color: 'bg-green-500/10 text-green-600' },
  { value: 'caution', label: 'Caution', color: 'bg-amber-500/10 text-amber-600' },
  { value: 'avoid', label: 'Avoid', color: 'bg-red-500/10 text-red-600' }
];

const REFERENCE_SOURCES = [
  'PubChem',
  'CIR (Cosmetic Ingredient Review)',
  'EWG Skin Deep',
  'Paula\'s Choice Dictionary',
  'Academic Textbook',
  'Peer-Reviewed Paper',
  'Other'
];

export function IngredientValidationPanel({
  analysisId,
  ingredientName,
  pubchemCid,
  molecularWeight,
  aiRole,
  aiExplanation,
  existingValidation,
  institution,
  onValidationComplete
}: IngredientValidationPanelProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [pubchemCorrect, setPubchemCorrect] = useState<boolean | null>(existingValidation?.pubchem_data_correct ?? null);
  const [aiAccurate, setAiAccurate] = useState<boolean | null>(existingValidation?.ai_explanation_accurate ?? null);
  const [correctedRole, setCorrectedRole] = useState(existingValidation?.corrected_role || '');
  const [safetyLevel, setSafetyLevel] = useState(existingValidation?.corrected_safety_level || '');
  const [notes, setNotes] = useState(existingValidation?.correction_notes || '');
  const [selectedSources, setSelectedSources] = useState<string[]>(
    existingValidation?.reference_sources || []
  );

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleSave = async () => {
    if (pubchemCorrect === null || aiAccurate === null) {
      toast({
        title: "Incomplete validation",
        description: "Please verify both PubChem data and AI explanation accuracy.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const validationData = {
        analysis_id: analysisId,
        ingredient_name: ingredientName,
        validator_id: user.id,
        validator_institution: institution,
        pubchem_data_correct: pubchemCorrect,
        pubchem_cid_verified: pubchemCid || null,
        molecular_weight_correct: pubchemCorrect,
        ai_explanation_accurate: aiAccurate,
        ai_role_classification_correct: aiAccurate && !correctedRole,
        corrected_role: correctedRole || null,
        corrected_safety_level: safetyLevel || null,
        correction_notes: notes || null,
        reference_sources: selectedSources,
        validation_status: (!pubchemCorrect || !aiAccurate) ? 'needs_correction' : 'validated'
      };

      const { error } = await supabase
        .from('ingredient_validations')
        .upsert(validationData, {
          onConflict: 'analysis_id,ingredient_name,validator_id'
        });

      if (error) throw error;

      toast({
        title: "Validation saved!",
        description: `${ingredientName} has been validated.`
      });

      onValidationComplete();
    } catch (error: any) {
      console.error('Error saving validation:', error);
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            {ingredientName}
          </CardTitle>
          {existingValidation && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Validated
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PubChem Data Section */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FlaskConical className="w-4 h-4 text-primary" />
            PubChem Data
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">CID:</span>{' '}
              <span className="font-mono">{pubchemCid || 'Not found'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mol. Weight:</span>{' '}
              <span className="font-mono">
                {molecularWeight ? `${molecularWeight} g/mol` : 'N/A'}
              </span>
            </div>
          </div>
          {pubchemCid && (
            <a 
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              View on PubChem <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant={pubchemCorrect === true ? "default" : "outline"}
              size="sm"
              onClick={() => setPubchemCorrect(true)}
              className={pubchemCorrect === true ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Correct
            </Button>
            <Button
              variant={pubchemCorrect === false ? "default" : "outline"}
              size="sm"
              onClick={() => setPubchemCorrect(false)}
              className={pubchemCorrect === false ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Incorrect
            </Button>
          </div>
        </div>

        {/* AI Explanation Section */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot className="w-4 h-4 text-primary" />
            AI Analysis
          </div>
          {aiRole && (
            <div className="text-sm">
              <span className="text-muted-foreground">Role:</span>{' '}
              <Badge variant="secondary" className="ml-1">{aiRole}</Badge>
            </div>
          )}
          {aiExplanation && (
            <p className="text-sm text-muted-foreground italic">
              "{aiExplanation}"
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant={aiAccurate === true ? "default" : "outline"}
              size="sm"
              onClick={() => setAiAccurate(true)}
              className={aiAccurate === true ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Accurate
            </Button>
            <Button
              variant={aiAccurate === false ? "default" : "outline"}
              size="sm"
              onClick={() => setAiAccurate(false)}
              className={aiAccurate === false ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Needs Revision
            </Button>
          </div>
        </div>

        {/* Corrections Section */}
        {(pubchemCorrect === false || aiAccurate === false) && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              Corrections Required
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Correct Role</Label>
                <Select value={correctedRole} onValueChange={setCorrectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INGREDIENT_ROLES.map(role => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Safety Level</Label>
                <Select value={safetyLevel} onValueChange={setSafetyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select safety..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SAFETY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className={`px-2 py-0.5 rounded ${level.color}`}>
                          {level.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Correction Notes</Label>
              <Textarea
                placeholder="Explain what's incorrect and provide the correct information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Reference Sources */}
        <div className="space-y-3">
          <Label className="text-sm">Reference Sources Used</Label>
          <div className="flex flex-wrap gap-2">
            {REFERENCE_SOURCES.map(source => (
              <label 
                key={source}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <Checkbox
                  checked={selectedSources.includes(source)}
                  onCheckedChange={() => toggleSource(source)}
                />
                <span className="text-sm">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Validation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
