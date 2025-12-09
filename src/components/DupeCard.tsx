import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface DupeCardProps {
  name: string;
  brand: string;
  imageUrl?: string;
  reasons: string[];
  sharedIngredients: string[];
  priceEstimate?: string;
  profileMatch?: boolean;
  matchPercentage?: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const DupeCard = ({
  name,
  brand,
  imageUrl,
  reasons,
  sharedIngredients,
  priceEstimate,
  matchPercentage,
  isSaved = false,
  onToggleSave,
}: DupeCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave?.();
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            isSaved
              ? "fill-rose-500 text-rose-500"
              : "text-muted-foreground hover:text-rose-500"
          )}
        />
      </button>

      {/* Match Badge */}
      {matchPercentage && (
        <Badge className="absolute top-3 left-3 z-10 bg-primary/90 text-primary-foreground backdrop-blur-sm">
          {matchPercentage}% Match
        </Badge>
      )}

      {/* Product Image */}
      <div className="aspect-square w-full bg-muted/30 flex items-center justify-center overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-6xl opacity-50">🧴</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {brand}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Price */}
        {priceEstimate && (
          <p className="text-lg font-bold text-foreground">{priceEstimate}</p>
        )}

        {/* Why it's a dupe - tooltip on hover */}
        {reasons.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {reasons[0]}
            </p>
          </div>
        )}

        {/* Shared ingredients preview */}
        {sharedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {sharedIngredients.slice(0, 2).map((ingredient, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-muted/50"
              >
                {ingredient}
              </Badge>
            ))}
            {sharedIngredients.length > 2 && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-muted/50"
              >
                +{sharedIngredients.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
