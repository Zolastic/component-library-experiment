import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-grey-200 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-grey-200 bg-grey-100 text-text-default hover:bg-grey-300",
        primary:
          "border-primary-active bg-primary-accent text-primary hover:bg-primary-accent/50",
        secondary:
          "border-secondary-active bg-secondary-accent text-secondary hover:bg-secondary-accent/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
