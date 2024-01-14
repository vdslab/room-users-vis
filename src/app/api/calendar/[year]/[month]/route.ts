import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { year: number; month: number } },
) {
  // Get year variable from URL
  let { year, month } = context.params;

  // If month is not greater than 1 and not less than 12 .
  if (!(month >= 1 && month <= 12)) {
    return NextResponse.json({ message: "Invalid month" }, { status: 400 });
  }

  // Get Access data from the database
  // Filtering only those all_access check_in months that match the constant month
  const access = await prisma.access.findMany({
    where: {
      check_in: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  // Creates a list of users contained in otherUserData without duplicates and makes it the key of the object. The values are taken as arrays from, and the arrays are of type string.
  const users: { [key: string]: string[] } = {};
  for (const user of access) {
    if (!users[user.user_id]) {
      users[user.user_id] = [];
    }
    // The array should contain the date of check_in in the format "yyyy-mm-dd" without duplicates.
    const date = `${user.check_in.getFullYear()}-${String(
      user.check_in.getMonth() + 1,
    ).padStart(2, "0")}-${String(user.check_in.getDate()).padStart(2, "0")}`;
    if (!users[user.user_id].includes(date)) {
      users[user.user_id].push(date);
    }
  }

  // Return Success!
  return NextResponse.json(users, { status: 200 });
}
