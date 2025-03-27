"use client";

import { activateAccount, deactivateAccount } from "@/lib/actions/user.action";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "processing" | "active" | "inActive";
  registrationDate: string;
  role: string; // This will be overridden by the custom cell renderer
  isAdmin: boolean; // Add this attribute to determine user type
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
  },
  {
    accessorKey: "email",
    header: "الايميل",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "status",
    header: "حالة الحساب",
  },

  {
    accessorKey: "registrationDate",
    header: "تاريخ التسجيل",
  },
  {
    accessorKey: "role",
    header: "نوع المستخدم",
    cell: ({ row }) => {
      const isAdmin = row.original.isAdmin;
      return isAdmin ? "مدير" : "مستخدم"; // Render "Admin" or "User" in Arabic
    },
  },
  {
    accessorKey: "actions",
    header: "الاجراءات",
    cell: ({ row }) => {
      const user = row.original;

      // Function to activate account
      const handleActivate = async () => {
        await activateAccount(user.id, user.email);
        try {
          toast.success("تم تفعيل الحساب وإرسال البريد الإلكتروني بنجاح");
        } catch (error) {
          console.error("Activation error:", error);
          toast.error("فشل في تفعيل الحساب");
        }
      };

      // Function to deactivate account
      const handleDeactivate = async () => {
        await deactivateAccount(user.id, user.email);

        try {
          toast.success("تم تعطيل الحساب وإرسال البريد الإلكتروني بنجاح");
        } catch (error) {
          console.error("Deactivation error:", error);
          toast.error("فشل في تعطيل الحساب");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {user.status === "active" ? (
            <button
              onClick={handleDeactivate}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
              title="تعطيل الحساب"
            >
              <XCircle className="w-5 h-5 text-red-600" />
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="p-1 rounded-full hover:bg-green-100 transition-colors"
              title="تفعيل الحساب"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </button>
          )}
        </div>
      );
    },
  },
];
