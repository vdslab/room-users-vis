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
  if (context.params.month < 1 || context.params.month > 12) {
    return NextResponse.json({ message: "Invalid month" }, { status: 400 });
  }
  if (context.params.day < 1 || context.params.day > 31) {
    return NextResponse.json({ message: "Invalid day" }, { status: 400 });
  }

  const selected_date: dayjs.Dayjs = dayjs
    .tz(
      `${context.params.year}-${context.params.month}-${context.params.day}`,
      "Asia/Tokyo",
    )
    .startOf("day");

  const accesses = await prisma.access.findMany({
    where: {
      OR: [
        {
          check_in: {
            gte: selected_date.subtract(6, "day").toDate(),
            lt: selected_date.toDate(),
          },
          check_out: {
            not: null,
          },
        },
        {
          check_in: {
            gte: selected_date.toDate(),
          },
        },
      ],
    },
  });

  const heatmap: Record<string, Record<string, string[]>> = {};

  let date = selected_date.subtract(6, "day");
  while (date.isBefore(selected_date.add(1, "day"))) {
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
      ? dayjs(access.check_out).tz()
      : dayjs().tz().endOf("hour");
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
