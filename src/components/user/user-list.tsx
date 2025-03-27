"use client";

import { useGlobalAlertStateStore } from "@/store/alerts";
import { IPaginatorInfo, ITag, IUser, ImageInfo, SortOrder } from "@/types";
import { PaginatorInfo } from "@/types/utils";
import Link from "next/link";
import { Icons } from "../ui/icons";

import Image from "next/image";
import { Tooltip } from "../common/Tooltip";
import { MainTable } from "../table";
import Pagination from "../ui/pagination";
import { useState } from "react";
import TitleWithSort from "../ui/title-with-sort";

type IProps = {
  user: PaginatorInfo<IUser>;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const UserList = ({ user, onPagination, onOrder, onSort }: IProps) => {
  const rowExpandable = (record: any) => record.children?.length;
  const setShowTagAlert = useGlobalAlertStateStore(
    (state) => state.setShowTagAlert
  );
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const paginateInfo: IPaginatorInfo = {
    hasNextPage: user?.hasNextPage,
    hasPrevPage: user?.hasPrevPage,
    limit: user?.limit,
    nextPage: user?.nextPage,
    page: user?.page,
    pagingCounter: user?.pagingCounter,
    prevPage: user?.prevPage,
    totalDocs: user?.totalDocs,
    totalPages: user?.totalPages,
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      align: "center",
      width: 100,
    },
    {
      title: (
        <TitleWithSort
          title={"الاسم"}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "name"
          }
          isActive={sortingObj.column === "name"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "name",
      key: "name",
      align: "right",
      width: 150,
    },

    {
      title: (
        <TitleWithSort
          title={"الايميل"}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "email"
          }
          isActive={sortingObj.column === "email"}
        />
      ),
      dataIndex: "email",
      key: "email",
      align: "right",
      width: 150,
    },
    {
      title: (
        <TitleWithSort
          title={"رقم الهاتف"}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "phoneNumber"
          }
          isActive={sortingObj.column === "phoneNumber"}
        />
      ),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "right",
      width: 150,
    },
    {
      title: (
        <TitleWithSort
          title={"حالة الحساب"}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "status"
          }
          isActive={sortingObj.column === "status"}
        />
      ),
      dataIndex: "status",
      key: "status",
      align: "right",
      width: 150,
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={"تاريخ التسجيل"}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === "registrationDate"
    //       }
    //       isActive={sortingObj.column === "registrationDate"}
    //     />
    //   ),
    //   dataIndex: "registrationDate",
    //   key: "registrationDate",
    //   align: "right",
    //   width: 150,
    // },

    {
      title: "نوع المستخدم",
      dataIndex: "role",
      key: "role",
      align: "center",
      ellipsis: true,
      width: 150,
      render: (role: any) => (
        <div
          className="overflow-hidden truncate whitespace-nowrap"
          title={role}
        >
          {role}
        </div>
      ),
    },

    {
      title: "Action",
      dataIndex: "_id",
      key: "actions",
      align: "center",
      width: 120,
      render: (id: string, options: ITag) => (
        <div className="flex items-center gap-2">
          <Tooltip content={"Delete"} placement="bottom-end">
            <Icons.trash
              className="w-8 text-red-500 cursor-pointer"
              onClick={() => setShowTagAlert(true, id)}
            />
          </Tooltip>
          <Tooltip content={"Edit"} placement="bottom-end">
            <Link href={`/admin/users/${options.slug}/edit`}>
              <Icons.pencil className="w-8 text-stone-300" />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <MainTable
          //@ts-ignore
          columns={columns}
          emptyText={"No tags Found"}
          data={user?.docs!}
          rowKey="slug"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => " ",
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginateInfo?.totalDocs && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginateInfo?.totalDocs}
            current={paginateInfo?.pagingCounter}
            pageSize={paginateInfo?.limit}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default UserList;
