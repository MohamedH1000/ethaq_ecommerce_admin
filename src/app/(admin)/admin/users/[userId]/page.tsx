import { getUserById } from "@/lib/actions/user.action";
import UserDetails from "./components/UserDetails";

const Page = async ({ params }: { params: { userId: string } }) => {
  const user = await getUserById(params.userId);

  if (!user) {
    return <div className="text-center py-8">المستخدم غير موجود</div>;
  }

  return <UserDetails user={user} />;
};

export default Page;
