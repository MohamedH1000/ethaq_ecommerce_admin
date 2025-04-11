"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { getCurrentUser } from "./user.action";

export async function createCategory(data: unknown) {
  //@ts-ignore
  const { name, images } = data;
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("You are not authorized to create the category");
  }
  try {
    const response = await prisma.category.create({
      data: {
        name,
        images,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
  }
}
export async function editCategory(id: string, data: unknown) {
  //@ts-ignore
  const { name, images } = data;
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("You are not authorized to create the category");
  }
  try {
    const response = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        images,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteCategory(categoryId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.isAdmin) {
    throw new Error("غير مصرح لك بحذف الفئات");
  }

  try {
    // Check if category has products

    await prisma.category.delete({
      where: { id: categoryId },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error instanceof Error ? error : new Error("فشل في حذف الفئة");
  }
}
