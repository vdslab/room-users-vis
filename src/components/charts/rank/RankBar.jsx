import { Text } from "@/components/common/Text";
import Avatar from "@mui/material/Avatar";
import { RectSVG } from "./RectSVG";

export const RankBar = () => {
  return (
    <div className="flex m-5 space-x-2">
      <Text message="1" />
      <Avatar />
      <RectSVG />
      <Text message='10日' />
    </div>
  );
};
