import Typography from "@mui/material/Typography";

export const Text = (props) => {
  const { message } = props;

  return (
    <>
      <Typography
        align="center"
        style={{
          color: "#000000",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "auto",
          margin: "30px",
        }}
      >
        {message}
      </Typography>
    </>
  );
};
