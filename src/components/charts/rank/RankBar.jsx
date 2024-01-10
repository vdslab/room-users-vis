"use client"
import { Text } from "@/components/common/Text";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";
import { useRouter } from "next/navigation";

export const RankBar = () => {

  const router = useRouter()

  const  onAvatarClick = () => {
    router.push('/avatar')
  }



  return (
    <div className="flex m-5 space-x-2">
      <Text message="1" />
      <div onClick={onAvatarClick}>
        <Avatar />
      </div>
      <RectSVG />
      <Text message='10日' />
    </div>
  );
};
