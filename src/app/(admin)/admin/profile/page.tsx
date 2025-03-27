import React from "react";
import Profile from "./components/Profile";
import { getCurrentUser } from "@/lib/actions/user.action";

const page = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <Profile currentUser={currentUser} />
    </div>
  );
};

export default page;
