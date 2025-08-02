import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-4 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-muted border border-border text-foreground dark:bg-muted dark:border-border dark:text-foreground",

        success:
          "bg-green-50 border-green-500 [&>svg]:text-green-600 dark:bg-green-900 dark:border-green-500 dark:[&>svg]:text-green-400",

        warning:
          "bg-yellow-50 border-yellow-500 [&>svg]:text-yellow-600 dark:bg-yellow-900/50 dark:border-yellow-500 dark:[&>svg]:text-yellow-300",

        info: "bg-blue-50 border-blue-400 [&>svg]:text-blue-500 dark:bg-blue-900 dark:border-blue-400 dark:[&>svg]:text-blue-300",

        error:
          "bg-red-50 border-red-500 [&>svg]:text-red-600 dark:bg-red-900 dark:border-red-500 dark:[&>svg]:text-red-400",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
