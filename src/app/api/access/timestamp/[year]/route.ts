import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import dayjs from "dayjs";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { year: string } },
) {
  // Get year variable from URL
  let { year } = context.params;

  if (year === "all") {
    const access = await prisma.access.findMany();
    return NextResponse.json(access, { status: 200 });
  }

  // The value in the year variable is used to retrieve the record of the year in the Access table of the DB.
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

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}
