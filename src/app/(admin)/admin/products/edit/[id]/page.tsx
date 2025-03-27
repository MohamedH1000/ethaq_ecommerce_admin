import { getProductById } from "@/lib/actions/product.action";
import React from "react";
import FormHeader from "../../create/components/FormHeader";
import ProductForm from "./components/ProductForm";
import { getCategories } from "@/lib/actions/category.action";

const page = async ({ params }: { params: string }) => {
  const { id } = params;
  const product = await getProductById(id);
  const categories = await getCategories();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FormHeader title="تعديل المنتج" />
      <ProductForm product={product} categories={categories} />
    </div>
  );
};

export default page;
