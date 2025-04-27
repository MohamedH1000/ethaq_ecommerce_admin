import { getAllOrders } from "@/lib/actions/order.action";
import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";

const page = async () => {
  const allOrders = await getAllOrders();
  // const { totalPaid, totalRemaining } = allOrders?.reduce(
  //   (acc: any, order: any) => {
  //     return {
  //       totalPaid: acc.totalPaid + order.paidAmount,
  //       totalRemaining: acc.totalRemaining + order.remainingAmount,
  //     };
  //   },
  //   { totalPaid: 0, totalRemaining: 0 } // Initial values
  // );
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-3xl">الطلبات</h1>
      </div>
      {/* <div className="mt-5 flex items-center justify-start gap-3">
        <Card className="w-[250px]">
          <CardHeader>
            <CardTitle>المبالغ الدفوعة</CardTitle>
          </CardHeader>
          <CardContent>{totalPaid.toFixed(2)} ريال</CardContent>
        </Card>
        <Card className="w-[250px]">
          <CardHeader>
            <CardTitle>المبالغ المتبقية</CardTitle>
          </CardHeader>
          <CardContent>{totalRemaining.toFixed(2)} ريال</CardContent>
        </Card>
      </div> */}
      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={allOrders || []} />
      </div>
    </div>
  );
};

export default page;
