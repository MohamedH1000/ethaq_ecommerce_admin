import { type Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Shell } from "@/components/shells/shell";
import AnimatedCharacters from "@/components/ui/animated-characters";
import { SignInForm } from "@/components/forms/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  return (
    <Shell className="max-w-lg ">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            <p className="text-2xl font-bold">تسجيل الدخول</p>
          </CardTitle>
          {/* <CardDescription>
            Choose your preferred sign in method
          </CardDescription> */}
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <OAuthSignIn/> */}
          {/* <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                او استمر 
              </span>
            </div>
          </div> */}
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            <span className="mr-1 hidden sm:inline-block">ليس لديك حساب؟</span>
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              تسجيل حساب جديد
            </Link>
          </div>
          <Link
            aria-label="Reset password"
            href="/signin/reset-password"
            className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
          >
            استعادة الباسوورد
          </Link>
        </CardFooter>
      </Card>
    </Shell>
  );
}
