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

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) return null;

    return currentUser;
  } catch (error: any) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    // Fetch all users without specifying fields (gets all by default)
    const users = await prisma.user.findMany();

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
const generateRandomPassword = (length: number = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
export const activateAccount = async (id: string, email: string) => {
  try {
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: "active",
        password: hashedPassword, // Store the hashed password
      },
    });
    await sendEmail({
      to: email,
      subject: "تفعيل حسابك",
      html: `
      <div style="direction: rtl; font-family: Arial, sans-serif;">
      <h1>مرحبًا ${updatedUser.name || "المستخدم"},</h1>
      <p>تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول باستخدام البريد الإلكتروني الخاص بك (${email}) وكلمة المرور التالية:</p>
      <p style="font-size: 18px; font-weight: bold; color: #28666E;">كلمة المرور: ${plainPassword}</p>
      <p>يرجى تغيير كلمة المرور بعد تسجيل الدخول الأول لأسباب أمنية.</p>
      <p>شكرًا لك،<br>فريق ايثاق</p>
    </div>
        `,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};
export const deactivateAccount = async (id: string, email: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        status: "inactive",
      },
    });
    await sendEmail({
      to: email, // Send to the user's email, not admin
      subject: "تعطيل حسابك بسبب التأخر في السداد",
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <h1>مرحبًا ${updatedUser.name || "العميل الموقر"},</h1>
          <p>نأسف لإبلاغك أنه تم تعطيل حسابك بسبب التأخر في سداد المستحقات المالية المترتبة عليك.</p>
          <p>يرجى تسوية المدفوعات المتأخرة في أقرب وقت ممكن لإعادة تفعيل حسابك. في حال كنت قد قمت بالدفع بالفعل، يرجى التواصل معنا لتأكيد ذلك.</p>
          <p>للتواصل أو لمزيد من التفاصيل، يمكنك مراسلتنا على: <a href="mailto:support@[اسم_النطاق].com">support@[اسم_النطاق].com</a></p>
          <p>شكرًا لتفهمك،<br>فريق ايثاق</p>
        </div>
      `,
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
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
