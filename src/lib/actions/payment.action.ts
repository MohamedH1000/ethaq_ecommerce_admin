"use server";

import { sendEmail } from "../email";
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
    const activationEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الدفعة</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
            body {
                font-family: 'Tajawal', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f7fa;
            }
            .email-container {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                overflow: hidden;
            }
            .header {
                background-color: #4f46e5;
                color: white;
                padding: 20px;
                text-align: center;
                border-top-right-radius: 8px;
                border-top-left-radius: 8px;
            }
            .content {
                padding: 25px;
            }
            .payment-details {
                background-color: #f8fafc;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                border-right: 4px solid #4f46e5;
            }
            .payment-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .payment-label {
                font-weight: 700;
                color: #4f46e5;
            }
            .payment-value {
                font-weight: 500;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
            }
            .logo {
                font-weight: 700;
                color: #4f46e5;
                font-size: 18px;
                margin-bottom: 10px;
            }
            a {
                color: #4f46e5;
                text-decoration: none;
                font-weight: 500;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>تأكيد استلام دفعة جديدة</h1>
            </div>
            
            <div class="content">
                <p>مرحبًا ${user?.name},</p>
                
                <p>شكرًا لإتمام الدفعة بنجاح ✅</p>
                
                <div class="payment-details">
                    <div class="payment-item">
                        <span class="payment-label">المبلغ المدفوع:</span>
                        <span class="payment-value">${paymentData.amount.toFixed(
                          2
                        )} ريال سعودي</span>
                    </div>
                    <div class="payment-item">
                        <span class="payment-label">المبلغ المتبقي:</span>
                        <span class="payment-value">${user?.remainingAmount.toFixed(
                          2
                        )} ريال سعودي</span>
                    </div>
                </div>
                
                <p>للمزيد من التفاصيل أو الاستفسار:</p>
                <p>
                    <a href="https://ethaq.store//">
                        🔗 https://ethaq.store/
                    </a>
                </p>
            </div>
            
            <div class="footer">
                <div class="logo">فريق إيثاق</div>
                <p>مع خالص الشكر والتقدير</p>
                <p>© ${new Date().getFullYear()} - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </body>
    </html>`;
    await sendEmail({
      to: user?.email,
      subject: "تأكيد استلام دفعة جديدة",
      html: activationEmailTemplate,
    });
    // await sendWhatsAppMessage({
    //   to: user.phone, // Make sure you have the user's WhatsApp number
    //   message: `
    // 📌 *تأكيد استلام دفعة جديدة*

    // مرحبًا ${user.name},

    // شكرًا لإتمام الدفعة بنجاح ✅
    // ▫️ *المبلغ المدفوع:* ${paymentData.amount.toFixed(2)} ريال
    // ▫️ *المبلغ المتبقي:* ${user.remainingAmount.toFixed(2) || 0} ريال

    // للمزيد من التفاصيل أو الاستفسار:
    // 🔗 https://four.fortworthtowingtx.com/

    // مع خالص الشكر،
    // *فريق إيثاق*

    // ${new Date().getFullYear()}
    // `.trim(),
    // });

    return payment;
  });
}
