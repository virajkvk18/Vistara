import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  hover = false,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn("glass-card", hover && "glass-hover", glow && "shadow-glow", className)}
      {...props}
    >
      {children}
    </div>
  );
}