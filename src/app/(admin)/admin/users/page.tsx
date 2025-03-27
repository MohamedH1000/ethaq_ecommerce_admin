import { Shell } from "@/components/shells/shell";
import UserScreenComponent from "./screens/UsersPageScreen";
import { getAllUsers } from "@/lib/actions/user.action";

const UserPage = async () => {
  const allUsers = await getAllUsers();
  return (
    <Shell variant={"sidebar"}>
      <UserScreenComponent allUsers={allUsers} />
    </Shell>
  );
};

export default UserPage;
