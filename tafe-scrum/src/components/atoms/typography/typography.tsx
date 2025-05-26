import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("text-primary", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
    },
    size: {
      default: "leading-7",
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold tracking-tight",
      h6: "text-base font-semibold tracking-tight",
      sm: "text-sm text-muted-foreground tracking-tight",
      xs: "text-xs text-muted-foreground tracking-tight",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      table: "my-6 w-full overflow-y-auto",
      th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Typography({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      className={cn(
        typographyVariants({
          variant,
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
