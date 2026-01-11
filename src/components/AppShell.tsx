import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
  contentClassName?: string;
};

const AppShell = ({
  children,
  header,
  footer,
  showNavigation = false,
  showFooter = true,
  className,
  contentClassName,
}: AppShellProps) => {
  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      {showNavigation && (
        <header className="w-full bg-primary shadow-soft">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-primary-foreground">
              SkinLytix
            </h2>
            <Navigation />
          </div>
        </header>
      )}
      {header}
      <main className={cn("flex-1", contentClassName)}>{children}</main>
      {showFooter ? footer ?? <Footer /> : null}
    </div>
  );
};

export default AppShell;
