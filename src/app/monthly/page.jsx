"use client";
import { Calendar } from "@/components/charts/Calendar";
import { Text } from "@/components/common/Text";
import { ToggleGroup } from "@/components/layouts/ToggleGroup";
import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Rank } from "@/components/charts/rank/Rank";

// データを受け取り、ユーザーごとの入室日順のランキングデータを作成する関数
const createDayRankingData = (data) => {
  // ユーザーごとの入室日のセットを格納するオブジェクト
  const userDates = {};

  // データからユーザーごとの入室日をセットに格納
  data.forEach(({ user_id, check_in }) => {
    const dateKey = new Date(check_in).toISOString().split("T")[0];

    if (!userDates[user_id]) {
      userDates[user_id] = new Set();
    }

    userDates[user_id].add(dateKey);
  });

  // ランキングデータを作成
  const rankingData = Object.keys(userDates).map((userId) => {
    const totalDays = userDates[userId].size;

    return {
      studentId: userId,
      studentName: userId,
      totalDays: totalDays,
    };
  });

  // 日数の降順でソート
  rankingData.sort((a, b) => b.totalDays - a.totalDays);

  return rankingData;
};

// データを受け取り、ユーザーごとの入室時間のランキングデータを作成する関数
const createTimeRankingData = (data) => {
  // ユーザーごとの入室時間の合計を格納するオブジェクト
  const userTotalTimes = {};

  // データからユーザーごとの入室時間を合計
  data.forEach(({ user_id, check_in, check_out }) => {
    const checkInTime = new Date(check_in).getTime();
    const checkOutTime = new Date(check_out).getTime();
    const totalTime = checkOutTime - checkInTime;

    if (!userTotalTimes[user_id]) {
      userTotalTimes[user_id] = 0;
    }

    userTotalTimes[user_id] += totalTime;
  });

  // ランキングデータを作成
  const rankingData = Object.keys(userTotalTimes).map((userId) => {
    return {
      studentId: userId,
      studentName: userId,
      totalTime: userTotalTimes[userId],
    };
  });

  // 時間の降順でソート
  rankingData.sort((a, b) => b.totalTime - a.totalTime);

  return rankingData;
};

export default function MonthlyPage() {
  const [timeUnit, setTimeUnit] = useState("日数");
  const [dayRank, setDayRank] = useState(null);
  const [timeRank, setTimeRank] = useState(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/access/timestamp/${year - 1}/12`);
        const result = await response.json();

        const rankingDayData = createDayRankingData(result);
        const rankingTimeData = createTimeRankingData(result);

        console.log(rankingTimeData);

        setDayRank(rankingDayData);
        setTimeRank(rankingTimeData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [year, month]);

  const toggleHandler = (event, unit) => {
    setTimeUnit(unit);
  };

  let data;
  if (timeUnit == "日数") {
    data = dayRank;
  } else {
    data = timeRank;
  }

  console.log(timeRank);

  return (
    <Grid container spacing={2}>
      <Grid item xs={7}></Grid>

      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message={`${month}月に来た日数ランキング`} />
        </Grid>

        <Grid item xs={12}>
          <ToggleGroup toggleHandler={toggleHandler} timeUnit={timeUnit} />
        </Grid>

        <Grid item xs={12}>
          <Card
            variant="outlined"
            style={{ height: "70vh", overflow: "scroll" }}
          >
            <Rank data={data} timeUnit={timeUnit} />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
