"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  creditLimit: number;
  creditUsed: number;
  registrationDate: Date;
  isAdmin: boolean;
  lastLoginDate?: Date;
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "يرجى إدخال كلمة المرور الحالية"),
    newPassword: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "كلمة المرور يجب أن تحتوي على حرف صغير، حرف كبير، ورقم على الأقل"
      ),
    confirmPassword: z.string().min(1, "يرجى تأكيد كلمة المرور الجديدة"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = ({ currentUser: user }: { currentUser: unknown }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        form.reset();
      } else {
        toast.error(result.error || "فشل تغيير كلمة المرور");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">غير قادر على تحميل الملف الشخصي</p>
      </div>
    );
  }

  const creditAvailable =
    (user as User).creditLimit - (user as User).creditUsed;
  const creditUsedPercentage =
    ((user as User).creditUsed / (user as User).creditLimit) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${
                    (user as User).name
                  }`}
                />
                <AvatarFallback>{(user as User).name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{(user as User).name}</h1>
                <p className="text-sm opacity-90">{(user as User).email}</p>
                <div className="mt-2">
                  <Badge
                    variant={
                      (user as User).status === "active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      (user as User).status === "active"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  >
                    {(user as User).status}
                  </Badge>
                  {(user as User).isAdmin && (
                    <Badge className="ml-2 bg-purple-500">مسؤول</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">الايميل</p>
                <p className="font-medium">{(user as User).email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الهاتف</p>
                <p className="font-medium">{(user as User).phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                <p className="font-medium">
                  {new Date(
                    (user as User).registrationDate
                  ).toLocaleDateString()}
                </p>
              </div>
              {(user as User).lastLoginDate && (
                <div>
                  <p className="text-sm text-gray-500">آخر تسجيل دخول</p>
                  <p className="font-medium">
                    {new Date((user as User).lastLoginDate).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credit Information */}
        {/* <Card>
          <CardHeader>
            <CardTitle>معلومات الرصيد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">حد الرصيد</span>
                <span className="font-medium">
                  ${(user as User).creditLimit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">الرصيد المستخدم</span>
                <span className="font-medium">
                  ${(user as User).creditUsed.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">الرصيد المتاح</span>
                <span className="font-medium">
                  ${creditAvailable.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${creditUsedPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card> */}

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePasswordChange)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الحالية</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري التغيير..." : "تغيير كلمة المرور"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
