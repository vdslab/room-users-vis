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

  // Check if month is a valid value
  if (
    !(
      month === "all" ||
      month === "month" ||
      (Number(month) >= 1 && Number(month) <= 12)
    )
  ) {
    return NextResponse.json({ message: "Invalid month" }, { status: 400 });
  }

  // Check if month is "month" and assign current month
  if (month === "month") {
    month = (new Date().getMonth() + 1).toString();
  }

  if (year === "all") {
    const all_access = await prisma.access.findMany();
    if (month === "all") {
      return NextResponse.json(all_access, { status: 200 });
    } else {
      // Filtering only those all_access check_in months that match the constant month
      const access = all_access.filter(
        (access) => access.check_in.getMonth() + 1 === Number(month),
      );

      return NextResponse.json(access, { status: 200 });
    }
  }

  if (month === "all") {
    const access = await prisma.access.findMany({
      where: {
        check_in: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year}-12-31`),
        },
      },
    });

    return NextResponse.json(access, { status: 200 });
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
