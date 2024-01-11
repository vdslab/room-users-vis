import { Avatar, Typography } from "@mui/material";

export const AvatarCard = () => {
  return (
    <div
      style={{
        width: "30vw",
        height: "100vh",
        backgroundColor: "midnightblue",
      }}
    >
      <Avatar />
      <Typography>山田たろう</Typography>
      <Typography>3年</Typography>
    </div>
  );
};
