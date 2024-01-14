import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const { id } = context.params;
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  // If user does not exist, return error
  if (!user) {
    return NextResponse.json(
      { message: "error. user does not exist" },
      { status: 400 },
    );
  }

  // Put the date 30 days ago into the variable gte.
  const gte = new Date();
  gte.setDate(gte.getDate() - 30);
  console.log(gte);

  // Retrieve the past month's data from an Access table.
  // Get the person whose user_id matches the id
  const userData = await prisma.access.findMany({
    where: {
      user_id: id,
      check_in: {
        gte,
      },
    },
  });

  // Retrieve records for people other than id
  const otherUserData = await prisma.access.findMany({
    where: {
      user_id: {
        not: id,
      },
      check_in: {
        gte,
      },
    },
  });

  // Create a list of users contained in otherUserData without duplication and make it the key of the object. The value is initially 0.
  const otherUsers: { [key: string]: number } = {};
  for (const user of otherUserData) {
    otherUsers[user.user_id] = 0;
  }

  // Calculate the time spent from check_in and check_out of userData and check_in and check_out of otherUserData, and rewrite the value of otherUsers.
  for (const user of userData) {
    // If check_out is NULL, nothing to do.
    if (!user.check_out) {
      continue;
    }
    for (const others of otherUserData) {
      // If check_out is NULL, nothing to do.
      if (!others.check_out) {
        continue;
      }

      // after the user checks in, the other checks in, and If the user checks out after the other checks out, the time between the other's check in and check out is added to otherUsers.
      if (
        user.check_in < others.check_in &&
        user.check_out > others.check_out
      ) {
        otherUsers[others.user_id] +=
          others.check_out.getTime() - others.check_in.getTime();
      } else if (
        // after the user checks in, the other checks in, and If the user checks out before the other checks out, the time between the other's check in and the user's check out is added to otherUsers.
        user.check_in < others.check_in &&
        user.check_out < others.check_out &&
        user.check_out > others.check_in
      ) {
        otherUsers[others.user_id] +=
          user.check_out.getTime() - others.check_in.getTime();
      } else if (
        // after the other checks in, the user checks in, and If the user checks out after the other checks out, the time between the user's check in and the other's check out is added to otherUsers.
        user.check_in > others.check_in &&
        user.check_out > others.check_out &&
        user.check_in < others.check_out
      ) {
        otherUsers[others.user_id] +=
          others.check_out.getTime() - user.check_in.getTime();
      } else if (
        // after the other checks in, the user checks in, and If the user checks out before the other checks out, the time between the user's check in and check out is added to otherUsers.
        user.check_in > others.check_in &&
        user.check_out < others.check_out
      ) {
        otherUsers[others.user_id] +=
          user.check_out.getTime() - user.check_in.getTime();
      }
    }
  }

  // Convert the object to an array and sort it in descending order.

  const spendTime = Object.entries(otherUsers)
    .filter(([, value]) => value !== 0)
    .sort(([, a], [, b]) => b - a);

  // Return Success!
  return NextResponse.json(spendTime, { status: 200 });
}
