"use client";

import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import { useUserStore } from "@/store/userStore";
import { ArrowLeftEndOnRectangleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserCard() {
  const router = useRouter();
  const { user, organisationId, setOrganisationId } = useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          <Avatar className="size-8 shadow-xl">
            <AvatarImage
              src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.name}`}
              alt="@shadcn"
            />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div className="flex-col hidden md:flex">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground max-w-[20ch] line-clamp-1">
              {user?.organisations.find((x) => x.id === organisationId)?.name}
            </p>
          </div>
          {/* <ChevronDownIcon className="text-muted-foreground size-3" /> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="flex gap-2 items-center">
              <Avatar className="size-8 shadow-xl">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.name}`}
                  alt="@shadcn"
                />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div className="flex-col">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs">{user?.email}</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch Organisation</DropdownMenuLabel>
        <DropdownMenuGroup>
          {user?.organisations.map((x) => (
            <DropdownMenuItem
              key={x.id}
              onClick={async () => {
                setOrganisationId(x.id);
                await fetch("/api/org/set-org", {
                  method: "POST",
                  body: JSON.stringify({ org_id: x.id }),
                  headers: { "Content-Type": "application/json" },
                });

                window.location.reload();
              }}
              className={x.id === organisationId ? `bg-accent` : ``}
            >
              <div className="flex justify-between w-full">
                {x.name}

                {x.id === organisationId && <CheckIcon className="text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              try {
                const firebaseAuth = new FirebaseAuth();
                await firebaseAuth.signOut();
                // The signOut method already clears server cookies
                console.log("✅ Logout successful");
              } catch (error) {
                console.error("Error during logout:", error);
              } finally {
                router.push("/login");
              }
            }}
          >
            <ArrowLeftEndOnRectangleIcon /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
