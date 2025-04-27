// app/api/products/route.ts (or your API route)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const nameFilter = searchParams.get("name") || "";

  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: {
          contains: nameFilter,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
      },
    });

    const total = await prisma.product.count({
      where: {
        name: {
          contains: nameFilter,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json({
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "حصل خطأ اثناء جلب المنتجات" },
      { status: 500 }
    );
  }
}
