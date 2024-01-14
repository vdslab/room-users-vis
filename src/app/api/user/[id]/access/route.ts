import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  // If user does not exist, return error
  if (!user) {
    return NextResponse.json(
      { message: "error. user does not exist" },
      { status: 400 },
    );
  }

  // If user exists, return user's access records
  const access = await prisma.access.findMany({
    where: {
      user_id: id,
    },
  });

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}
