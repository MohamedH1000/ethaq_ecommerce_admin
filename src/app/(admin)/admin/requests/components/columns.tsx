"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/order.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { arSA } from "date-fns/locale";
import { format } from "date-fns";
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
    cell: ({ row }) =>
      format(new Date(row.original.orderDate), "dd/MM/yyyy, hh:mm a", {
        locale: arSA,
      }),
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
    cell: ({ row }) => {
      const [isUpdating, setIsUpdating] = useState(false);
      const router = useRouter();

      const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        console.log(newStatus, "new status");
        try {
          await updateOrderStatus(row.original.id, newStatus);
          toast.success("تم تحديث حالة الطلب بنجاح");
          router.refresh();
        } catch (error) {
          toast.error("حدث خطأ أثناء تحديث حالة الطلب");
        } finally {
          setIsUpdating(false);
        }
      };

      return (
        <Select
          value={row.original.status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="حالة الطلب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="processing">قيد المعالجة</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="delivered">تم التسليم</SelectItem>
            <SelectItem value="cancelled">ملغى</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "orderItems",
    header: "المنتجات",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Dialog>
          <DialogTrigger asChild className="w-full items-center justify-center">
            <Button
              variant="outline"
              className="w-[120px] bg-primary
            text-white rounded-md hover:!bg-primary text-sm"
            >
              عرض
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="space-y-4">
              {row.original.orderItems?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start border-b pb-4 gap-4"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-medium text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-gray-600">
                        {item.quantity} × {item.priceAtPurchase} ر.س
                      </span>
                      <span className="font-medium">
                        {(item.quantity * item.priceAtPurchase).toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
  // {
  //   accessorKey: "totalAmount",
  //   header: "اجمالي المبلغ",
  //   cell: ({ row }) => <span>{row.original.totalAmount} SAR</span>,
  // },
  // {
  //   accessorKey: "paidAmount",
  //   header: "المبلغ المدفوع",
  //   cell: ({ row }) => <span>{row.original.paidAmount} SAR</span>,
  // },
  // {
  //   accessorKey: "remainingAmount",
  //   header: "المبلغ المتبقي",
  //   cell: ({ row }) => (
  //     <span>
  //       {row.original.remainingAmount < 0.01 ? 0 : row.original.remainingAmount}{" "}
  //       SAR
  //     </span>
  //   ),
  // },
  // {
  //   accessorKey: "isPaidFully",
  //   header: "حالة انتهاء الدفع",
  // },
  {
    accessorKey: "address",
    header: "العنوان",
  },
  {
    accessorKey: "username",
    header: "اسم المستخدم",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/users/${row?.original?.user?.id}`);
          }}
        >
          {row?.original?.user?.name}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: "الإجراءات",
  //   cell: ({ row }) => {
  //     const request = row.original;
  //     const router = useRouter();

  //     const handleEdit = (e: React.MouseEvent) => {
  //       e.stopPropagation();

  //       router.push(`/admin/requests/edit/${request.id}`);
  //     };

  //     const handleDelete = async (e: React.MouseEvent) => {
  //       e.stopPropagation();
  //       if (
  //         confirm(
  //           "هل أنت متأكد من حذف هذه الفئة, اذا تم التاكيد فانه سيتم ازالة الفئة من المنتجات المرتبطه بها؟"
  //         )
  //       ) {
  //         try {
  //           // await deleteCategory(category.id);
  //           toast.success("تم حذف الفئة بنجاح");
  //           router.refresh();
  //         } catch (error) {
  //           console.error("Deletion error:", error);
  //           toast.error("فشل في حذف الفئة");
  //         }
  //       }
  //     };

  //     return (
  //       <div className="flex gap-2 justify-center">
  //         <button
  //           onClick={handleEdit}
  //           className="p-1 rounded-full hover:bg-blue-100 transition-colors"
  //           title="تعديل الفئة"
  //         >
  //           <Edit className="w-5 h-5 text-blue-600" />
  //         </button>
  //         <button
  //           onClick={handleDelete}
  //           className="p-1 rounded-full hover:bg-red-100 transition-colors"
  //           title="حذف الفئة"
  //         >
  //           <Trash2 className="w-5 h-5 text-red-600" />
  //         </button>
  //       </div>
  //     );
  //   },
  // },
];
