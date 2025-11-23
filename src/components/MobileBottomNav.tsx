import { Home, Plus, Microscope, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  onAddToRoutine?: () => void;
  showAddToRoutine?: boolean;
}

export const MobileBottomNav = ({ onAddToRoutine, showAddToRoutine = true }: MobileBottomNavProps) => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      action: () => navigate('/'),
      show: true,
    },
    {
      icon: Plus,
      label: "Add",
      action: onAddToRoutine,
      show: showAddToRoutine && !!onAddToRoutine,
    },
    {
      icon: Microscope,
      label: "Analyze",
      action: () => navigate('/upload'),
      show: true,
    },
    {
      icon: TrendingUp,
      label: "Routine",
      action: () => navigate('/routine'),
      show: true,
    },
  ].filter(item => item.show);

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg",
                "transition-all duration-200 active:scale-95",
                "hover:bg-accent/50 active:bg-accent"
              )}
            >
              <Icon className="w-5 h-5 text-foreground" />
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
