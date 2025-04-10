"use client";
import TypeFilter from "@/components/category/type-filter";
import {
  PageHeader,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import SortForm from "@/components/common/sort-form";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { SortOrder } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CategoryTable } from "./component/table/category-table";
import { columns } from "./component/table/columns";
import axios from "axios";
import { getCategories } from "@/lib/actions/category.action";

const CategoriesPage = () => {
  const [visible, setVisible] = useState(false);
  const [data, setDate] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: unknown = await getCategories();
        setDate(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Shell variant={"sidebar"}>
      <Card className="flex flex-col mb-8 p-6 w-full">
        <PageHeader className="flex  gap-4 items-center justify-between w-full">
          <PageHeaderHeading>الفئات</PageHeaderHeading>
          {/* <Search onSearch={handleSearch} placeholder="Search By Name" /> */}
          <Button className="w-[200px] px-0" size={"default"}>
            <Link
              href={"/admin/categories/create"}
              className="flex items-center gap-1"
            >
              <Icons.plus className="w-5 h-5" />
              <span className="hidden md:block">اضافة فئة</span>
              <span className="md:hidden">اضافة</span>
            </Link>
          </Button>

          {/* <button
              className="text-primary text-base font-semibold flex items-center md:ms-5 mt-5 md:mt-0"
              onClick={toggleVisible}
            >
              تصفية
              {visible ? (
                <Icons.arrowUp className="ms-2" />
              ) : (
                <Icons.arrowDown className="ms-2" />
              )}
            </button> */}
        </PageHeader>
        <div
          className={cn("w-full flex transition", {
            "h-auto visible": visible,
            "h-0 invisible": !visible,
          })}
        >
          <div className="flex flex-col md:flex-row md:items-center mt-5 md:mt-8 border-t border-gray-200 pt-5 md:pt-8 w-full">
            <TypeFilter
              className="w-full md:w-1/2 md:mr-5"
              onTypeFilter={({ _id }: { _id: string }) => {
                setType(_id);
              }}
            />
            <SortForm
              className="w-full md:w-1/2 mt-5 md:mt-0"
              onSortChange={({ value }: { value: SortOrder }) => {
                setColumn(value);
              }}
              onOrderChange={({ value }: { value: string }) => {
                setOrder(value);
              }}
              options={[
                { id: 1, value: "name", label: "Name" },
                { id: 2, value: "createdAt", label: "Created At" },
                { id: 3, value: "updatedAt", label: "Updated At" },
              ]}
            />
          </div>
        </div>
      </Card>
      <CategoryTable columns={columns} data={data} />
    </Shell>
  );
};

export default CategoriesPage;
