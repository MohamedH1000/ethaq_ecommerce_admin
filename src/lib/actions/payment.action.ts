"use server";

import prisma from "../prisma";
import { sendWhatsAppMessage } from "../whatsapp/whatsapp-service";

export async function createPayment(paymentData: {
  amount: number;
  paymentMethod: string;
  notes?: string;
  userId: string;
  recordedBy: string;
}) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the payment record
    const payment = await tx.payment.create({
      data: {
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes,
        userId: paymentData.userId,
        recordedBy: paymentData.recordedBy,
      },
    });
    // console.log("amount", payment.amount);
    // 2. Update the order's payment status
    const user = await tx.user.update({
      where: { id: paymentData.userId },
      data: {
        paidAmount: {
          increment: paymentData.amount,
        },
        remainingAmount: {
          decrement: paymentData.amount,
        },
      },
    });
    // console.log("user", user);
    await sendWhatsAppMessage({
      to: user.phone, // Make sure you have the user's WhatsApp number
      message: `
    📌 *تأكيد استلام دفعة جديدة*  
    
    مرحبًا ${user.name},  
    
    شكرًا لإتمام الدفعة بنجاح ✅  
    ▫️ *المبلغ المدفوع:* ${paymentData.amount.toFixed(2)} ريال  
    ▫️ *المبلغ المتبقي:* ${user.remainingAmount.toFixed(2) || 0} ريال  
    
    للمزيد من التفاصيل أو الاستفسار:  
    🔗 https://four.fortworthtowingtx.com/  
    
    مع خالص الشكر،  
    *فريق إيثاق*  
    
    ${new Date().getFullYear()}
    `.trim(),
    });

    return payment;
  });
}
