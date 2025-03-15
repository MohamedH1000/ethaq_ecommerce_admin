"use client";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { MainNav } from "./main-nav";
import { IUser } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Icons } from "../ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { MobileNav } from "./mobile-nav";
import { useCurrentUser } from "../../hooks/user/useCurrentUser";

interface SiteHeaderProps {
  shop?: string;
  isAdminLayout?: boolean;
  isShopLayout?: boolean;
  currentUser: any;
}
export function SiteHeader({
  shop,
  isAdminLayout,
  isShopLayout,
  currentUser,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav
          isAdminLayout={isAdminLayout}
          shop={shop}
          isShopLayout={isShopLayout}
        />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button className="mx-1 rounded-lg">
              <Link
                href={
                  currentUser && currentUser.isAdmin === true
                    ? "/admin/shops/create"
                    : "/seller/shop/create"
                }
              >
                انشاء متجر
              </Link>
            </Button>
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={currentUser?.avatar}
                        alt={currentUser.name}
                      />
                      <AvatarFallback>{currentUser.name}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-3"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          currentUser?.isAdmin === true
                            ? "/admin/profile"
                            : "/seller/profile"
                        }
                      >
                        <Icons.user
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        الملف الشخصي
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          currentUser?.isAdmin === true
                            ? "/admin/dashboard"
                            : "/seller/dashboard"
                        }
                      >
                        <Icons.terminal
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        لوحة التحكم
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/signout">
                      <Icons.logout
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      تسجيل الخروج
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/signin"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                تسجيل الدخول
                <span className="sr-only">تسجيل الدخول</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
