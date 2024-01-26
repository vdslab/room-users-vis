"use client";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useState } from "react";

export const RankBar = (props) => {
  const { maxTotal, id, total, label, index } = props;

  const router = useRouter();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        const result = await response.json();

        setUser(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const userColor = user?.color ? user.color : d3.schemeCategory10[index % 10];

  const rankLabelStyle =
    index + 1 < 10
      ? {
          color: "#000000",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "auto",
        }
      : {
          color: "#000000",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "auto",
          position: "relative",
          right: "5px",
        };

  const avatarBgcolor = user?.color
    ? user.color
    : d3.schemeCategory10[index % 10];

  const onAvatarClick = () => {
    router.push(`/avatar?id=${id}`);
  };

  return (
    <div className="flex m-5 space-x-2">
      <Typography align="center" style={rankLabelStyle} width={8}>
        {index + 1}
      </Typography>
      <div onClick={onAvatarClick} className="cursor-pointer">
        {user?.icon ? (
          <Avatar src={user.icon} />
        ) : (
          <Avatar sx={{ bgcolor: avatarBgcolor }}>
            <Typography sx={{ fontSize: 10 }}>
              {user?.name ? user.name : "no name"}
            </Typography>
          </Avatar>
        )}
      </div>
      <RectSVG max={maxTotal} total={total} color={userColor} marginW={120} />
      <Typography
        sx={{
          fontSize: 10,
          width: 30,
          fontWeight: "bold",
          textAlign: "center",
          height: 4,
          lineHeight: 4,
        }}
      >
        {total + label}
      </Typography>
    </div>
  );
};
