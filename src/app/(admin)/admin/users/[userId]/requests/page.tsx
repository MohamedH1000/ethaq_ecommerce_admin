import { getUserById } from "@/lib/actions/user.action";
import React from "react";
import { OrderTable } from "./components/order-table";
import { columns } from "./components/columns";

const page = async ({ params }: { params: string }) => {
  const { userId }: any = params;
  const user = await getUserById(userId);
  //   console.log("user", user);
  const userOrders = user?.orders.reverse() || [];
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-3xl">الطلبات</h1>
      </div>
      <div className="mt-5 flex items-center justify-start gap-3"></div>
      <div className="mt-5 w-full">
        <OrderTable columns={columns} data={userOrders} />
      </div>
    </div>
  );
};

export default page;
