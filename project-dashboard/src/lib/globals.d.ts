export {};

declare global {
  type TestType = {};

  type SideBarChild = {
    url: string;
    title: string;
    icon?: ReactNode;
  };

  type SideBarItem = {
    url: string;
    title: string;
    icon?: ReactNode;
    children?: SideBarChild[];
  }[];
}
