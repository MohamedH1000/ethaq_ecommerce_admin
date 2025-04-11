import { Shell } from "@/components/shells/shell";
import UserScreenComponent from "./screens/UsersPageScreen";
import { getAllUsers } from "@/lib/actions/user.action";

const UserPage = async () => {
  const allUsers = await getAllUsers();
  const users = allUsers.filter((user) => user.isAdmin === false);
  return (
    <Shell variant={"sidebar"}>
      <UserScreenComponent allUsers={users} />
    </Shell>
  );
};

export default UserPage;
