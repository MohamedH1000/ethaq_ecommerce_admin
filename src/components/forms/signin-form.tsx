"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "../ui/icons";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";

const loginSchema = z.object({
  name: z.string(),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function SignInForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        name: data.name,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/admin/users");
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message || "فشل تسجيل الدخول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder=""
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              جاري التحميل...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
      </form>
    </Form>
  );
}
