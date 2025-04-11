import React from "react";

const page = ({ params }: { params: any }) => {
  const { requestId }: any = params;
  return <div>request:{requestId}</div>;
};

export default page;
