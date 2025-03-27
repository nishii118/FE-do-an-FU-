import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { ShareOutlined } from "@mui/icons-material";
import {} from "../../utils/const";
import { convertImage } from "../../utils/populate";
import { useNavigate } from "react-router-dom";
import ShareDialog from "../Dialog/ShareDialog";
import { BASE_URL_FE } from "../../config";

const ChallengeCard = ({ data }) => {
  const navigate = useNavigate();
  const {
    createdBy,
    accountCode,
    challenge_id,
    title,
    goal,
    total_donation,
    finished_at,
    thumbnail,
    slug,
  } = data ?? {};
  const [open, setOpen] = useState(false);

  const calculateRemainingDays = (finishedAt) => {
    const now = new Date();
    const finished = new Date(finishedAt);

    // Set the time part of both 'now' and 'finished' to midnight to compare only the date
    now.setHours(0, 0, 0, 0);
    finished.setHours(0, 0, 0, 0);

    if (finished < now) {
      return "Đã kết thúc";
    }

    const diffTime = Math.abs(finished - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return "Còn " + diffDays + " ngày";
  };

  const getPrice = (data) => {
    if (!data) return 0;
    if (data === 0) return 0;
    return new Intl.NumberFormat("vi-VN").format(data);
  };

  const handleClick = () => {
    navigate(`/thu-thach/${slug}`);
  };

  const challengeLink = BASE_URL_FE + `/thu-thach/${slug}`;

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareClick = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <div className="p-5 max-w-full box-border">
      <div
        className="border border-secondary p-3 rounded-[20px] hover:scale-105 transition duration-300 w-full"
        onClick={handleClick}
      >
        <img
          src={convertImage(thumbnail)}
          alt=""
          className="h-[152px] w-full object-cover rounded-[20px]"
        />
        <div className="flex flex-col gap-[7px] mt-[14px]">
          <Tooltip title={title} arrow>
            <h3 className="font-bold truncate h-[24px] leading-[24px]">
              {title}
            </h3>
          </Tooltip>
          {createdBy && (
            <Tooltip title={createdBy} placement="top">
              <p className="truncate">
                <b>Người tạo:</b> {createdBy}
              </p>
            </Tooltip>
          )}
          <p>
            <b>Mục tiêu:</b> {getPrice(goal)} VND
          </p>
          <p>
            <b>Hiện tại:</b> {getPrice(total_donation)} VND
          </p>
          <hr className="border-primary" />
          <div className="flex  justify-between items-stretch">
            <div className="flex gap-[6px]">
              <Button
                variant="outlined"
                className="!border-primary !text-primary capitalize"
                startIcon={<ShareOutlined />}
                size="small"
                onClick={handleShareClick}
              >
                Chia sẻ
              </Button>
            </div>
            <div className="rounded-lg px-3 py-1 text-sm bg-primary text-white uppercase flex items-center">
              {calculateRemainingDays(finished_at)}
            </div>
          </div>
        </div>
      </div>
      <ShareDialog open={open} handleClose={handleClose} link={challengeLink} />
    </div>
  );
};

export default ChallengeCard;
