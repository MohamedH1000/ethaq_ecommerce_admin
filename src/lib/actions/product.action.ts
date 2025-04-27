"use server";
import prisma from "../prisma";
import { getCurrentUser } from "./user.action";

export async function createProduct(productData: any) {
  const { name, description, price, images, categoryId, active, discount } =
    productData;
  try {
    const response = await prisma.product.create({
      data: {
        name,
        description,
        price,
        images,
        discount,
        categoryId,
        active,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
  }
}
export async function updateProduct(id: string, productData: any) {
  const { name, description, price, images, categoryId, active, discount } =
    productData;

  const floatDiscount = parseFloat(discount);
  try {
    const response = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        images,
        categoryId,
        active,
        discount: floatDiscount,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
  }
}

export async function getProducts() {
  try {
    const response = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function activateProduct(productId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("غير مصرح لك بتفعيل المنتجات");
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { active: true },
    });
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error activating product:", error);
    throw new Error("فشل في تفعيل المنتج");
  }
}

// Deactivate a product
export async function deactivateProduct(productId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("غير مصرح لك بتعطيل المنتجات");
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { active: false },
    });
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error deactivating product:", error);
    throw new Error("فشل في تعطيل المنتج");
  }
}

// Delete a product
export async function deleteProduct(productId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("غير مصرح لك بحذف المنتجات");
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("فشل في حذف المنتج");
  }
}
