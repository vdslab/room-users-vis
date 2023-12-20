'use client'
import { Button } from "@mui/material"
import { useRouter } from "next/navigation";


export const LinkButton = (props) => {

  const { navigation, btnStyle, btnText } = props;

  const router = useRouter();
  const linkToNav = () => {
    router.push(navigation)
  }

  return (
    <Button {...btnStyle} onClick={linkToNav} >{btnText}</Button>
  )
}
