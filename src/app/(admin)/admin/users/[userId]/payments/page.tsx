import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { getUserById } from "@/lib/actions/user.action";
import { arSA } from "date-fns/locale";
import { format } from "date-fns";
import React from "react";

const page = async ({ params }: { params: string }) => {
  const { userId }: any = params;
  const user = await getUserById(userId);
  //   console.log(user, "user");
  return (
    <div className="w-full mt-5 border rounded-lg overflow-hidden">
      <h1 className="p-4 font-bold text-2xl">دفعات المستخدم</h1>
      {user?.payments.length > 0 ? (
        <div className="overflow-x-auto">
          <Table dir="rtl" className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right w-[15%]">رقم الدفعة</TableHead>
                <TableHead className="text-right w-[20%]">التاريخ</TableHead>
                <TableHead className="text-right w-[15%]">المبلغ</TableHead>
                <TableHead className="text-right w-[20%]">
                  طريقة الدفع
                </TableHead>
                <TableHead className="text-right w-[30%]">ملاحظات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="w-[15%] font-medium">
                    #{payment.id.slice(-6)}
                  </TableCell>
                  <TableCell className="w-[20%]">
                    {format(new Date(payment.paymentDate), "d MMM yyyy", {
                      locale: arSA,
                    })}
                  </TableCell>
                  <TableCell className="w-[15%]">
                    {payment.amount.toFixed(2)} ر.س
                  </TableCell>
                  <TableCell className="w-[20%]">
                    {payment.paymentMethod === "cash" && "نقدي"}
                    {payment.paymentMethod === "card" && "بطاقة ائتمان"}
                    {payment.paymentMethod === "transfer" && "تحويل بنكي"}
                  </TableCell>
                  <TableCell className="w-[30%] max-w-xs truncate">
                    {payment.notes || "لا توجد ملاحظات"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">لا توجد دفعات</p>
      )}
    </div>
  );
};

export default page;
