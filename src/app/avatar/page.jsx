import { AvatarCard } from "@/components/layouts/AvatarCard";
import { Grid } from "@mui/material";

export default function AvatarPage(props) {
  const { params, searchParams } = props;

  const name = searchParams.name;
  console.log(name);

  return (
    <Grid container>
      <Grid item xs={3}>
        <AvatarCard name={name} />
      </Grid>

      <Grid item xs={3}></Grid>

      <Grid item xs={6}></Grid>
    </Grid>
  );
}
