"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { toast } from "sonner";
import { Loader } from "lucide-react";

// Define the expected shape of a Category

const ProductForm = ({ product, categories }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    images: product.images || ([] as string[]),
    categoryId: product.category.id || "", // Added categoryId field
    active: product.active || true,
    discount: product.active || "",
  });

  // console.log("product data", productData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...productData,
      price: parseFloat(productData.price),
    };
    // console.log("Product data submitted:", formattedData);
    setIsLoading(true);
    try {
      const response = await updateProduct(product.id, formattedData);

      if (!response?.success) {
        toast.error("حصل خطا اثناء تعديل المنتج");
      } else {
        toast.success("تم تعديل المنتج بنجاح");
        setProductData({
          name: "",
          description: "",
          price: "",
          images: [] as string[],
          categoryId: "", // Added categoryId field
          discount: "",
          active: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // Add your API call here
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (images: string[]) => {
    setProductData((prev) => ({ ...prev, images }));
  };

  const removeImage = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-[700px] max-md:w-auto"
    >
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          اسم المنتج
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="ادخل اسم المنتج"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          الوصف
        </label>
        <textarea
          id="description"
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="ادخل وصف المنتج"
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          السعر
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="discount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          نسبة الخصم (اختياري)
        </label>
        <input
          type="number"
          id="discount"
          name="discount"
          value={productData.discount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          الفئة
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={productData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">اختر فئة</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          صور المنتج
        </label>
        <ImageUpload value={productData.images} onChange={handleImageChange} />
        <div className="mt-4 flex flex-wrap gap-4">
          {productData.images.map((imageUrl, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={imageUrl}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="active"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          الحالة
        </label>
        <select
          id="active"
          name="active"
          value={productData.active.toString()}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">نشط</option>
          <option value="false">غير نشط</option>
        </select>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="w-full text-white py-2 px-4 rounded-md transition-colors duration-300"
      >
        {isLoading ? <Loader className="animate-spin" /> : "تعديل المنتج"}
      </Button>
    </form>
  );
};

export default ProductForm;
