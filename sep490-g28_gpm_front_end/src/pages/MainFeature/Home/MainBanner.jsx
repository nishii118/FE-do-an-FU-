import React from "react";
import { Button, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import HomeLogo from "../../../assets/images/home-logo.png";
import { LinearCardTag } from "../../../components/Tag";
import Slider from "react-slick";

// Importing banner images
import banner1 from "../../../assets/images/banner1.webp";
import banner2 from "../../../assets/images/banner2.jpg";
import banner3 from "../../../assets/images/banner3.webp";
import banner4 from "../../../assets/images/banner4.jpg";
import banner5 from "../../../assets/images/banner5.jpg";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";

const items = {
  label: "sucmanh2000",
  title:
    "ĐỂ TRẺ EM VÙNG CAO ĐƯỢC TIẾP CẬN GIÁO DỤC TỐT HƠN VỚI HƠN 300 CÔNG TRÌNH ĐÃ XÂY DỰNG VÀ HƠN THẾ NỮA",
  description:
    "Từ năm 2009 đến T6/2020, dự án Ánh Sáng Núi Rừng đã xây dựng được 29 điểm trường trên cả nước. Tiếp nối thành công của dự án và Hệ Sinh Thái Nuôi Em, từ tháng 2/2020, dự án SỨC MẠNH 2000 đã được khởi xướng. Theo đó, thêm 182 công trình Điểm Trường, Nhà Nội Trú, Nhà Hạnh Phúc đã được khởi công và đưa vào sử dụng hoàn thiện trong năm 2020-2021.",
  images: [
    {
      src: banner1,
      alt: "Hình ảnh dự án SỨC MẠNH 2000",
    },
    {
      src: banner2,
      alt: "Hoạt động dự án Nuôi Em",
    },
    {
      src: banner3,
      alt: "Công trình Điểm Trường",
    },
    {
      src: banner4,
      alt: "Hoạt động xây dựng công trình",
    },
    {
      src: banner5,
      alt: "Sao kê tháng 7 dự án Nuôi Em",
    },
  ],
};

const MainBanner = () => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 3,
    slidesToScroll: 1,
    dotsClass: "custom-dot-class",
    centerMode: true,
  };

  return (
    <Grid
      container
      className="container m-auto lg:py-[65px] lg:px-0 p-4"
      justifyContent="space-between"
      alignItems="center"
      component="section"
      aria-label="Main Banner Section"
    >
      <Grid item md={4} component="article" aria-label="Project Information">
        <LinearCardTag imgUrl={HomeLogo} label={items.label} />
        <h1 className="mt-6 mb-3 font-bold lg:leading-[48px] leading-[32px] lg:text-[32px] text-2xl">
          {items.title}
        </h1>
        <p className="text-base font-normal mb-6 text-justify">
          {items.description}
        </p>
        <Button
          variant="outlined"
          className="!border-primary !text-primary capitalize"
          endIcon={<ArrowForward />}
          size="large"
          aria-label="Learn More About the Project"
          onClick={() => {
            navigate(routes.aboutUs);
          }}
        >
          Tìm hiểu thêm
        </Button>
      </Grid>
      <Grid item md={7} className="max-[1024px]:hidden block">
        <Slider
          {...settings}
          className="main-banner-slider"
          aria-label="Image Slider"
        >
          {items.images?.map((image, index) => (
            <div key={index} className="main-banner-slider-item-wrapper">
              <div className="rounded-[34px] relative main-banner-slider-item">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-[34px] absolute blur-sm main-banner-slider-item-blur-img"
                />
                <img
                  src={image.src}
                  alt={image.alt}
                  className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-[34px] absolute main-banner-slider-item-img"
                />
              </div>
            </div>
          ))}
        </Slider>
      </Grid>
    </Grid>
  );
};

export default MainBanner;
