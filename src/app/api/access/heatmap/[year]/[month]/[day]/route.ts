export const dynamic = "force-dynamic";
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
  context: { params: { year: number; month: number; day: number } },
) {
  // Get year variable from URL
  const year = context.params.year;

  // Get month variable from URL
  const month = context.params.month;

  // Get day variable from URL
  const day = context.params.day;

  // Check if month is a valid value
  if (!(month >= 1 && month <= 12)) {
    return NextResponse.json({ message: "Invalid month" }, { status: 400 });
  }

  // Check if day is a valid value
  if (!(day >= 1 && day <= 31)) {
    return NextResponse.json({ message: "Invalid day" }, { status: 400 });
  }

  const select_date: dayjs.Dayjs = dayjs
    .tz(`${year}/${month}/${day}`)
    .startOf("day");

  const accesses = await prisma.access.findMany({
    where: {
      OR: [
        {
          check_in: {
            gte: select_date.subtract(6, "day").toDate(),
            lt: select_date.toDate(),
          },
          check_out: {
            not: null,
          },
        },
        {
          check_in: {
            gte: select_date.toDate(),
          },
        },
      ],
    },
  });

  const heatmap: Record<string, Record<string, string[]>> = {};

  let date = select_date.subtract(6, "day");
  while (date.isBefore(select_date.add(1, "day"))) {
    const dateStr = date.format("YYYY-MM-DD");
    heatmap[dateStr] = {};
    let hour = 0;
    while (hour < 24) {
      const hourStr = hour.toString().padStart(2, "0") + ":00";
      heatmap[dateStr][hourStr] = [];
      hour++;
    }
    date = date.add(1, "day");
  }

  for (const access of accesses) {
    const id = access.user_id;
    const checkIn = dayjs(access.check_in).tz().startOf("hour");
    const checkOut = access.check_out
      ? dayjs(access.check_out).endOf("hour").tz()
      : dayjs().endOf("hour").tz();
    if (!checkIn.isSame(checkOut, "day")) {
      continue;
    }
    let date = checkIn;

    while (date.isBefore(checkOut)) {
      const dateStr = date.format("YYYY-MM-DD");
      const hourStr = date.format("HH:00");
      if (!heatmap[dateStr]) {
        heatmap[dateStr] = {};
      }
      if (!heatmap[dateStr][hourStr]) {
        heatmap[dateStr][hourStr] = [];
      }
      if (!heatmap[dateStr][hourStr].includes(id)) {
        heatmap[dateStr][hourStr].push(id);
      }
      date = date.add(1, "hour");
    }
  }

  // Return Success!
  // return NextResponse.json(accesses, { status: 200 });
  return NextResponse.json(heatmap, { status: 200 });
  // return NextResponse.json({ message: "Success!" }, { status: 200 });
}
