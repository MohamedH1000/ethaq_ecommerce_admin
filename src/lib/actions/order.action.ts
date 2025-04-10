"use server";
import prisma from "../prisma";

export async function getAllOrders() {
  try {
    const allOrders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        orderDate: "desc",
      },
    });
    return allOrders;
  } catch (error) {
    console.log(error);
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });
    return order;
  } catch (error) {
    console.log(error);
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  // console.log(orderId, status, "order and status");
  try {
    const response = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    console.log(response, "response");
    return response;
  } catch (error) {
    console.log(error);
  }
}
