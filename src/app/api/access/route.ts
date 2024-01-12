import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { getStudentID } from "@/utils/StudentID";

const prisma = new PrismaClient();

const ERROR_MESSAGES = {
  INVALID_JSON: "error. invalid JSON",
  MISSING_BODY: "error. missing body",
  MISSING_FIELDS: "error. missing fields",
  INVALID_FORMAT: "error. invalid format.",
};

export async function POST(request: Request) {
  let json;
  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.INVALID_JSON },
      { status: 400 },
    );
  }

  if (!json) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.MISSING_BODY },
      { status: 400 },
    );
  }

  const {
    input,
    check_in,
    check_out,
  }: { input: string; check_in: string; check_out: string } = json;
  if (!input) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.MISSING_FIELDS },
      { status: 400 },
    );
  }

  const user_id = getStudentID(input);
  if (!user_id) {
    return NextResponse.json(
      { message: ERROR_MESSAGES.INVALID_FORMAT },
      { status: 400 },
    );
  }

  const warnings = [];

  // if user does not exist
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  // If user does not exist, create user
  if (!user) {
    await prisma.user.create({
      data: {
        id: user_id,
      },
    });
    warnings.push(
      "Your account did not exist. Account has been created. Please register your name.",
    );
  } else {
    // If user exists, check if user has name
    if (!user.name) {
      warnings.push(
        "Your name is not yet registered in your account. Please register your name.",
      );
    }
    if (!user.icon) {
      warnings.push(
        "Your icon is not yet registered in your account. Please register your icon URL.",
      );
    }
  }

  // check if user Checked in
  const accessed = await prisma.access.findFirst({
    where: {
      user_id,
      check_out: null,
    },
  });

  // If the user has already checked in, check out.
  if (accessed) {
    // If the check-in is not today, delete the column.
    if (accessed.check_in.getDate() == new Date().getDate()) {
      await prisma.access.update({
        where: {
          user_id_check_in: {
            user_id: accessed.user_id,
            check_in: accessed.check_in,
          },
        },
        data: {
          check_out: new Date(),
        },
      });

      // Create message
      const message = createMessage(warnings);

      return NextResponse.json({ message }, { status: 200 });
    } else {
      // If the check-in is not today, set the check-out for that record to 10 minutes after the check-in.
      await prisma.access.update({
        where: {
          user_id_check_in: {
            user_id: accessed.user_id,
            check_in: accessed.check_in,
          },
        },
        data: {
          check_out: new Date(accessed.check_in.getTime() + 10 * 60000),
        },
      });
      warnings.push(
        "You forgot to check out before yesterday. The record was automatically checked out.",
      );
    }
  }
  const access = await prisma.access.create({
    data: {
      user_id,
      check_in: new Date(),
      check_out: null,
    },
  });

  // Create message
  const message = createMessage(warnings);
  return NextResponse.json({ message }, { status: 200 });
}

export async function GET(request: Request) {
  // Retrieves information about who is currently in the room.
  // In other words, it acquires access information that has been checked in but not yet checked out.

  const access_db = await prisma.access.findMany({
    where: {
      check_out: null,
    },
  });

  // Returns check_out items excluded.
  const access = access_db.map((item) => {
    return {
      user_id: item.user_id,
      check_in: item.check_in,
    };
  });

  // Return Success!
  return NextResponse.json(access, { status: 200 });
}

function createMessage(warnings: string[]) {
  let message = "";
  if (warnings.length > 0) {
    message = "Warning!\n" + warnings.join("\n");
  } else {
    message = "Success!";
  }
  return message;
}
