import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom"
import "../style/Staff_card.css"

export const Root_Layout = () => {

  return (
    <>
      <Outlet/>
      <Toaster/>
    </>
  )
};
