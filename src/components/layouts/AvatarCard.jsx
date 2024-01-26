"use client";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";

export const AvatarCard = (props) => {
  const { id } = props;

  const [user, setUser] = useState("");

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

  return (
    <div className="bg-MIDNIGHT_BLUE w-full h-screen flex flex-col items-center justify-evenly ">
      {user.icon ? (
        <Avatar sx={{ width: 200, height: 200 }} src={user.icon} />
      ) : (
        <Avatar sx={{ width: 200, height: 200, bgcolor: user.color }}>
          <Typography>{user.name}</Typography>
        </Avatar>
      )}
      <div className="bg-BAHAMA_BLUE w-4/5 h-1/6 rounded text-center">
        <Typography
          sx={{ fontWeight: "bold", fontSize: 35, marginTop: "auto" }}
        >
          {user.name}
        </Typography>
      </div>
    </div>
  );
};
