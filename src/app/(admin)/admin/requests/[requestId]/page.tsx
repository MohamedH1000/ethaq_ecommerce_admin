import { getOrderById } from "@/lib/actions/order.action";
import OrderDetails from "./components/OrderDetails";

const Page = async ({ params }: { params: { requestId: string } }) => {
  const order = await getOrderById(params.requestId);

  return <OrderDetails order={order} />;
};

export default Page;
