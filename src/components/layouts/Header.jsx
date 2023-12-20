import { LinkButton } from '@/components/common/LinkButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export const Header = () => {

  const buttons = ['monthly', 'weekly'];

  const btnStyle = {
    color: 'inherit'
  }


  return (
    <div >
      <Box sx={{ flexGrow:1 }}>
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Room-user-vis
          </Typography>

          {buttons.map((value) => {
            return(
              <LinkButton navigation={`/${value}`} btnStyle={btnStyle} btnText={value} key={value} />
            )
          })}

        </Toolbar>
      </AppBar>
      </Box>
    </div>
  )
}
