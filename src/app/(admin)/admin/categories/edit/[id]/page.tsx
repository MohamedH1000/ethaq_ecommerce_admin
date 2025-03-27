import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/common/shared/page-header";
import CategoryForm from "@/components/forms/CategoryForm";
import { Shell } from "@/components/shells/shell";
import { getCategoryById } from "@/lib/actions/category.action";
import React from "react";

const page = async ({ params }: { params: any }) => {
  const { id } = params;
  const category = await getCategoryById(id);
  return (
    <Shell variant={"sidebar"}>
      <PageHeader>
        <PageHeaderHeading
          id="create-category-header"
          aria-labelledby="category-header-heading"
        >
          تعديل الفئة
        </PageHeaderHeading>
        <PageHeaderDescription>تعديل الفئة</PageHeaderDescription>
      </PageHeader>

      <section className="w-full ">
        <CategoryForm type="edit" category={category} />
      </section>
    </Shell>
  );
};

export default page;
