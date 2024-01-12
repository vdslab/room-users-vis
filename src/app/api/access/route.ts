import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  let json;
  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "error. invalid JSON" },
      { status: 400 },
    );
  }

  if (!json) {
    return NextResponse.json(
      { message: "error. missing body" },
      { status: 400 },
    );
  }

  const { input } = json;
  if (!input) {
    return NextResponse.json(
      { message: "error. missing fields" },
      { status: 400 },
    );
  }

  const user_id = getStudentID(input);
  if (!user_id) {
    return NextResponse.json(
      { message: "error. invalid studentID" },
      { status: 400 },
    );
  }
  // check if user Checked in
  const accessed = await prisma.access.findFirst({
    where: {
      user_id,
      check_out: null,
    },
  });

  // if user checked in
  // update accessed check_out
  let message = "Success!";
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
      return NextResponse.json({ message: "Success!" }, { status: 200 });
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
      message = "Success! But you forgot to check out yesterday.";
    }
  }
  const access = await prisma.access.create({
    data: {
      user_id,
      check_in: new Date(),
      check_out: null,
    },
  });

  // Return Success!
  return NextResponse.json({ message }, { status: 200 });
}

function getStudentID(input: String): string {
  const info = input.toString();
  if (info.length == 7) return info;
  if (info.length == 16) {
    return uni2StudentID(info);
  }
  const infos = infoSplit(info);
  return infos[1];
}

function infoSplit(info: string): string[] {
  const infos = info.split(/\s+/).filter((e) => e != null && e != "");
  const dates = infos.pop()!;
  infos.push(dates.slice(0, 8));
  infos.push(dates.slice(8));

  return infos;
}

function uni2StudentID(uni_num: string): string {
  const uni_dept = uni_num.substring(8, 11);
  const [course, dept] = getDept(uni_dept);
  const year = uni_num.substring(2, 4);

  if (course === "b") {
    const unique = uni_num.substring(12, 15);
    return dept + year + unique;
  } else if (course === "m" || course === "d") {
    const unique = course + uni_num.substring(13, 15);
    return dept + year + unique;
  } else {
    return uni_num;
  }
}

function getDept(uni: string): [string, string] {
  // 学部
  const bachelor_depts: { [key: string]: string } = {
    "501": "01", //哲学
    "502": "02", //史学
    "503": "03", //国文
    "504": "04", //中文
    "505": "05", //英文
    "506": "06", //ドイツ文
    "507": "07", //社会
    "508": "08", //教育
    "509": "09", //体育
    "510": "10", //心理
    "518": "11", //社会福祉
    "511": "51", //地理
    "512": "52", //地球
    "513": "53", //数学
    "514": "54", //情報
    "515": "55", //物理
    "516": "56", //生命
    "517": "57", //科学
  };

  // 大学院（修士）
  const master_depts: { [key: string]: string } = {
    "201": "61", //地球情報数理
    "202": "62", //相関理化学
  };

  if (uni in bachelor_depts) {
    return ["b", bachelor_depts[uni]];
  } else if (uni in master_depts) {
    return ["m", master_depts[uni]];
  } else {
    return ["o", uni];
  }
}
