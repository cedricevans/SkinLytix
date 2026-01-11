import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  children: ReactNode;
  className?: string;
};

const PageHeader = ({ children, className }: PageHeaderProps) => {
  return (
    <div className={cn("w-full border-b border-border/60 bg-background/80 backdrop-blur", className)}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
