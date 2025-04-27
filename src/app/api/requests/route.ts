// app/api/products/route.ts (or your API route)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const statusFilter = searchParams.get("status") || "";

  try {
    const requests = await prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        status: {
          contains: statusFilter,
          mode: "insensitive",
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
        user: true,
        address: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    const total = await prisma.order.count({
      where: {
        status: {
          contains: statusFilter,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json({
      data: requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "حصل خطأ اثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}
