import { Calender } from "@/components/charts/Calender";
import { RankBar } from "@/components/charts/rank/RankBar";
import { Text } from "@/components/common/Text";
import { ToggleGroup } from "@/app/monthly/ToggleGroup";
import { Card, Grid, Typography } from "@mui/material";

export default function MonthlyPage() {
  const now = new Date();

  const month = now.getMonth() + 1;

  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <Calender />
      </Grid>

      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message={`${month}月に来た日数ランキング`} />
        </Grid>

        <Grid item xs={12}>
          <ToggleGroup nav="/monthly/day" />
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" style={{ height: "70vh" }}>
            <RankBar />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
