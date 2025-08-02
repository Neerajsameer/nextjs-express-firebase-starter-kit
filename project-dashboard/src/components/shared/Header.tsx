"use client";

import { APP_IMAGES } from "@/constants/app_images";
import { useMobile } from "@/hooks/use-mobile";
import { useSidebarStore } from "@/store/sidebarStore";
import { useUserStore } from "@/store/userStore";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import UserCard from "./UserCard";

export default function Header() {
  const { showNav, setShowNav } = useSidebarStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();
  const isMobile = useMobile();
  const router = useRouter();
  const { user, organisationId, setOrganisationId } = useUserStore();

  return (
    <div className="flex justify-between border-b bg-header">
      <div className="px-4 py-3 flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <Button size="icon" className="p-5" variant={"outline"} onClick={() => setShowNav(!showNav)}>
            <Bars3Icon className="cursor-pointer size-6 shrink-0" />
          </Button>

          <Image
            alt="Logo"
            hidden={!isMobile}
            src={theme.theme === "dark" ? APP_IMAGES.logo_white : APP_IMAGES.logo}
            height={32}
            width={144}
            priority
            className="w-auto h-6"
            style={{ objectFit: "contain" }}
          />

          {/* <Input placeholder="Search Anything..." prefix="ddd" className="max-w-[300px]" /> */}
        </div>
        <div className="flex gap-4">
          <ThemeToggle />
          <UserCard />
        </div>
      </div>
    </div>
  );
}
