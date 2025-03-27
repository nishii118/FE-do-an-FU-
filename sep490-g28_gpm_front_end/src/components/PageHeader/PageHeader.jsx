import React from "react";
import AdminBreadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { Typography } from "@mui/material";

const PageHeader = ({ breadcrumbs, pageTitle, children }) => {
  return (
    <div>
      <div className="p-4 bg-white">
        <AdminBreadcrumbs data={breadcrumbs} />
        <Typography variant="h5">{pageTitle}</Typography>
      </div>

      <div className="m-6 p-6 bg-white">{children}</div>
    </div>
  );
};

export default PageHeader;
