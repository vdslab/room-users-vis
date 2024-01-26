import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { year: string; month: string } },
) {
  // Get year variable from URL
  let { year, month } = context.params;

  const date = dayjs();

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

  if (year === "all") {
    const all_access = await prisma.access.findMany();
    if (month === "all") {
      return NextResponse.json(all_access, { status: 200 });
    } else {
      // Filtering only those all_access check_in months that match the constant month
      const access = all_access.filter(
        (access) => dayjs(access.check_in).month() + 1 === Number(month),
      );

      return NextResponse.json(access, { status: 200 });
    }
  }

  // Check if year is a valid value
  if (!(year === "year" || Number(year) <= date.year())) {
    return NextResponse.json({ message: "Invalid year" }, { status: 400 });
  }
  date.set("year", Number(year));

  // If month is "all", return all records of the year
  if (month === "all") {
    const access = await prisma.access.findMany({
      where: {
        check_in: {
          gte: dayjs(year === "year" ? undefined : year)
            .startOf("year")
            .toDate(),
          lt: dayjs(year === "year" ? undefined : year)
            .endOf("year")
            .toDate(),
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
