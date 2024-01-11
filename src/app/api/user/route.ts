import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // id: int
  // name: string
  const { id, name, icon } = await request.json();

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  // If user exists, return error
  if (user) {
    return NextResponse.json(
      { message: "error. user already exists" },
      { status: 400 },
    );
  }

  // If any of the fields are empty, return error
  if (!id || !name || !icon) {
    return NextResponse.json(
      { message: "error. missing fields" },
      { status: 400 },
    );
  }

  // If user does not exist, create user

  // Create user
  await prisma.user.create({
    data: {
      id,
      name,
      icon,
    },
  });

  // Return success
  return NextResponse.json({ message: "success" }, { status: 200 });
}
