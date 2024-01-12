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

  // If user exists, return user
  return NextResponse.json(user, { status: 200 });
}
