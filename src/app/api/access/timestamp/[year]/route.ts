import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { year: string } },
) {
  // Get year variable from URL
  let { year } = context.params;

  // Check if year is "year" and assign current year
  if (year === "year") {
    year = new Date().getFullYear().toString();
  }

  if (year === "all") {
    const access = await prisma.access.findMany();
    return NextResponse.json(access, { status: 200 });
  }

  // The value in the year variable is used to retrieve the record of the year in the Access table of the DB.
  const access = await prisma.access.findMany({
    where: {
      check_in: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
  });

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}
