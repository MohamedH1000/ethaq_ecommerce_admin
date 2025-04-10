"use server";

import email from "next-auth/providers/email";
import { sendEmail } from "../email";
import prisma from "../prisma";

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

    await sendEmail({
      to: user.email,
      subject: "تأكيد استلام دفعة جديدة",
      html: `
      <div style="direction: rtl; font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px; background-color: #000957; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; font-size: 28px; margin: 0;">تأكيد الدفعة</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <h2 style="font-size: 22px; color: #000957; margin-bottom: 15px;">مرحبًا ${
            user.name
          },</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            نشكرك على إتمام الدفعة بنجاح. تم خصم دفعة جديدة من الحساب المتبقي عليك بقيمة 
            <strong style="color: #28666E;">${paymentData.amount}
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            المبلغ المتبقي عليك الآن هو: 
            <strong style="color: #000957;">${
              user.remainingAmount || 0
            } ريال سعودي</strong>.
          </p>
          ${
            paymentData.notes
              ? `
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ملاحظات إضافية: ${paymentData.notes}
            </p>
          `
              : ""
          }
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            يمكنك زيارة موقعنا لمتابعة تفاصيل حسابك عبر الرابط التالي: 
            <a href="https://four.fortworthtowingtx.com/" style="color: #28666E; text-decoration: none; font-weight: bold;">اضغط هنا</a>.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            شكرًا لثقتكم بنا،<br>
            <strong>فريق إيثاق</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #777; border-top: 1px solid #ddd;">
          © ${new Date().getFullYear()} إيثاق. جميع الحقوق محفوظة.
        </div>
      </div>
      `,
    });
    return payment;
  });
}
