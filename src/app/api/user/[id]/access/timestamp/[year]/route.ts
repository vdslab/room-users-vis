import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string; year: string } },
) {
  // Get year variable from URL
  let { id, year } = context.params;

  // Check if year is "year" and assign current year
  if (year === "year") {
    year = new Date().getFullYear().toString();
  }

  if (year === "all") {
    const access = await prisma.access.findMany({
      where: {
        user_id: id,
      },
    });
    return NextResponse.json(access, { status: 200 });
  }

  // The value in the year variable is used to retrieve the record of the year in the Access table of the DB.
  const access = await prisma.access.findMany({
    where: {
      user_id: id,
      check_in: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
  });

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}
