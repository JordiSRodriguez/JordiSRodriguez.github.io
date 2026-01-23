import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FileCardProps {
  filename: string;
  language?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function FileCard({
  filename,
  language,
  icon: Icon,
  children,
  className,
}: FileCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border", className)}>
      {/* File tab header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-xs font-mono-display text-foreground">
          {filename}
        </span>
        {language && (
          <span className="text-[10px] font-mono-display text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
            {language}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-git-clean text-[10px] font-mono-display">●</span>
          <span className="text-[10px] text-muted-foreground font-mono-display">
            {Math.floor(Math.random() * 50) + 10}s ago
          </span>
        </div>
      </div>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
}
