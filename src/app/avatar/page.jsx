"use client";
import { Rank } from "@/components/charts/rank/Rank";
import { Text } from "@/components/common/Text";
import { AvatarCard } from "@/components/layouts/AvatarCard";
import { Card, Grid, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { AvatarHeatmap } from "@/components/charts/heatmap/avatar/HeatMap";
import { createFriedShipRank, convertData } from "@/features/calcAvatar";

export default function AvatarPage(props) {
  const { params, searchParams } = props;

  const [friendRank, setFriendRank] = useState(null);
  const [frequency, setFrequency] = useState(null);

  const theme = createTheme();

  const id = searchParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${id}/ranking`);
        const resAccess = await fetch(`/api/access/timestamp/all`);
        const result = await response.json();
        const resultAccess = await resAccess.json();

        const friendRankData = createFriedShipRank(result);
        const userData = resultAccess.filter((entry) => entry.user_id === id);
        const hourlyOccupancyData = convertData(userData);

        setFriendRank(friendRankData);
        setFrequency(hourlyOccupancyData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <AvatarCard id={id} />
        </Grid>

        <Grid item xs={12} md={3.5}>
          <div className="flex flex-col justify-center">
            <Text message="一緒にいたランキング" />
            <Card
              variant="outlined"
              style={{ height: "70vh", overflow: "scroll" }}
            >
              <Rank data={friendRank} timeUnit="時間" />
            </Card>
          </div>
        </Grid>

        <Grid item xs={12} md={5.5}>
          <Text message="年間の滞在時間" />
          <Card variant="outlined" style={{ height: "70vh", width: "95%" }}>
            <AvatarHeatmap avatarOccupancy={frequency} />
          </Card>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
