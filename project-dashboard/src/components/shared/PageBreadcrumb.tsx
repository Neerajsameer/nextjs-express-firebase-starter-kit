import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";

export default function PageBreadcrumbs({ links }: { links: { text: string; link?: string }[] }) {
  const currentPage = links.pop();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((x) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={x.link ?? "/"} className="max-w-[10ch] truncate">
                  {x.text}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}

        <BreadcrumbPage className="max-w-[20ch] truncate">{currentPage?.text}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
