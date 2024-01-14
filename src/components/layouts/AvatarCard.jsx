import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

export const AvatarCard = (props) => {
  const { name } = props;

  return (
    <div className="bg-MIDNIGHT_BLUE w-full h-screen flex flex-col items-center justify-evenly ">
      <Avatar sx={{ width: 200, height: 200 }}>
        <Typography>{name}</Typography>
      </Avatar>
      <div className="bg-BAHAMA_BLUE w-4/5 h-1/6 rounded text-center">
        <Typography
          sx={{ fontWeight: "bold", fontSize: 35, marginTop: "auto" }}
        >
          {name}
        </Typography>
      </div>
    </div>
  );
};
