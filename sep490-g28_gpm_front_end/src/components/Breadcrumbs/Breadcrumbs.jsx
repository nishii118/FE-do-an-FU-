import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const AdminBreadcrumbs = ({ data }) => {
  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
      {data?.map((item, index) => {
        const isLastItem = index === data.length - 1;
        const key = item.path || index; // Use a unique identifier if available, otherwise fallback to index

        if (isLastItem) {
          return (
            <Typography key={key} color="text.primary">
              {item.title}
            </Typography>
          );
        }

        return (
          <Link key={key} underline="hover" color="inherit" href={item.path}>
            {item.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default AdminBreadcrumbs;
