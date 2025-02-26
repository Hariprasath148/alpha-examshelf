import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom"
import "../style/staff_card.css"

export const Root_Layout = () => {

  return (
    <>
      <Outlet/>
      <Toaster/>
    </>
  )
};
