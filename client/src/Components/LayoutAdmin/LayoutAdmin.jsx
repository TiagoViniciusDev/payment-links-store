import { Outlet } from "react-router-dom"

import AdminSideMenu from "../AdminSideMenu/AdminSideMenu"
import './LayoutAdmin.css'

function LayoutAdmin() {
  return (
    <div className="LayoutAdmin">
        <AdminSideMenu />
        <Outlet />
    </div>
  )
}

export default LayoutAdmin