"use client";
import { Card, Grid } from "@mui/material";
import { Text } from "../../components/common/Text";
import { Rank } from "../../components/charts/rank/Rank";
import { useEffect, useState } from "react";
import { Heatmap } from "@/components/charts/heatmap/weekly/Heatmap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CalculateTotalRanking } from "@/features/calcWeekly";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

export default function WeeklyPage() {
  const [weeklyRank, setWeeklyRank] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [pickerTime, setPickerTime] = useState(dayjs().tz());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/access/timestamp/${pickerTime.format("YYYY/MM")}`,
        );
        const result = await response.json();

        const oneWeekAgo = pickerTime.subtract(1, "week").startOf("day");
        const filteredData = result.filter((entry) =>
          dayjs(entry.check_in).isBetween(oneWeekAgo, pickerTime),
        );

        const weeklyRankData = CalculateTotalRanking(filteredData);
        setWeeklyRank(weeklyRankData);
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
  }, [pickerTime]);

  const onPickerChange = (newDate) => {
    setPickerTime(newDate);
  };

  console.log(pickerTime);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={7}>
        <Grid item xs={12}>
          <div className="flex justify-center items-center h-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="DatePicker"
                value={pickerTime}
                onChange={onPickerChange}
                format="YYYY/MM/DD"
                mask="____/__/__"
              />
            </LocalizationProvider>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Text message="時間帯別滞在人数" />
          <Heatmap data={heatmapData} />
        </Grid>
      </Grid>

      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message="週間滞在時間ランキング" />
        </Grid>

        <Grid item xs={12}>
          <Card
            variant="outlined"
            sx={{ width: "95%", height: "80vh", overflow: "scroll" }}
          >
            <Rank data={weeklyRank} timeUnit="" />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
