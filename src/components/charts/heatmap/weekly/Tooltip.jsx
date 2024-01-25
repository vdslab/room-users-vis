import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Tooltip(props) {
  const { pos, info } = props;

  if (pos === null || info === null) return null;

  const tooltipStyle = {
    position: "absolute",
    left: pos.x + 15,
    top: pos.y + 15,
    zIndex: 7, // Set z-index to 7
    userSelect: "none", // Disable text selection
  };

  return (
    <div style={tooltipStyle}>
      <Card sx={{ maxWidth: 360 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {info.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {info.info}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
export default Tooltip;
