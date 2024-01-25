"use client";
import { Card, Grid } from "@mui/material";
import { Text } from "../../components/common/Text";
import { Rank } from "../../components/charts/rank/Rank";
import { useEffect, useState } from "react";
import { Heatmap } from "@/components/charts/heatmap/weekly/Heatmap";

import dayjs from "dayjs";

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
  const totalTime = checkOutTime - checkInTime;

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

const getHourlyOccupancy = (data) => {
  const hourlyOccupancy = {};

  data.forEach((entry) => {
    const checkInTime = new Date(entry.check_in);
    const checkOutTime = new Date(entry.check_out);
    const dateKey = checkInTime.toISOString().split("T")[0];

    // もし指定の日付がまだオブジェクトに存在しない場合、初期化
    if (!hourlyOccupancy[dateKey]) {
      hourlyOccupancy[dateKey] = {};
      for (let hour = 0; hour < 24; hour++) {
        hourlyOccupancy[dateKey][hour] = 0;
      }
    }

    // 部屋にいる時間を1時間ごとに分割
    let currentTime = new Date(checkInTime);
    while (currentTime < checkOutTime) {
      const hour = currentTime.getHours();
      hourlyOccupancy[dateKey][hour] += 1;

      currentTime.setHours(currentTime.getHours() + 1);
    }
  });

  return hourlyOccupancy;
};

export default function weeklyPage() {
  const [weeklyRank, setWeeklyRank] = useState(null);
  const [hourlyOccupancy, setHourlyOccupancy] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [pickerTime, setPickerTime] = useState(null);

  const today = dayjs();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // `/api/access/timestamp/${today.format("YYYY/MM")}`,
          `/api/access/timestamp/2023/12`,
        );
        const result = await response.json();

        const weeklyRankData = calculateWeeklyRanking(result);
        const hourlyOccupancyData = getHourlyOccupancy(result);

        setWeeklyRank(weeklyRankData[50]);
        setHourlyOccupancy(Object.values(hourlyOccupancyData));
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await fetch(`/api/access/heatmap`);
        const result = await response.json();
        setHeatmapData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={7}>
        <Grid item xs={12}>
          {/* picker実装 */}
        </Grid>
        <Grid item xs={12}>
          <Heatmap hourlyOccupancy={hourlyOccupancy} data={heatmapData} />
        </Grid>
      </Grid>

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
    </Grid>
  );
}
