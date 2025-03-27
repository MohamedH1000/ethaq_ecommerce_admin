"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/actions/category.action";

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
    accessorKey: "name",
    header: "اسم الفئة",
  },
  {
    accessorKey: "images",
    header: "الصورة",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.images ? (
          <img
            src={row.original.images}
            alt={row.original.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "لا توجد صورة"
        )}
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "عدد المنتجات",
    cell: ({ row }) => <span>{row?.original?.products?.length || 0} منتج</span>,
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "تاريخ التحديث",
    cell: ({ row }) => (
      <span>{new Date(row.original.updatedAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const category = row.original;
      const router = useRouter();
      // console.log(category);
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
            await deleteCategory(category.id);
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
