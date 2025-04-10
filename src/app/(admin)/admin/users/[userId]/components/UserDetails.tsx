"use client";

import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createPayment } from "@/lib/actions/payment.action";

interface UserDetailsProps {
  user: any;
}

export default function UserDetails({ user }: UserDetailsProps) {
  // console.log("user", user);
  const router = useRouter();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { totalPaid, totalRemaining } = user.orders.reduce(
  //   (acc: any, order: any) => {
  //     return {
  //       totalPaid: acc.totalPaid + order.paidAmount,
  //       totalRemaining: acc.totalRemaining + order.remainingAmount,
  //     };
  //   },
  //   { totalPaid: 0, totalRemaining: 0 } // Initial values
  // );
  const handleAddPayment = async () => {
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      alert("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > user.remainingAmount) {
      alert("المبلغ المدخل أكبر من المبلغ المتبقي");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the payment record
      await createPayment({
        amount,
        paymentMethod,
        notes: paymentNotes,
        userId: user.id,
        recordedBy: "admin", // Replace with actual admin ID
      });

      // Refresh the page or update local state
      window.location.reload(); // Simple solution, or use state management
    } catch (error) {
      console.error("Payment failed:", error);
      alert("فشل في إضافة الدفعة");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-200">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">{user.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-right">
            <h1 className="text-2xl font-bold">{user.name}</h1>

            <div className="flex flex-wrap gap-4 justify-end">
              <div>
                <p className="text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium">{user.email}</p>
              </div>

              <div>
                <p className="text-gray-500">رقم الهاتف</p>
                <p className="font-medium">{user.phone}</p>
              </div>

              <div>
                <p className="text-gray-500">حالة الحساب</p>
                <Badge
                  variant={
                    user.status === "active"
                      ? "default"
                      : user.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {user.status === "active" && "نشط"}
                  {user.status === "pending" && "قيد الانتظار"}
                  {user.status === "suspended" && "موقوف"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-end pt-4">
              <div>
                <p className="text-gray-500">تاريخ التسجيل</p>
                <p className="font-medium">
                  {format(new Date(user.registrationDate), "d MMMM yyyy", {
                    locale: arSA,
                  })}
                </p>
              </div>

              <div>
                <p className="text-gray-500">آخر تسجيل دخول</p>
                <p className="font-medium">
                  {user.lastLoginDate
                    ? format(new Date(user.lastLoginDate), "d MMMM yyyy", {
                        locale: arSA,
                      })
                    : "غير متوفر"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <div className="bg-white rounded-lg shadow-md p-4 text-right">
          <h3 className="text-lg font-semibold mb-2">الرصيد الحالي</h3>
          <p className="text-2xl font-bold text-blue-600">
            {user.balance?.toFixed(2) || "0.00"} ر.س
          </p>
        </div> */}

        <div className="bg-white rounded-lg shadow-md p-4 text-right">
          <h3 className="text-lg font-semibold mb-2">المبالغ المدفوعة</h3>
          <p className="text-2xl font-bold text-green-600">
            {user?.paidAmount.toFixed(2)} ر.س
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-right">
          <h3 className="text-lg font-semibold mb-2">المبالغ المتبقية</h3>
          <p className="text-2xl font-bold text-orange-600">
            {user?.remainingAmount.toFixed(2)} ر.س
          </p>
        </div>
      </div>

      {/* Addresses */}
      {user.addresses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-right">
            عناوين المستخدم
          </h2>
          <div className="space-y-2">
            {user.addresses.map((address: any, index: any) => (
              <div
                key={index}
                className="border-b pb-2 last:border-0 text-right"
              >
                <p className="font-medium">العنوان {index + 1}</p>
                <p className="text-gray-600">{address}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-right">
          طلبات المستخدم ({user.orders.length})
        </h2>
        <Button
          className="bg-primary hover:bg-primary text-white hover:text-white rounded-lg"
          onClick={() => router.push(`/admin/users/${user.id}/requests`)}
        >
          عرض طلبات المستخدم
        </Button>
        {/* 
        {user.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">المجموع</TableHead>
                  <TableHead className="text-right">المدفوع</TableHead>
                  <TableHead className="text-right">المتبقي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      #{order.id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "d MMM yyyy", {
                        locale: arSA,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {order.status === "pending" && "قيد الانتظار"}
                        {order.status === "approved" && "تم الموافقة"}
                        {order.status === "completed" && "مكتمل"}
                        {order.status === "canceled" && "ملغى"}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)} ر.س</TableCell>
                    <TableCell>{order.paidAmount.toFixed(2)} ر.س</TableCell>
                    <TableCell>
                      {order.remainingAmount.toFixed(2)} ر.س
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">لا توجد طلبات</p>
        )} */}
      </div>

      {/* Payments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-right">
          الدفعات ({user.payments.length})
        </h2>
        <Button
          className="bg-primary hover:bg-primary text-white hover:text-white rounded-lg"
          onClick={() => router.push(`/admin/users/${user.id}/payments`)}
        >
          عرض دفعات المستخدم
        </Button>
      </div>
      {/* Add Payment Section - Only show if remaining amount > 0 */}
      {user.remainingAmount > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-right">
            إضافة دفعة جديدة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
            <div>
              <Label htmlFor="amount">المبلغ (ر.س)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={user.remainingAmount}
                placeholder={`الحد الأقصى: ${user.remainingAmount.toFixed(2)}`}
              />
            </div>

            <div>
              <Label htmlFor="method">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">نقدي</SelectItem>
                  <SelectItem value="card">بطاقة ائتمان</SelectItem>
                  <SelectItem value="transfer">تحويل بنكي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Input
                id="notes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="أي ملاحظات إضافية"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleAddPayment}
              disabled={isSubmitting || !paymentAmount}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة الدفعة"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
