import { cn } from "@/lib/utils";

// ---------- PageLayout ----------
function Card({
  className,
  variant = "filled",
  ...props
}: React.ComponentProps<"div"> & { variant?: "filled" | "outlined" }) {
  return (
    <div
      data-slot="page-layout"
      className={cn(
        "rounded-xl flex flex-col ",
        variant === "filled" && "border bg-card",
        props.onClick ? "cursor-pointer" : "",
        className
      )}
      {...props}
    />
  );
}

// ---------- PageHeader ----------
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "grid gap-2 auto-rows-min", // Mobile
        "md:grid-cols-[1fr_auto] md:items-center md:gap-0", // Desktop
        "border-b py-2 px-3 md:py-4 md:px-5",
        className
      )}
      {...props}
    />
  );
}

// ---------- PageTitle ----------
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-title" className={cn("text-2xl font-bold leading-tight", className)} {...props} />;
}

// ---------- PageDescription ----------
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

// ---------- PageActions ----------
function CardActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-actions"
      className={cn(
        // Desktop grid positioning
        "md:col-start-2 md:row-span-2 md:row-start-1 md:justify-self-end",
        // Layout and wrapping
        "flex flex-wrap items-center gap-x-2 gap-y-1 justify-start md:justify-end",
        className
      )}
      {...props}
    />
  );
}

// ---------- PageContent ----------
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-content" className={cn("overflow-y-scroll p-3 md:p-5", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardActions, CardContent };
