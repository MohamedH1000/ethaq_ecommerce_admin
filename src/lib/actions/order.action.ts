import prisma from "../prisma";

export async function getAllOrders() {
  try {
    const allOrders = await prisma.order.findMany({
      include: {
        user: true,
      },
    });
    return allOrders;
  } catch (error) {
    console.log(error);
  }
}
