"use client";

import { APP_IMAGES } from "@/constants/app_images";
import { NAV_ITEMS } from "@/constants/nav_items";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  BuildingOffice2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import UserCard from "./UserCard";
import { Separator } from "../ui/separator";

const sidebarVariants = {
  open: { width: 280, opacity: 1 },
  closed: { width: 0, opacity: 0 },
};

interface SidebarContentProps {
  expanded: Record<string, boolean>;
  toggleExpand: (title: string) => void;
  isActive: (url: string) => boolean;
  isChildActive: (children?: SideBarChild[]) => boolean;
}

function SidebarContent({ expanded, toggleExpand, isActive, isChildActive }: SidebarContentProps) {
  const theme = useTheme();
  const { showNav, setShowNav } = useSidebarStore();
  const isMobile = useMobile();

  return (
    <div className="h-full flex flex-col p-4">
      <Image
        className="m-4 w-auto h-8"
        alt="Logo"
        src={theme.theme === "dark" ? APP_IMAGES.logo_white : APP_IMAGES.logo}
        height={32}
        width={144}
        priority
        style={{ objectFit: "contain" }}
      />
      <p className="mt-4 text-sm font-semibold text-muted-foreground tracking-wide mb-2 ml-2">Menu</p>
      <div className="flex h-full flex-col gap-3">
        {NAV_ITEMS.map((x) => {
          const hasChildren = x.children && x.children.length > 0;
          const isOpen = expanded[x.title];
          const isItemActive = isActive(x.url) || isChildActive(x.children);

          return (
            <div key={x.title} className="flex flex-col">
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                  isItemActive ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
                }`}
                onClick={(e) => (hasChildren ? toggleExpand(x.title) : null)}
              >
                <Link
                  href={x.url}
                  className="flex items-center gap-4 w-full"
                  onClick={() => {
                    if (isMobile) setShowNav(false);
                  }}
                >
                  <span className={isItemActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/80"}>
                    {x.icon}
                  </span>
                  <span className={`font-semibold text-sm ${isItemActive ? "text-sidebar-primary-foreground" : ""}`}>
                    {x.title}
                  </span>
                </Link>
                {hasChildren &&
                  (isOpen ? <ChevronUpIcon className="text-white size-5" /> : <ChevronDownIcon className="size-5" />)}
              </div>

              {hasChildren && (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-6 mt-1 flex flex-col gap-1"
                    >
                      {x.children?.map((child) => (
                        <Link
                          key={child.title}
                          href={child.url}
                          className={`flex items-center gap-2 px-2 ml-4 py-1 rounded-md ${
                            isActive(child.url)
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {/* {child.icon} */}
                          <span className="font-semibold text-sm">{child.title}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
      {/* <Separator className="my-4" />
      <UserCard /> */}
    </div>
  );
}

export default function Sidebar() {
  const { showNav, setShowNav } = useSidebarStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const isMobile = useMobile();

  useEffect(() => {
    const showNav = localStorage.getItem("show_nav") === "false" ? false : true;
    setShowNav(showNav);

    function handleResize() {
      if (window.innerWidth < 768) setShowNav(false);
      else setShowNav(true);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  const isChildActive = (children?: SideBarChild[]) => {
    if (!children) return false;
    return children.some((child) => isActive(child.url));
  };

  return (
    <motion.div
      animate={showNav && !isMobile ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden shrink-0 h-screen border-r bg-sidebar text-sidebar-foreground"
    >
      {!isMobile && showNav && (
        <SidebarContent
          expanded={expanded}
          toggleExpand={toggleExpand}
          isActive={isActive}
          isChildActive={isChildActive}
        />
      )}

      <Sheet open={showNav && isMobile} onOpenChange={(value) => setShowNav(value)}>
        <SheetContent side="left" className="w-[280px]">
          <SidebarContent
            expanded={expanded}
            toggleExpand={toggleExpand}
            isActive={isActive}
            isChildActive={isChildActive}
          />
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
