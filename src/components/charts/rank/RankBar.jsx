import { Text } from "@/components/common/Text";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";

export const RankBar = () => {
  return (
    <div className="flex">
      <Text message="1" />
      <Avatar />
      <RectSVG />
    </div>
  );
};
