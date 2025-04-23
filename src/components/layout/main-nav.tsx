"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

import GradientLogo from "../common/shared/gradient-logo";
import Image from "next/image";
import { useTheme } from "next-themes";

export function MainNav() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="hidden gap-6 lg:flex">
      <Link
        aria-label="Home"
        href="/"
        className="hidden items-center space-x-2 lg:flex"
      >
        <Image
          src={
            resolvedTheme === "dark"
              ? "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745439492/Logo_ge50rv.png"
              : "https://res.cloudinary.com/dbyc0sncy/image/upload/v1745439493/Logo_light_h4dulg.png"
          }
          alt={"ايثاق ماركت"}
          width={90}
          height={90}
        />
      </Link>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
