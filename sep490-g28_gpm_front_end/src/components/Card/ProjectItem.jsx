import React, { useState } from "react";
import { Button } from "@mui/material";
import { ShareOutlined } from "@mui/icons-material";
import { PROJECT_STATUS } from "../../utils/const";
import { convertImage } from "../../utils/populate";
import { useNavigate } from "react-router-dom";
import ShareDialog from "../Dialog/ShareDialog";
import { BASE_URL_FE } from "./../../config/index";

const ProjectItem = ({ data }) => {
  const {
    slug,
    id,
    title,
    price,
    goal,
    totalDonation,
    location,
    campaign,
    thumbnailUrl,
    status,
  } = data ?? {};

  const navigation = useNavigate();
  const [open, setOpen] = useState(false);

  const projectLink = BASE_URL_FE + `/du-an/${slug}`;

  const getPrice = (data) => {
    return new Intl.NumberFormat("vi-VN").format(data);
  };

  const handleClick = () => {
    navigation(`/du-an/${slug}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareClick = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <div>
      <div className="p-5">
        <div
          className="border border-secondary p-5 rounded-[20px] hover:scale-105 transition duration-300"
          onClick={handleClick}
        >
          <img
            src={thumbnailUrl}
            alt=""
            className="h-[152px] w-full object-cover rounded-[20px]"
          />
          <div className="flex flex-col gap-[7px] mt-[14px]">
            <h3 className="font-bold truncate">{title}</h3>
            <p className="truncate">{location}</p>
            {/* <p className="line-clamp-1">
            <b>Xây dựng:</b> {description}
          </p> */}
            {campaign?.name && (
              <p>
                <b>Chiến dịch:</b> {campaign.name}
              </p>
            )}
            <p>
              <b>Chi phí:</b> {getPrice(price)} VND
            </p>
            {/* <p>
            <b>Được tài trợ:</b> {getPrice} VND
          </p> */}
            <>
              <p>
                <b>Cần góp lẻ:</b> {getPrice(goal)} VND
              </p>
              <p>
                <b>Hiện tại:</b> {getPrice(totalDonation)} VND
              </p>
            </>

            <hr className="border-primary" />
            <div className="flex justify-between items-stretch">
              <div className="flex items-stretch gap-[6px]">
                {/* <Button
                  variant="outlined"
                  className="!border-primary !text-primary capitalize"
                  startIcon={<FavoriteBorderOutlined />}
                  size="small"
                >
                  {"1k"}
                </Button> */}
                <Button
                  variant="outlined"
                  className="!border-primary !text-primary capitalize !rounded-lg !py-1"
                  startIcon={<ShareOutlined />}
                  size="small"
                  onClick={handleShareClick}
                >
                  Chia sẻ
                </Button>
              </div>
              <div className="rounded-lg px-3 py-1 text-sm bg-primary text-white uppercase  flex items-center">
                {PROJECT_STATUS[status]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareDialog open={open} handleClose={handleClose} link={projectLink} />
    </div>
  );
};

export default ProjectItem;
