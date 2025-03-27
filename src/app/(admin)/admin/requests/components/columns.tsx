"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of Category data based on your Prisma schema
export type Category = {
  id: string;
  name: string;
  images?: string;
  products: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
};

// Server action imports

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "orderDate",
    header: "تاريخ الطلب",
  },
  // {
  //   accessorKey: "images",
  //   header: "الصورة",
  //   cell: ({ row }) => (
  //     <div className="flex gap-1">
  //       {row.original.images ? (
  //         <img
  //           src={row.original.images}
  //           alt={row.original.name}
  //           className="w-10 h-10 object-cover rounded"
  //         />
  //       ) : (
  //         "لا توجد صورة"
  //       )}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "status",
    header: "حالة الطلب",
    // cell: ({ row }) => <span>{row?.original?.products?.length || 0} منتج</span>,
  },
  {
    accessorKey: "totalAmount",
    header: "اجمالي المبلغ",
    cell: ({ row }) => <span>{row.original.totalAmount} SAR</span>,
  },
  {
    accessorKey: "paidAmount",
    header: "المبلغ المدفوع",
    cell: ({ row }) => <span>{row.original.paidAmount} SAR</span>,
  },
  {
    accessorKey: "remainingAmount",
    header: "المبلغ المتبقي",
    cell: ({ row }) => <span>{row.original.remainingAmount} SAR</span>,
  },
  {
    accessorKey: "isPaidFully",
    header: "حالة انتهاء الدفع",
  },
  {
    accessorKey: "address",
    header: "العنوان",
  },
  {
    accessorKey: "userId",
    header: "رقم المستخدم",
  },
  {
    accessorKey: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const category = row.original;
      const router = useRouter();

      const handleEdit = () => {
        router.push(`/admin/categories/edit/${category.id}`);
      };

      const handleDelete = async () => {
        if (
          confirm(
            "هل أنت متأكد من حذف هذه الفئة, اذا تم التاكيد فانه سيتم ازالة الفئة من المنتجات المرتبطه بها؟"
          )
        ) {
          try {
            // await deleteCategory(category.id);
            toast.success("تم حذف الفئة بنجاح");
            router.refresh();
          } catch (error) {
            console.error("Deletion error:", error);
            toast.error("فشل في حذف الفئة");
          }
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleEdit}
            className="p-1 rounded-full hover:bg-blue-100 transition-colors"
            title="تعديل الفئة"
          >
            <Edit className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-red-100 transition-colors"
            title="حذف الفئة"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      );
    },
  },
];
