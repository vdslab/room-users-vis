import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { year: string; month: string } },
) {
  // Get year variable from URL
  let { year, month } = context.params;

  // Check if year is "year" and assign current year
  if (year === "year") {
    year = new Date().getFullYear().toString();
  }

  // Check if month is "month" and assign current month
  if (month === "month") {
    month = (new Date().getMonth() + 1).toString();
  }

  // The values in the year and month variables are used to retrieve the year records in the Access table of the DB.
  const access = await prisma.access.findMany({
    where: {
      check_in: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${month}-31`),
      },
    },
  });

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}
