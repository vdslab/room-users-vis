"use client"
import { Text } from "@/components/common/Text";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";

export const RankBar = (props) => {

  const { maxTotal, data, index } = props;
  console.log(props)

  const router = useRouter()

  const  onAvatarClick = () => {
    router.push('/avatar')
  }



  return (
    <div className="flex m-5 space-x-2">
      <Text message={index+1} />
      <div onClick={onAvatarClick}>
        <Avatar ><Typography sx={{ fontSize:10 }}>{data.studentName}</Typography></Avatar>
      </div>
      <RectSVG max={maxTotal} total={data.totalDays} />
      <Text message={data.totalDays+'日'} />
    </div>
  );
};
