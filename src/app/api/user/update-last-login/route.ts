import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import based on your Prisma setup
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function POST(request: NextRequest) {
  try {
    // Get the session to ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Get email from request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    // Update user's lastLoginDate
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        lastLoginDate: new Date(),
      },
    });

    return NextResponse.json(
      { message: "تم تحديث تاريخ آخر تسجيل دخول", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating last login:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث تاريخ آخر تسجيل دخول" },
      { status: 500 }
    );
  }
}
