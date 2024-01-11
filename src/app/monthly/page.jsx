"use client";
import { Calender } from "@/components/charts/Calender";
import { Text } from "@/components/common/Text";
import { ToggleGroup } from "@/app/monthly/ToggleGroup";
import { Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TEST_DATA } from "@/features/TEST";
import { Rank } from "@/components/charts/rank/Rank";

export default function MonthlyPage() {

  const [timeUnit, setTimeUnit] = useState('日数');

  const now = new Date();
  const yearOptions = Array.from(
    { length: now.getFullYear() - 2023 + 1 },
    (_, i) => i + 2023,
  );
  const [year, setYear] = useState(now.getFullYear());

  const [monthOptions, setMonthOptions] = useState(
    Array.from({ length: 12 }, (_, i) => i + 1),
  );

  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    if (year === now.getFullYear()) {
      setMonthOptions(
        Array.from({ length: now.getMonth() + 1 }, (_, i) => i + 1),
      );
      setMonth(now.getMonth() + 1);
    } else if (year === 2023) {
      setMonthOptions([12]);
      setMonth(12);
    } else {
      setMonthOptions(Array.from({ length: 12 }, (_, i) => i + 1));
    }
  }, [year]);

  const toggleHandler = (event, unit) => {
    setTimeUnit(unit);
  };

  const data = filterByYearMonth(TEST_DATA, year, month);

  const entranceCounts = {};

  for (const entry of data) {
    const studentId = entry["学籍番号"];
    const entryTime = new Date(entry["日時"]);

    if (entryTime) {
      const monthKey = entryTime.toISOString().slice(0, 7);
      if (!entranceCounts[studentId]) {
        entranceCounts[studentId] = {};
      }
      if (!entranceCounts[studentId][monthKey]) {
        entranceCounts[studentId][monthKey] = new Set();
      }
      entranceCounts[studentId][monthKey].add(
        entryTime.toISOString().slice(8, 10),
      );
    }
  }

  const studentLookup = Object.fromEntries(
    data.map((student) => [student["学籍番号"], student["氏名"]]),
  );

  const ranking = Object.entries(entranceCounts)
    .map(([studentId, entranceCounts]) => {
      const totalDays = Object.values(entranceCounts).reduce(
        (acc, daySet) => acc + daySet.size,
        0,
      );

      const studentName = studentLookup[studentId] || "Unknown";
      return { studentId, studentName, totalDays };
    })
    .sort((a, b) => b.totalDays - a.totalDays);


    const roomTimeData = {};

    data.forEach((entry) => {
      const studentId = entry["学籍番号"];
      const studentName = entry["氏名"];
      const entryTime = new Date(entry["日時"]);
      const isEntrance = entry["入退出状態"] === "入室状態";
    
      if (isEntrance) {
        if (!roomTimeData[studentId]) {
          roomTimeData[studentId] = {
            studentName,
            totalTimeSpent: 0,
            days: {},
          };
        }
        roomTimeData[studentId].entranceTime = entryTime;
      } else {
        if (roomTimeData[studentId] && roomTimeData[studentId].entranceTime) {
          const exitTime = entryTime;
          const timeSpent = exitTime - roomTimeData[studentId].entranceTime;
    
          const dayKey = entryTime.toISOString().slice(0, 10);
          roomTimeData[studentId].days[dayKey] = (roomTimeData[studentId].days[dayKey] || 0) + timeSpent;
          roomTimeData[studentId].totalTimeSpent += timeSpent;
    
          roomTimeData[studentId].entranceTime = null;
        }
      }
    });

const timeSpentRanking = Object.entries(roomTimeData)
  .map(([studentId, data]) => {
    const totalTimeSpent = Object.entries(data.days)
      .filter(([dayKey]) => dayKey.startsWith(`2023-${month}`))
      .reduce((acc, [, dayTotalTime]) => acc + dayTotalTime, 0);

    const studentName = data.studentName || "Unknown";
    const entranceMonth = new Date(data.entranceTime).getMonth() + 1;

    const monthData = Object.entries(data.days)
      .filter(([dayKey]) => dayKey.startsWith(`2023-${entranceMonth}`))
      .reduce((acc, [dayKey, dayTotalTime]) => {
        acc[dayKey] = dayTotalTime;
        return acc;
      }, {});

    return { studentId, studentName, totalTimeSpent, month, days: monthData };
  })
  .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);

  let rankingData;
  if(timeUnit=='日数'){
    rankingData = ranking
  } else {
    rankingData = timeSpentRanking
  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <Calender
          options={yearOptions}
          setValue={setYear}
          value={year}
          label="年"
        />
        <Calender
          options={monthOptions}
          setValue={setMonth}
          value={month}
          label="月"
        />
      </Grid>

      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message={`${month}月に来た日数ランキング`} />
        </Grid>

        <Grid item xs={12}>
          <ToggleGroup toggleHandler={toggleHandler} timeUnit={timeUnit} />
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" style={{ height: "70vh" }}>
            <Rank data={rankingData} timeUnit={timeUnit}/>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

// TEST_DATAから、年月のフィルターをかける
function filterByYearMonth(data, year, month) {
  return data.filter((entry) => {
    const entryTime = new Date(entry["日時"]);
    return (
      entryTime.getFullYear() === year && entryTime.getMonth() + 1 === month
    );
  });
}
