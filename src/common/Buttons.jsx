import { Button } from "@mui/material";

export const Buttons = (props) => {

  const { btnTexts, btnStyle } = props;

  console.log(props)

  return (
    <>
      {btnTexts.map((value) => {
        return (
          <Button {...btnStyle} >{value}</Button>
        )
      })}
    </>
  )
}
