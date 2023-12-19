'use client'
import { Button } from "@mui/material"
import { useRouter } from "next/navigation";


export const LinkButton = (props) => {

  const { navigation, btnStyle, btnText } = props;

  console.log(props)

  const router = useRouter();
  const linkToNav = () => {
    router.push(navigation)
  }

  return (
    <Button {...btnStyle} onClick={linkToNav} >{btnText}</Button>
  )
}
