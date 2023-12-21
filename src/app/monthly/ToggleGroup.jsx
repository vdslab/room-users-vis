"use client";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckIcon from "@mui/icons-material/Check";
import { Text } from "../../components/common/Text";
import { useRouter } from "next/navigation";

export const ToggleGroup = (props) => {
  const { nav } = props;

  const router = useRouter();
  const handleChange = (e, value) => {
    router.push(nav);
  };

  let picked = "";
  if (nav === "/monthly/day") {
    picked = "日数";
  } else {
    picked = "時間";
  }

  return (
    <ToggleButtonGroup value={picked} onChange={handleChange} exclusive>
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
