"use client";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import * as d3 from "d3";

export const RankBar = (props) => {
  const { maxTotal, name, total, label, index } = props;

  const router = useRouter();

  const onAvatarClick = () => {
    router.push(`/avatar?name=${name}`);
  };

  return (
    <div className="flex m-5 space-x-2">
      <Typography
        align="center"
        style={{
          color: "#000000",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "auto",
        }}
        width={8}
      >
        {index + 1}
      </Typography>
      <div onClick={onAvatarClick} className="cursor-pointer">
        <Avatar>
          <Typography sx={{ fontSize: 10 }}>{name}</Typography>
        </Avatar>
      </div>
      <RectSVG
        max={maxTotal}
        total={total}
        color={d3.schemeCategory10[index % 10]}
      />
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
