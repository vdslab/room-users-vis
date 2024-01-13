import { Card, Grid } from "@mui/material";
import { Text } from "../../components/common/Text";
import { Rank } from "../../components/charts/rank/Rank";
import { ranking } from "../../features/calcData";
import { TEST_DATA } from "../../features/TEST";

export default function weeklyPage() {
  return (
    <Grid container spacing={2}>
      <Grid container item xs={5}>
        <Grid item xs={12}>
          <Text message="滞在時間ランキング" />
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ height: "70vh" }}>
            <Rank data={ranking(TEST_DATA)} timeUnit="日数" />
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={7}></Grid>
    </Grid>
  );
}
