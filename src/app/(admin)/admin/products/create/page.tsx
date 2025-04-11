// pages/create-product.jsx
import React from "react";
import ProductForm from "./components/ProductForm";
import FormHeader from "./components/FormHeader";
import { getCategories } from "@/lib/actions/category.action";
import { getProducts } from "@/lib/actions/product.action";

const CreateProductPage = async () => {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FormHeader title="اضافة منتج جديد" />
      <ProductForm categories={categories} />
    </div>
  );
};

export default CreateProductPage;
