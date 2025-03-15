"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(authOptions);
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
