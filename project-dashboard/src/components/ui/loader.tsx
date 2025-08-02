import { cn } from "@/lib/utils";
import { Label } from "./label";

export default function Loader({
  loading,
  className,
  align,
  label,
}: {
  loading: boolean;
  className?: string;
  align?: "center";
  label?: string;
}) {
  if (!loading) return <></>;
  if (align === "center") {
    return (
      <div className="flex justify-center items-center h-full gap-3 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin size-5 lucide lucide-loader-circle-icon lucide-loader-circle", className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        {label && <Label>{label}</Label>}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin size-5 lucide lucide-loader-circle-icon lucide-loader-circle", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}
