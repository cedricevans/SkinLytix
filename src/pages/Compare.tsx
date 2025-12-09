import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Home, ArrowLeft, GitCompare, Lock, Crown, CheckCircle2, AlertTriangle, DollarSign, Sparkles, Filter, X } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { PaywallModal } from "@/components/paywall/PaywallModal";
import { AnimatedScoreGauge } from "@/components/AnimatedScoreGauge";

interface Analysis {
  id: string;
  product_name: string;
  brand?: string;
  category?: string;
  epiq_score: number | null;
  product_price?: number | null;
  analyzed_at: string;
  recommendations_json?: {
    summary?: string;
    beneficial_ingredients?: Array<{ name: string; benefit: string }>;
    problematic_ingredients?: Array<{ name: string; reason: string }>;
    safe_ingredients?: Array<any>;
    routine_suggestions?: string[];
    personalized?: boolean;
  };
}

interface UserProfile {
  skin_type?: string;
  skin_concerns?: string[];
}

const SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "normal"];
const SKIN_CONCERNS = [
  "acne",
  "aging",
  "dark_spots",
  "dryness",
  "redness",
  "sensitivity",
  "uneven_texture",
  "dullness",
];

export default function Compare() {
  const navigate = useNavigate();
  useTracking("compare");
  const { effectiveTier, canAccess } = useSubscription();
  const { usage, incrementUsage, canUse, premiumLimits } = useUsageLimits();

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  
  // Filters
  const [filterSkinType, setFilterSkinType] = useState<string>("all");
  const [filterConcern, setFilterConcern] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Comparison limits by tier
  const COMPARISON_LIMITS = { free: 2, premium: 5, pro: Infinity };
  const maxProducts = COMPARISON_LIMITS[effectiveTier] || 2;
  const isFree = effectiveTier === "free";
  const isPremium = effectiveTier === "premium";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load user profile for skin type/concerns
      const { data: profile } = await supabase
        .from("profiles")
        .select("skin_type, skin_concerns")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserProfile({
          skin_type: profile.skin_type || undefined,
          skin_concerns: Array.isArray(profile.skin_concerns) 
            ? (profile.skin_concerns as string[]) 
            : [],
        });
      }

      // Load all analyses
      const { data: analysesData } = await supabase
        .from("user_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("analyzed_at", { ascending: false });

      setAnalyses((analysesData as Analysis[]) || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from analyses
  const categories = useMemo(() => {
    const cats = new Set<string>();
    analyses.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [analyses]);

  // Filter analyses based on selected filters
  const filteredAnalyses = useMemo(() => {
    return analyses.filter((a) => {
      // Category filter
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      
      // For skin type/concern filters, we'd need the analysis to have personalized data
      // For now, show all unless explicitly filtered
      return true;
    });
  }, [analyses, filterCategory]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      // Check limit before adding
      if (newSelected.size >= maxProducts) {
        toast.error(`${effectiveTier === 'free' ? 'Free' : 'Premium'} tier allows comparing up to ${maxProducts} products`);
        setShowPaywall(true);
        return;
      }
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectedAnalyses = useMemo(() => {
    return analyses.filter((a) => selectedIds.has(a.id));
  }, [analyses, selectedIds]);

  const handleCompare = async () => {
    if (selectedIds.size < 2) {
      toast.error("Select at least 2 products to compare");
      return;
    }

    // Check usage limits for premium tier
    if (isPremium && !canUse("productComparisonsUsed", "premium")) {
      setShowPaywall(true);
      return;
    }

    setComparing(true);

    // Increment usage for non-free tiers
    if (isPremium) {
      await incrementUsage("productComparisonsUsed");
    }

    setComparing(false);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number | null) => {
    if (score === null) return "bg-muted";
    if (score >= 70) return "bg-green-500/10 border-green-500/20";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {selectedIds.size} / {maxProducts === Infinity ? "∞" : maxProducts} selected
            </Badge>
            {isPremium && (
              <Badge variant="outline" className="text-xs">
                {premiumLimits.productComparisons - usage.productComparisonsUsed} comparisons left
              </Badge>
            )}
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitCompare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Compare Products</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Select products to compare side-by-side. See which products best match your skin type
            and concerns, compare ingredients, and find the best value.
          </p>
        </div>

        {/* Skin Profile Banner */}
        {userProfile.skin_type && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
            <div className="flex items-center gap-3 flex-wrap">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium">Your Skin Profile:</span>
              <Badge variant="default" className="capitalize">
                {userProfile.skin_type} Skin
              </Badge>
              {userProfile.skin_concerns?.slice(0, 3).map((concern) => (
                <Badge key={concern} variant="secondary" className="capitalize">
                  {concern.replace("_", " ")}
                </Badge>
              ))}
              <Button variant="link" size="sm" onClick={() => navigate("/profile")} className="ml-auto">
                Update Profile
              </Button>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedIds.size > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <X className="w-4 h-4 mr-1" />
                Clear Selection
              </Button>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Selection List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Products</h2>
            
            {filteredAnalyses.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No analyzed products found</p>
                <Button onClick={() => navigate("/upload")} variant="default">
                  Analyze Your First Product
                </Button>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredAnalyses.map((analysis) => (
                  <Card
                    key={analysis.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedIds.has(analysis.id)
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleSelection(analysis.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedIds.has(analysis.id)}
                        onCheckedChange={() => toggleSelection(analysis.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{analysis.product_name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {analysis.brand && (
                            <span className="text-xs text-muted-foreground">{analysis.brand}</span>
                          )}
                          {analysis.category && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {analysis.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {analysis.epiq_score !== null && (
                            <span className={`text-sm font-semibold ${getScoreColor(analysis.epiq_score)}`}>
                              EpiQ: {analysis.epiq_score}
                            </span>
                          )}
                          {analysis.product_price && (
                            <span className="text-sm text-muted-foreground flex items-center">
                              <DollarSign className="w-3 h-3" />
                              {analysis.product_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Comparison</h2>
              {selectedIds.size >= 2 && (
                <Button onClick={handleCompare} disabled={comparing}>
                  <GitCompare className="w-4 h-4 mr-2" />
                  {comparing ? "Comparing..." : "Compare Now"}
                </Button>
              )}
            </div>

            {selectedAnalyses.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <GitCompare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Products Selected</h3>
                <p className="text-muted-foreground">
                  Select 2-{maxProducts === Infinity ? "∞" : maxProducts} products from the list to compare them side-by-side
                </p>
              </Card>
            ) : selectedAnalyses.length === 1 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-muted-foreground">
                  Select at least one more product to start comparing
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Score Comparison */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    EpiQ Score Comparison
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedAnalyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className={`p-4 rounded-lg border text-center ${getScoreBg(analysis.epiq_score)}`}
                      >
                        <p className="text-xs text-muted-foreground mb-2 truncate">{analysis.product_name}</p>
                        <p className={`text-3xl font-bold ${getScoreColor(analysis.epiq_score)}`}>
                          {analysis.epiq_score ?? "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {analysis.epiq_score !== null
                            ? analysis.epiq_score >= 70
                              ? "Excellent"
                              : analysis.epiq_score >= 50
                              ? "Good"
                              : "Needs Attention"
                            : "Not Scored"}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Cost Comparison */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Cost Comparison
                  </h3>
                  <div className="space-y-3">
                    {selectedAnalyses
                      .sort((a, b) => (a.product_price || 999) - (b.product_price || 999))
                      .map((analysis, idx) => (
                        <div
                          key={analysis.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={idx === 0 ? "default" : "outline"} className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                              {idx + 1}
                            </Badge>
                            <span className="font-medium truncate max-w-[200px]">{analysis.product_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${idx === 0 ? "text-green-600" : ""}`}>
                              ${analysis.product_price?.toFixed(2) || "N/A"}
                            </span>
                            {idx === 0 && analysis.product_price && (
                              <Badge variant="secondary" className="text-xs">Best Value</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>

                {/* Why This Matters */}
                <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Why Compare Products?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <div>
                        <p className="font-medium">Find the Best Match</p>
                        <p className="text-muted-foreground">Higher EpiQ scores mean better ingredient safety for your skin type</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <div>
                        <p className="font-medium">Save Money</p>
                        <p className="text-muted-foreground">Compare prices to find products with similar benefits at lower costs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <div>
                        <p className="font-medium">Avoid Conflicts</p>
                        <p className="text-muted-foreground">See which products share ingredients that may interact poorly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <div>
                        <p className="font-medium">Build Better Routines</p>
                        <p className="text-muted-foreground">Choose complementary products that work well together</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Ingredient Highlights */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Ingredient Highlights</h3>
                  <div className="grid gap-4">
                    {selectedAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{analysis.product_name}</h4>
                          <Badge className={getScoreBg(analysis.epiq_score).replace('bg-', 'bg-').replace('/10', '/20')}>
                            {analysis.epiq_score ?? "N/A"}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {/* Beneficial */}
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Top Benefits
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.recommendations_json?.beneficial_ingredients?.slice(0, 3).map((ing) => (
                                <Badge key={ing.name} variant="outline" className="text-xs bg-green-500/10 border-green-500/20">
                                  {ing.name}
                                </Badge>
                              )) || <span className="text-xs text-muted-foreground">No data</span>}
                            </div>
                          </div>
                          {/* Concerns */}
                          <div>
                            <p className="text-xs font-medium text-amber-600 mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Watch Out For
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.recommendations_json?.problematic_ingredients?.slice(0, 3).map((ing) => (
                                <Badge key={ing.name} variant="outline" className="text-xs bg-amber-500/10 border-amber-500/20">
                                  {ing.name}
                                </Badge>
                              )) || <span className="text-xs text-muted-foreground">None found</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {isFree && selectedIds.size >= 2 && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-cta/10 border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Compare More Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Premium to compare up to 5 products, or Pro for unlimited comparisons
                  </p>
                </div>
              </div>
              <Button variant="cta" onClick={() => setShowPaywall(true)}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}
      </div>

      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        feature="Product Comparison"
        featureDescription="Compare more products side-by-side to find the perfect match for your skin."
      />
    </div>
  );
}
