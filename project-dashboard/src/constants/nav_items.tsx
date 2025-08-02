import { Squares2X2Icon, BuildingOffice2Icon, Cog8ToothIcon } from "@heroicons/react/24/outline";

export const NAV_ITEMS: SideBarItem = [
  {
    url: "/",
    title: "Dashboard",
    icon: <Squares2X2Icon className="size-6" />,
  },
  {
    url: "/projects",
    title: "Projects",
    icon: <BuildingOffice2Icon className="size-6" />,
  },
  {
    url: "/settings",
    title: "Settings",
    icon: <Cog8ToothIcon className="size-6" />,
  },
];
