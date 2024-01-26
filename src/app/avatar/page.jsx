"use client";
import { Rank } from "@/components/charts/rank/Rank";
import { Text } from "@/components/common/Text";
import { AvatarCard } from "@/components/layouts/AvatarCard";
import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { AvatarHeatmap } from "@/components/charts/heatmap/avatar/HeatMap";

const createFriedShipRank = (data) => {
  return data.map(([studentId, totalTime]) => {
    return {
      studentId: studentId,
      studentName: studentId,
      totalTime: totalTime,
    };
  });
};

const convertData = (userData) => {
  const weeklyData = Array.from({ length: 10 }, () => Array(7).fill(0));

  userData.forEach(({ check_in, check_out }) => {
    const checkInDate = new Date(check_in);
    const dayOfWeek = checkInDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    console.log(checkInDate, dayOfWeek);

    let initMonth = 0;
    if (checkInDate.getMonth() + 1 === 12) {
      initMonth = checkInDate.getDate() + 3;
    } else {
      initMonth = checkInDate.getDate();
    }
    let weekOfMonth = Math.floor(initMonth / 7);
    if (checkInDate.getMonth() + 1 === 1) {
      weekOfMonth += 5;
    }

    weeklyData[weekOfMonth][dayOfWeek] += new Date(check_out) - checkInDate;
  });

  return weeklyData;
};

export default function AvatarPage(props) {
  const { params, searchParams } = props;

  const [friendRank, setFriendRank] = useState(null);
  const [frequency, setFrequency] = useState(null);

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
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <AvatarCard id={id} />
      </Grid>

      <Grid item xs={3.5}>
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

      <Grid item xs={5.5}>
        <Text message="年間の滞在時間" />
        <Card variant="outlined" style={{ height: "70vh", width: "95%" }}>
          <AvatarHeatmap avatarOccupancy={frequency} />
        </Card>
      </Grid>
    </Grid>
  );
}
