"use client";
import { Card, Grid } from "@mui/material";
import { Text } from "../../components/common/Text";
import { Rank } from "../../components/charts/rank/Rank";
import { ranking } from "../../features/calcData";
import { TEST_DATA } from "../../features/TEST";
import { useEffect, useState } from "react";

// 週番号を取得する関数
const getWeekNumber = (date) => {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7,
  );
  return weekNumber;
};

// 滞在時間を計算する関数
const calculateTotalTime = (checkIn, checkOut) => {
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  const totalTime = checkOutTime - checkInTime; // 秒単位の滞在時間

  return totalTime;
};

// ランキングデータを計算する関数
const calculateWeeklyRanking = (data) => {
  const weeklyRanking = {};

  const weeklyData = data.reduce((acc, entry) => {
    const weekNumber = getWeekNumber(new Date(entry.check_in));
    acc[weekNumber] = acc[weekNumber] || [];
    acc[weekNumber].push(entry);
    return acc;
  }, {});

  for (const [weekNumber, entries] of Object.entries(weeklyData)) {
    const weeklyRank = entries.reduce((acc, entry) => {
      const studentId = entry.user_id;
      const totalTime = calculateTotalTime(entry.check_in, entry.check_out);

      acc[studentId] = (acc[studentId] || 0) + totalTime;
      return acc;
    }, {});

    weeklyRanking[weekNumber] = Object.entries(weeklyRank)
      .map(([studentId, totalTime]) => ({
        studentId,
        studentName: studentId,
        totalTime,
      }))
      .sort((a, b) => b.totalTime - a.totalTime);
  }

  return weeklyRanking;
};

export default function weeklyPage() {
  const [weeklyRank, setWeeklyRank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/access/timestamp/2023/12`);
        const result = await response.json();

        console.log(result);

        const weeklyRankData = calculateWeeklyRanking(result);

        console.log(weeklyRankData[50]);

        setWeeklyRank(weeklyRankData[50]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message="週間滞在時間ランキング" />
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ height: "80vh", overflow: "scroll" }}>
            <Rank data={weeklyRank} timeUnit="" />
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={7}></Grid>
    </Grid>
  );
}
