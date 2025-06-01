"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendEmail } from "../email";

export async function getSession() {
  return await getServerSession(authOptions as any);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.name) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        name: session.user.name as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error: any) {
    return null;
  }
}
export async function getUserById(id: String) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.isAdmin) {
    throw new Error("you aren't authorized to fetch the user data");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        orders: {
          include: {
            user: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        payments: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllUsers() {
  try {
    // Fetch all users without specifying fields (gets all by default)
    const users = await prisma.user.findMany({
      orderBy: {
        registrationDate: "asc",
      },
    });

    // Map over the users and exclude hashedPassword while formatting dates
    const formattedUsers = users.map(({ password, ...user }) => ({
      ...user,
      lastLoginDate: user?.lastLoginDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return formattedUsers;
  } catch (error) {
    console.log(error);
    return []; // Optional: return empty array on error for better error handling
  }
}
// Adjust import path for your email utility

// Function to generate random password
const generateRandomPassword = (length: number = 10): string => {
  // Character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  // Ensure we have at least one of each required character type
  const passwordParts = [
    uppercase.charAt(Math.floor(Math.random() * uppercase.length)),
    lowercase.charAt(Math.floor(Math.random() * lowercase.length)),
    numbers.charAt(Math.floor(Math.random() * numbers.length)),
    symbols.charAt(Math.floor(Math.random() * symbols.length)),
  ];

  // Combine all characters for the remaining length
  const allChars = uppercase + lowercase + numbers + symbols;
  const remainingLength = length - passwordParts.length;

  for (let i = 0; i < remainingLength; i++) {
    passwordParts.push(
      allChars.charAt(Math.floor(Math.random() * allChars.length))
    );
  }

  // Shuffle the array to avoid predictable patterns
  const shuffledPassword = passwordParts
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
};

// Activate Account Function
export const activateAccount = async (id: string, email: string) => {
  try {
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    let updatedUser;
    if (!user?.password) {
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          status: "active",
          password: hashedPassword,
        },
      });
    } else {
      updatedUser = await prisma.user.update({
        where: { id },
        data: {
          status: "active",
        },
      });
    }

    const activationEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #2c7a7b;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
            color: #333;
            line-height: 1.6;
          }
          .password-box {
            background-color: #f0f7f7;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 20px 0;
            direction: ltr;
            border: 1px solid #2c7a7b;
          }
          .password {
            color: #2c7a7b;
            font-size: 20px;
            font-weight: bold;
            word-break: break-all;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2c7a7b;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #236e6f;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          a {
            color: #2c7a7b;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
            }
            .content {
              padding: 20px;
            }
            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>تهانينا! تم تفعيل حسابك</h1>
          </div>
          <div class="content">
            <h2>مرحبًا ${updatedUser.name || "المستخدم"},</h2>
            <p>يسعدنا إبلاغك بأن حسابك قد تم تفعيله بنجاح. يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني (<strong>${email}</strong>) وكلمة المرور التالية:</p>
            <div class="password-box">
              <span class="password">${plainPassword}</span>
            </div>
            <p><strong>ملاحظة مهمة:</strong> نوصي بتغيير كلمة المرور بعد تسجيل الدخول الأول لضمان أمان حسابك.</p>
            <p>ابدأ تجربتك الآن بالضغط على الزر أدناه:</p>
            <a href="https://four.fortworthtowingtx.com/" class="button">تسجيل الدخول الآن</a>
          </div>
          <div class="footer">
            <p>شكرًا لانضمامك إلينا،<br>فريق إيثاق</p>
            <p>لأي استفسارات، تواصلوا معنا على: <a href="mailto:support@four.fortworthtowingtx.com">support@four.fortworthtowingtx.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "تفعيل حسابك - إيثاق",
      html: activationEmailTemplate,
    });
    //   const whatsappMessage = `🎉 *تهانينا! تم تفعيل حسابك بنجاح* 🎉

    //   ✨ مرحبًا ${updatedUser.name || "عزيزي العميل"}،

    //   ╭─────────────────╮
    //     حسابك جاهز الآن للاستخدام!
    //   ╰─────────────────╯

    //   🌐 ابدأ رحلتك معنا الآن:
    //   ${"https://four.fortworthtowingtx.com/"}

    //   ╭─────────────────╮
    //     فريق *إيثاق* يرحب بك!
    //   ╰─────────────────╯

    //   📅 ${new Date().toISOString().split("T")[0]}
    //  `;

    //   await sendWhatsAppMessage({
    //     to: phone,
    //     message: whatsappMessage,
    //   });
    return updatedUser;
  } catch (error) {
    console.error("Error in activateAccount:", error);
    throw new Error("فشل في تفعيل الحساب");
  }
};

// Deactivate Account Function
export const deactivateAccount = async (id: string, email: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: "inactive" },
    });
    // console.log("phone", phone);
    const deactivationEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #b91c1c;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
            color: #333;
            line-height: 1.6;
          }
          .alert-box {
            background-color: #fef2f2;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #b91c1c;
            color: #7f1d1d;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #b91c1c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #991b1b;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          a {
            color: #b91c1c;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
            }
            .content {
              padding: 20px;
            }
            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>إشعار تعطيل الحساب</h1>
          </div>
          <div class="content">
            <h2>مرحبًا ${updatedUser.name || "العميل الموقر"},</h2>
            <p>نأسف لإبلاغك أن حسابك قد تم تعطيله مؤقتًا بسبب التأخر في سداد المستحقات المالية.</p>
            <div class="alert-box">
              <p>يرجى تسوية جميع المدفوعات المتأخرة في أقرب وقت ممكن لإعادة تفعيل حسابك.</p>
            </div>
            <p>في حال كنت قد قمت بالسداد بالفعل، يرجى التواصل مع فريق الدعم لتأكيد الدفع واستعادة الوصول إلى حسابك.</p>
            <a href="mailto:support@four.fortworthtowingtx.com" class="button">تواصل مع الدعم</a>
          </div>
          <div class="footer">
            <p>شكرًا لتفهمك،<br>فريق إيثاق</p>
            <p>لأي استفسارات، يرجى مراسلتنا على: <a href="mailto:support@four.fortworthtowingtx.com">support@four.fortworthtowingtx.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "تعطيل حسابك - إيثاق",
      html: deactivationEmailTemplate,
    });
    // const whatsappMessage = `⚠️ *إشعار تعطيل الحساب* ⚠️

    // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    // عزيزنا ${updatedUser.name || "العميل الموقر"}،
    // نأسف لإبلاغك بتعطيل حسابك مؤقتًا
    // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

    // 📛 *السبب:*
    // تأخر في سداد المستحقات المالية

    // 🛠 *خطوات إعادة التفعيل:*
    // 1️⃣ سداد المبلغ المطلوب
    // 2️⃣ إرسال إشعار الدفع
    // 3️⃣ التواصل مع الدعم الفني

    // 📧 *قنوات التواصل:*
    // ✉️ ethaq0@gmail.com
    // 📞 00966559681110 (9ص-5م)

    // 🔄 إذا كنت قد سددت بالفعل:
    // يرجى إرفاق إثبات الدفع وإرساله عبر الواتساب

    // ⏳ مدة الاستجابة: 24-48 ساعة عمل

    // مع اعتذارنا للإزعاج،
    // فريق *إيثاق*
    // ${new Date().toISOString().split("T")[0]}`;

    // await sendWhatsAppMessage({
    //   to: phone,
    //   message: whatsappMessage,
    // });
    return updatedUser;
  } catch (error) {
    console.error("Error in deactivateAccount:", error);
    throw new Error("فشل في تعطيل الحساب");
  }
};

// export async function createUser(userData: any) {
//   try {
//     const {
//       name,
//       birthDate,
//       nationalNumber,
//       nationality,
//       specialization,
//       universityNo,
//       password,
//     } = userData;
//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         uniNumber: universityNo,
//         birthDate,
//         nationalNumber,
//         nationality,
//         specialization,
//         hashedPassword,
//       },
//     });

//     return user;
//   } catch (e: any) {
//     throw new Error(e);
//   }
// }
