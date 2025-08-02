import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBadgeVariant(
  type: string | undefined
): "default" | "destructive" | "outline" | "secondary" | "success" | "failure" | "info" | null | undefined {
  let variant = "default";
  switch (type) {
    case "Completed":
      variant = "success";
      break;
    case "In Progress":
    case "Info":
      variant = "info";
      break;
    case "On Hold":
    case "Failure":
      variant = "error";
      break;
    case "Planning":
      variant = "warning";
      break;
  }

  return variant as any;
}

export function formatDate(date: any) {
  if (!date) return "-";

  return moment(date).format("Do MMM, YYYY");
}
