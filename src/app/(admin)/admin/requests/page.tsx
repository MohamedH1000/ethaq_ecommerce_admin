import { getAllOrders } from "@/lib/actions/order.action";
import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";

const page = async () => {
  const allOrders = await getAllOrders();
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-xl">الطلبات</h1>
      </div>
      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={allOrders} />
      </div>
    </div>
  );
};

export default page;
