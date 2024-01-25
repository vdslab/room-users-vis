import { PrismaClient } from "@prisma/client";
import exp from "constants";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  let json;
  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "error. invalid JSON" },
      { status: 400 },
    );
  }

  if (!json) {
    return NextResponse.json(
      { message: "error. missing body" },
      { status: 400 },
    );
  }

  const { id, name, icon, color } = json;

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
  if (!id || !name) {
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
      color,
    },
  });

  // Return Success!
  return NextResponse.json({ message: "Success!" }, { status: 200 });
}

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users, { status: 200 });
}

export async function PUT(request: Request) {
  let json;
  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "error. invalid JSON" },
      { status: 400 },
    );
  }

  if (!json) {
    return NextResponse.json(
      { message: "error. missing body" },
      { status: 400 },
    );
  }

  const { id, name, icon, color } = json;

  // If any of the fields are empty, return error
  if (!id) {
    return NextResponse.json(
      { message: "error. missing field id" },
      { status: 400 },
    );
  }

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

  // If any of the fields are empty, return error
  if (!name && !icon && !color) {
    return NextResponse.json(
      { message: "error. missing fields" },
      { status: 400 },
    );
  }

  // If user exists, update user

  // Update user
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: name || user.name,
      icon: icon || user.icon,
      color: color || user.color,
    },
  });

  // Return Success!
  return NextResponse.json({ message: "Success!" }, { status: 200 });
}
