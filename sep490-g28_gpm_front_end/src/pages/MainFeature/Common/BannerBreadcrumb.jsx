import React from "react";
import NewsBanner from "../../../assets/images/News_Banner.png";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BannerBreadcrumb = ({ data, pageTitle = "Sức mạnh 2000" }) => {
  return (
    <div className="relative">
      <img
        src={NewsBanner}
        alt=""
        className="w-full h-[150px] lg:h-[300px] object-cover"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2.5">
        <div>
          <h3 className="lg:text-4xl text-2xl text-white font-bold text-center">
            {pageTitle}
          </h3>
        </div>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="&#x2022;"
          sx={{
            "& .MuiBreadcrumbs-ol": {
              justifyContent: "center",
              color: "#fff",
            },
          }}
        >
          <Link
            color="inherit"
            to="/"
            className="text-sm lg:text-xl hover:underline"
          >
            Trang chủ
          </Link>
          {data?.map((item, index) => {
            const isLastItem = index === data.length - 1;
            const key = item.path || index; // Use a unique identifier if available, otherwise fallback to index
            if (isLastItem) {
              return (
                <Link color="inherit" className="text-sm lg:text-xl">
                  {item.title}
                </Link>
              );
            }

            return (
              <Link
                color="inherit"
                to={item.path}
                className="lg:text-xl text-sm hover:underline"
                key={key}
              >
                {item.title}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
    </div>
  );
};

export default BannerBreadcrumb;
