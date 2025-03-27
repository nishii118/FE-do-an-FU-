import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

import { toast } from "react-toastify";
import ResponsiveDrawer from "../components/Drawer/Drawer";
import HeaderAdmin from "../components/Header/HeaderAdmin";


const AdminLayout = () => {
  const navigate = useNavigate();
  const [isShrink, setIsShrink] = useState(true);
  const isMobile = useMediaQuery("(max-width:640px)");
  const shrink = isMobile ? false : isShrink;

  return (
    <div>
      <div className="h-[70px] text-white">
        <HeaderAdmin setIsShrink={setIsShrink}></HeaderAdmin>
      </div>
      <div className="flex bg-[#f5f5f5]">
        {/* <Sidebar sidebarWidth={245} /> */}
        <ResponsiveDrawer shrink={shrink} />
        <div className="border-t h-[calc(100vh_-_70px)] overflow-auto w-full">
          <div className="flex-grow min-h-[calc(100vh_-_70px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
