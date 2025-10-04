import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisData {
  id: string;
  product_name: string;
  epiq_score: number;
  recommendations_json: {
    safe_ingredients: string[];
    concern_ingredients: string[];
    summary: string;
    routine_suggestions: string[];
  };
  analyzed_at: string;
}

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('user_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        toast({
          title: "Error",
          description: "Could not load analysis results.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setAnalysis(data as any as AnalysisData);
      setLoading(false);
    };

    fetchAnalysis();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Attention";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-2">{analysis.product_name}</h1>
        <p className="text-muted-foreground mb-8">
          Analyzed on {new Date(analysis.analyzed_at).toLocaleDateString()}
        </p>

        {/* EpiQ Score */}
        <Card className="p-8 mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">EpiQ Score</h2>
          <div className={`text-7xl font-bold mb-2 ${getScoreColor(analysis.epiq_score)}`}>
            {analysis.epiq_score}
          </div>
          <Badge variant="outline" className="text-lg">
            {getScoreLabel(analysis.epiq_score)}
          </Badge>
          <p className="mt-4 text-muted-foreground">
            {analysis.recommendations_json.summary}
          </p>
        </Card>

        {/* Safe Ingredients */}
        {analysis.recommendations_json.safe_ingredients.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-xl font-semibold">Safe Ingredients</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendations_json.safe_ingredients.map((ingredient, idx) => (
                <Badge key={idx} variant="outline" className="bg-green-50">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Concern Ingredients */}
        {analysis.recommendations_json.concern_ingredients.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-xl font-semibold">Ingredients Needing Attention</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendations_json.concern_ingredients.map((ingredient, idx) => (
                <Badge key={idx} variant="outline" className="bg-yellow-50">
                  {ingredient}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              These ingredients were not found in our database. This doesn't necessarily mean they're harmful, but we recommend researching them further.
            </p>
          </Card>
        )}

        {/* Routine Suggestions */}
        {analysis.recommendations_json.routine_suggestions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Routine Suggestions</h3>
            <ul className="space-y-2">
              {analysis.recommendations_json.routine_suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button variant="cta" size="lg" onClick={() => navigate('/upload')}>
            Analyze Another Product
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Analysis;
