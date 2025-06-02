"use server";
import prisma from "../prisma";

export async function getAllOrders() {
  try {
    const allOrders = await prisma.order.findMany({
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
  try {
    // First get the current order and user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Calculate the amount change based on status transition
    let amountChange = 0;
    const previousStatus = order.status;

    // If order is being cancelled and wasn't already cancelled
    if (status === "cancelled" && previousStatus !== "cancelled") {
      // Add the amount back to user's remaining amount
      amountChange = -order.totalAmount;
    }
    // If order is being uncancelled (status changed from cancelled to something else)
    else if (status !== "cancelled" && previousStatus === "cancelled") {
      // Subtract the amount from user's remaining amount
      amountChange = order.totalAmount;
    }

    // Update the order and user in a transaction
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status },
      }),
      ...(amountChange !== 0
        ? [
            prisma.user.update({
              where: { id: order.userId },
              data: {
                remainingAmount: {
                  increment: amountChange,
                },
              },
            }),
          ]
        : []),
    ]);

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
