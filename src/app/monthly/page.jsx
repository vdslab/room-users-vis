"use client";
import { Calendar } from "@/components/charts/Calendar";
import { Text } from "@/components/common/Text";
import { ToggleGroup } from "@/components/layouts/ToggleGroup";
import { Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TEST_DATA } from "@/features/TEST";
import { Rank } from "@/components/charts/rank/Rank";
import { ranking, timeSpentRanking } from "../../features/calcData";

export default function MonthlyPage() {
  const [timeUnit, setTimeUnit] = useState("日数");

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
