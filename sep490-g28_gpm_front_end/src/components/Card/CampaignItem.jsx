import React from "react";
import { Button, Grid } from "@mui/material";
import { LinearCardTag } from "../Tag";
import { ArrowForward } from "@mui/icons-material";
import HomeLogo from "../../assets/images/home-logo.png";
import { useNavigate } from "react-router-dom";
import { convertImage } from "../../utils/populate";

const CampaignItem = ({ data }) => {
  const navigate = useNavigate();
  const { id, title, description, thumbnailUrl, slug } = data ?? {};

  const onClickItem = () => {
    navigate("/gop-le/" + slug);
  };

  return (
    <div className="px-5">
      <Grid container className="p-10 bg-[#181818] lg:rounded-[60px] rounded-2xl">
        <Grid item md={6} className="min-h-[330px]">
          <LinearCardTag imgUrl={HomeLogo} label="DỰ ÁN ĐANG THỰC HIỆN" />
          <p className="mt-6 mb-3 lg:text-4xl font-bold text-gradient-2 ">
            {title}
          </p>
          {description && (
            <p className="sm:text-sm lg:text-base font-normal mb-6 text-white text-justify min-h-[150px]">
              {description}
            </p>
          )}
          <Button
            variant="outlined"
            className="!border-primary !text-primary capitalize"
            endIcon={<ArrowForward />}
            size="large"
            onClick={onClickItem}
          >
            Xem Thêm
          </Button>
        </Grid>
        <Grid item md={6} className="lg:pl-3">
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full lg:h-[400px] rounded-2xl object-cover lg:rounded-[40px]"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CampaignItem;
