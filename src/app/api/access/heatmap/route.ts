export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Paris");

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const today: dayjs.Dayjs = dayjs().startOf("day");

  const accesses = await prisma.access.findMany({
    where: {
      OR: [
        {
          check_in: {
            gte: today.subtract(6, "day").toDate(),
            lt: today.toDate(),
          },
          check_out: {
            not: null,
          },
        },
        {
          check_in: {
            gte: today.toDate(),
          },
        },
      ],
    },
  });

  const heatmap: Record<string, Record<string, string[]>> = {};

  let date = today.subtract(6, "day");
  while (date.isBefore(today.add(1, "day"))) {
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
    const checkIn = dayjs(access.check_in).startOf("hour");
    const checkOut = access.check_out
      ? dayjs(access.check_out).endOf("hour")
      : dayjs().endOf("hour");
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
