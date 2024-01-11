"use client";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckIcon from "@mui/icons-material/Check";
import { Text } from "../../components/common/Text";

export const ToggleGroup = (props) => {
  const { toggleHandler, timeUnit } = props;

  return (
    <ToggleButtonGroup value={timeUnit} onChange={toggleHandler} exclusive>
      <ToggleButton value="日数">
        <div className="flex">
          <CheckIcon />
          <Text message="日数" />
        </div>
      </ToggleButton>
      <ToggleButton value="時間">
        <div className="flex">
          <CheckIcon />
          <Text message="時間" />
        </div>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
