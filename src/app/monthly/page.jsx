"use client";
import { Calendar } from "@/components/charts/Calendar";
import { Text } from "@/components/common/Text";
import { ToggleGroup } from "@/components/layouts/ToggleGroup";
import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { TEST_DATA } from "@/features/TEST";
import { Rank } from "@/components/charts/rank/Rank";
import { ranking, timeSpentRanking } from "../../features/calcData";

export default function MonthlyPage() {
  const [timeUnit, setTimeUnit] = useState("日数");
  const [data, setData] = useState(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/access");
        const result = await response.json();
        setData(result.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(data);

  const toggleHandler = (event, unit) => {
    setTimeUnit(unit);
  };

  let rankingData;
  if (timeUnit == "日数") {
    rankingData = ranking(TEST_DATA);
  } else {
    rankingData = timeSpentRanking(TEST_DATA);
  }

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
          <Card variant="outlined" style={{ height: "70vh" }}>
            <Rank data={rankingData} timeUnit={timeUnit} />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
