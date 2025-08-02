"use client";

import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  function setDeviceTheme(theme: string) {
    setTheme(theme);
    // window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 p-2 border rounded-full">
          {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          {/* <p className="text-xs"> Switch Theme</p> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setDeviceTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeviceTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeviceTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
