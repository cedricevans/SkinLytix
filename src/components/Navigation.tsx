import { useState } from "react";
import { ClipboardCheck, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useReviewerAccess } from "@/hooks/useReviewerAccess";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type NavigationVariant = "marketing" | "app";

const marketingNavigationItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/pricing", isRoute: true },
];

const appNavigationItems = [
  { label: "Home", href: "/home", isRoute: true },
  { label: "Scan", href: "/upload", isRoute: true },
  { label: "Compare", href: "/compare", isRoute: true },
  { label: "Favorites", href: "/favorites", isRoute: true },
  { label: "Routine", href: "/routine", isRoute: true },
  { label: "Profile", href: "/profile", isRoute: true },
];

const Navigation = ({
  variant = "marketing",
  onAskGpt,
}: {
  variant?: NavigationVariant;
  onAskGpt?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { hasAccess: hasReviewerAccess } = useReviewerAccess();
  const { toast } = useToast();
  const isAppNav = variant === "app";
  const navigationItems = isAppNav ? appNavigationItems : marketingNavigationItems;

  const scrollToSection = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      navigate(href);
      setOpen(false);
      return;
    }
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
        return;
      }
      navigate(`/${href}`);
      setOpen(false);
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
    setOpen(false);
  };

  const handleGetStarted = () => {
    navigate("/auth");
    setOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/", { replace: true });
  };

  const handleAskGpt = async () => {
    if (!isAppNav) return;
    if (onAskGpt) {
      onAskGpt();
      setOpen(false);
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        setOpen(false);
        return;
      }

      const { data } = await supabase
        .from("user_analyses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.id) {
        navigate(`/analysis/${data.id}?chat=1`);
      } else {
        navigate("/upload");
      }
    } catch (error) {
      console.error("Failed to open SkinLytixGPT:", error);
      toast({
        title: "Unable to open chat",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="md:hidden w-[280px] sm:w-[320px]">
          <nav className="flex flex-col gap-4 mt-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href, (item as any).isRoute)}
                className="text-left px-4 py-3 text-lg font-subheading hover:bg-accent/10 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            {hasReviewerAccess && (
              <button
                onClick={() => {
                  navigate('/dashboard/reviewer');
                  setOpen(false);
                }}
                className="text-left px-4 py-3 text-lg font-subheading hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-2 text-primary"
              >
                <ClipboardCheck className="w-5 h-5" />
                Reviewer
              </button>
            )}
            {isAppNav && onAskGpt && (
              <div className="mt-2 px-4">
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={handleAskGpt}
                >
                  Ask SkinLytixGPT
                </Button>
              </div>
            )}
            {isAppNav ? (
              <div className="mt-4 space-y-3 px-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3 px-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:flex items-center gap-6">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.href, (item as any).isRoute)}
            className="text-sm font-subheading text-primary-foreground hover:text-primary-foreground/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary-foreground after:transition-all after:duration-300"
          >
            {item.label}
          </button>
        ))}
        {hasReviewerAccess && (
          <button
            onClick={() => navigate('/dashboard/reviewer')}
            className="text-sm font-subheading text-primary-foreground hover:text-primary-foreground/80 transition-colors flex items-center gap-1.5"
          >
            <ClipboardCheck className="w-4 h-4" />
            Reviewer
          </button>
        )}
        {isAppNav && onAskGpt && (
          <Button
            variant="cta"
            size="sm"
            onClick={handleAskGpt}
          >
            Ask SkinLytixGPT
          </Button>
        )}
        {isAppNav ? (
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 text-white border border-white/50 hover:bg-white/30 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 text-white border border-white/50 hover:bg-white/30 transition-all"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button variant="cta" size="sm" onClick={handleGetStarted}>
              Get Started Free
            </Button>
          </>
        )}
      </nav>
    </>
  );
};

export default Navigation;
