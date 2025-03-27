"use client";

import * as React from "react";
import { redirect, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/hooks/auth/useAuth";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function LogOutButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const logout = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signOut({ redirect: false }); // Sign out without immediate redirect
      window.location.href = "/signin"; // Manually redirect after sign-out
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full items-center space-x-2">
      <Button
        aria-label="Log out"
        size="sm"
        className="w-full"
        disabled={isLoading}
        onClick={logout}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        تسجيل الخروج
      </Button>

      <Button
        aria-label="Go back to the previous page"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
      >
        العودة
      </Button>
    </div>
  );
}
