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

/**
 * Ensures that a user exists in the database.
 * If the user does not exist, it creates a new user with the given user_id.
 * If the user exists, it checks if the user has registered their name and icon.
 * Returns an array of warnings indicating any missing information.
 * @param user_id - The ID of the user to ensure exists.
 * @returns An array of warnings indicating any missing information.
 */
async function ensureUserExists(user_id: string) {
  const warnings = [];

  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

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

  return warnings;
}

/**
 * Creates an access record for a user.
 * @param user_id - The ID of the user.
 * @param check_in - The check-in timestamp in string format.
 * @param check_out - The check-out timestamp in string format.
 */
async function createAccessRecord(
  user_id: string,
  check_in: string,
  check_out: string,
) {
  if (check_in && !check_out) {
    // Check for records where user_id and check_in are the same but check_out is null
    const accessed = await prisma.access.findFirst({
      where: {
        user_id,
        check_in: new Date(check_in),
      },
    });

    // If the user has already checked in, delete the column.
    if (!accessed) {
      // Create a new record.
      await prisma.access.create({
        data: {
          user_id,
          check_in: new Date(check_in),
        },
      });
    }
  } else if (check_in && check_out) {
    if (check_in !== check_out) {
      await prisma.access.create({
        data: {
          user_id,
          check_in: new Date(check_in),
          check_out: new Date(check_out),
        },
      });
    }
  } else if (check_out) {
    // check if user Checked in
    const accessed = await prisma.access.findFirst({
      where: {
        user_id,
        check_out: null,
      },
    });

    // If the user has already checked in, check out.
    const check_out_date = new Date(check_out);

    if (accessed) {
      if (accessed.check_in.getDate() == check_out_date.getDate()) {
        if (accessed.check_in !== check_out_date) {
          await prisma.access.update({
            where: {
              user_id_check_in: {
                user_id: accessed.user_id,
                check_in: accessed.check_in,
              },
            },
            data: {
              check_out: check_out_date,
            },
          });
        } else {
          await prisma.access.delete({
            where: {
              user_id_check_in: {
                user_id: accessed.user_id,
                check_in: accessed.check_in,
              },
            },
          });
        }
      } else {
        // If the check-in is not timestamp date, set the check-out for that record to 10 minutes after the check-in.
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
      }
    }
  }
}

/**
 * Creates a message based on the provided warnings.
 * If there are any warnings, the message will start with "Warning!" followed by each warning on a new line.
 * If there are no warnings, the message will be "Success!".
 * @param warnings - An array of warning messages.
 * @returns The created message.
 */
function createMessage(warnings: string[]) {
  let message = "";
  if (warnings.length > 0) {
    message = "Warning!\n" + warnings.join("\n");
  } else {
    message = "Success!";
  }
  return message;
}

/**
 * Handles the POST request for the specified route.
 *
 * @param request - The request object.
 * @returns A NextResponse object with the appropriate JSON response.
 */
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
    time,
  }: { input: string; check_in: string; check_out: string; time: string } =
    json;

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

  const warnings = await ensureUserExists(user_id);

  if (check_in || check_out) {
    await createAccessRecord(user_id, check_in, check_out);
    return NextResponse.json({ message: "Success!" }, { status: 200 });
  }

  // If check_in and check_out are not specified, check in.

  const timestamp = time ? new Date(time) : new Date();

  // check if user Checked in
  const accessed = await prisma.access.findFirst({
    where: {
      user_id,
      check_out: null,
    },
  });

  // If the user has already checked in, check out.
  if (accessed) {
    // If the check-in is not timestamp date, delete the column.
    if (accessed.check_in.getDate() == timestamp.getDate()) {
      await prisma.access.update({
        where: {
          user_id_check_in: {
            user_id: accessed.user_id,
            check_in: accessed.check_in,
          },
        },
        data: {
          check_out: timestamp,
        },
      });

      // Create message
      const message = createMessage(warnings);

      return NextResponse.json({ message }, { status: 200 });
    } else {
      // If the check-in is not timestamp date, set the check-out for that record to 10 minutes after the check-in.
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
        "You forgot to check out a few days ago... The record was automatically checked out.",
      );
    }
  }
  const access = await prisma.access.create({
    data: {
      user_id,
      check_in: timestamp,
      check_out: null,
    },
  });

  // Create message
  const message = createMessage(warnings);
  return NextResponse.json({ message }, { status: 200 });
}

/**
 * Retrieves information about who is currently in the room.
 * In other words, it acquires access information that has been checked in but not yet checked out.
 *
 * @param request - The request object.
 * @returns A JSON response containing the access information.
 */
export async function GET(request: Request) {
  // Get all access records that have not been checked out.
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
