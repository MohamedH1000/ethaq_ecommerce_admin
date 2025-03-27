"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  activateProduct,
  deactivateProduct,
  deleteProduct,
} from "@/lib/actions/product.action";

// Define the shape of Product data based on your Prisma schema
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: { name: string }; // Optional category relation
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "اسم المنتج",
  },
  {
    accessorKey: "description",
    header: "الوصف",
    cell: ({ row }) => (
      <span className="line-clamp-2">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "السعر",
    cell: ({ row }) => (
      <span>{row.original.price.toLocaleString()} ريال سعودي</span>
    ),
  },
  {
    accessorKey: "active",
    header: "الحالة",
    cell: ({ row }) => <span>{row.original.active ? "نشط" : "غير نشط"}</span>,
  },
  {
    accessorKey: "category",
    header: "الفئة",
    cell: ({ row }) => (
      <span>{row.original?.category?.name || "غير محدد"}</span>
    ),
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
    accessorKey: "images",
    header: "الصور",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.images.length > 0 ? (
          <img
            src={row.original.images[0]}
            alt={row.original.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "لا توجد صور"
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const product = row.original;
      const router = useRouter();

      const handleActivate = async () => {
        try {
          await activateProduct(product.id);
          toast.success("تم تفعيل المنتج بنجاح");
          router.refresh();
        } catch (error) {
          console.error("Activation error:", error);
          toast.error("فشل في تفعيل المنتج");
        }
      };

      const handleDeactivate = async () => {
        try {
          await deactivateProduct(product.id);
          toast.success("تم تعطيل المنتج بنجاح");
          router.refresh();
        } catch (error) {
          console.error("Deactivation error:", error);
          toast.error("فشل في تعطيل المنتج");
        }
      };

      const handleEdit = () => {
        // Navigate to edit page
        router.push(`/admin/products/edit/${product.id}`);
      };

      const handleDelete = async () => {
        if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
          try {
            await deleteProduct(product.id);
            toast.success("تم حذف المنتج بنجاح");
            router.refresh();
          } catch (error) {
            console.error("Deletion error:", error);
            toast.error("فشل في حذف المنتج");
          }
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {product.active ? (
            <button
              onClick={handleDeactivate}
              className="p-1 rounded-full hover:bg-red-100 transition-colors"
              title="تعطيل المنتج"
            >
              <XCircle className="w-5 h-5 text-red-600" />
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="p-1 rounded-full hover:bg-green-100 transition-colors"
              title="تفعيل المنتج"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </button>
          )}
          <button
            onClick={handleEdit}
            className="p-1 rounded-full hover:bg-blue-100 transition-colors"
            title="تعديل المنتج"
          >
            <Edit className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-red-100 transition-colors"
            title="حذف المنتج"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      );
    },
  },
];
