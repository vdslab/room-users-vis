"use client";
import { Rank } from "@/components/charts/rank/Rank";
import { Text } from "@/components/common/Text";
import { AvatarCard } from "@/components/layouts/AvatarCard";
import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";

const createFriedShipRank = (data) => {
  return data.map(([studentId, totalTime]) => {
    return {
      studentId: studentId,
      studentName: studentId,
      totalTime: totalTime,
    };
  });
};

export default function AvatarPage(props) {
  const { params, searchParams } = props;

  const [friendRank, setFriendRank] = useState(null);

  const id = searchParams.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${id}/ranking`);
        const result = await response.json();

        const friendRankData = createFriedShipRank(result);
        setFriendRank(friendRankData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container>
      <Grid item xs={3}>
        <AvatarCard id={id} />
      </Grid>

      <Grid item xs={3}>
        <Text message="一緒にいたランキング" />
        <Card variant="outlined" style={{ height: "70vh", overflow: "scroll" }}>
          <Rank data={friendRank} timeUnit="時間" />
        </Card>
      </Grid>

      <Grid item xs={6}></Grid>
    </Grid>
  );
}
