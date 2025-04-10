"use client";

import { activateAccount, deactivateAccount } from "@/lib/actions/user.action";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

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
    // Display cell
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div
          className={`flex items-center justify-center ${
            status === "active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status === "active" ? "نشط" : "غير نشط"}
        </div>
      );
    },
    // Custom filter function
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId); // Gets "active" or "inactive"

      // Convert filter boolean to string equivalent
      const filterString = filterValue === true ? "active" : "inactive";

      // Show all if filter is undefined
      if (filterValue === undefined) return true;

      return rowValue === filterString;
    },
  },

  {
    accessorKey: "registrationDate",
    header: "تاريخ التسجيل",
    cell: ({ row }) => {
      // Safely parse the date (handle invalid dates)
      const date = row.original.registrationDate
        ? new Date(row.original.registrationDate)
        : null;
      return date ? date.toISOString().split("T")[0] : "غير محدد";
    },
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
      const [showActivateDialog, setShowActivateDialog] = useState(false);
      const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

      // Function to activate account
      const handleActivate = async () => {
        try {
          await activateAccount(user.id, user.email);
          toast.success("تم تفعيل الحساب وإرسال البريد الإلكتروني بنجاح");
        } catch (error) {
          console.error("Activation error:", error);
          toast.error("فشل في تفعيل الحساب");
        } finally {
          setShowActivateDialog(false);
        }
      };

      // Function to deactivate account
      const handleDeactivate = async () => {
        try {
          await deactivateAccount(user.id, user.email);
          toast.success("تم تعطيل الحساب وإرسال البريد الإلكتروني بنجاح");
        } catch (error) {
          console.error("Deactivation error:", error);
          toast.error("فشل في تعطيل الحساب");
        } finally {
          setShowDeactivateDialog(false);
        }
      };

      return (
        <div
          className="flex gap-2 justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Activate Button & Dialog */}
          {user.status !== "active" && (
            <>
              <button
                onClick={() => setShowActivateDialog(true)}
                className="p-1 rounded-full hover:bg-green-100 transition-colors"
                title="تفعيل الحساب"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
              </button>

              <Dialog
                open={showActivateDialog}
                onOpenChange={setShowActivateDialog}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>تأكيد التفعيل</DialogTitle>
                    <DialogDescription>
                      هل أنت متأكد من رغبتك في تفعيل هذا الحساب؟
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowActivateDialog(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleActivate}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      تأكيد التفعيل
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {/* Deactivate Button & Dialog */}
          {user.status === "active" && (
            <>
              <button
                onClick={() => setShowDeactivateDialog(true)}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                title="تعطيل الحساب"
              >
                <XCircle className="w-5 h-5 text-red-600" />
              </button>

              <Dialog
                open={showDeactivateDialog}
                onOpenChange={setShowDeactivateDialog}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>تأكيد التعطيل</DialogTitle>
                    <DialogDescription>
                      هل أنت متأكد من رغبتك في تعطيل هذا الحساب؟
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeactivateDialog(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleDeactivate}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      تأكيد التعطيل
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      );
    },
  },
];
