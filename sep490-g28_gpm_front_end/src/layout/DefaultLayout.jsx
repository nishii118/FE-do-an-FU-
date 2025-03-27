import React from "react";
import { Outlet } from "react-router-dom";
import DefaultHeader from "../components/Header/DefaultHeader";
import DefaultFooter from "../components/Footer/DefaultFooter";

const DefaultLayout = () => {
  return (
    <div className="w-full">
      <DefaultHeader />

      <div className="bg-gray-50">
        <Outlet />
      </div>
      <DefaultFooter />
    </div>
  );
};

export default DefaultLayout;
