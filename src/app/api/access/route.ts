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

  const { id } = json;

  // Return success
  return NextResponse.json({ message: "success" }, { status: 200 });
}

function getStudentID(input) {
  const info = input.toString();
  if (info.length == 7) return info;
  if (info.length == 16) {
    return uni2StudentID(info);
  }
  const id = infoSplit(info);
  return id;
}

function infoSplit(info) {
  const infos = info.split(/\s+/).filter((e) => e != null && e != "");
  const dates = infos.pop(infos.length - 1);
  infos.push(dates.slice(0, 8));
  infos.push(dates.slice(8));

  return infos;
}

function uni2StudentID(uni_num) {
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

function getDept(uni) {
  // 学部
  const bachelor_depts = {
    501: "01", //哲学
    502: "02", //史学
    503: "03", //国文
    504: "04", //中文
    505: "05", //英文
    506: "06", //ドイツ文
    507: "07", //社会
    508: "08", //教育
    509: "09", //体育
    510: "10", //心理
    518: "11", //社会福祉
    511: "51", //地理
    512: "52", //地球
    513: "53", //数学
    514: "54", //情報
    515: "55", //物理
    516: "56", //生命
    517: "57", //科学
  };

  // 大学院（修士）
  const master_depts = {
    201: "61", //地球情報数理
    202: "62", //相関理化学
  };

  if (uni in bachelor_depts) {
    bachelor_depts[uni];
  } else if (uni in master_depts) {
    master_depts[uni];
  } else {
    return null;
  }
}
