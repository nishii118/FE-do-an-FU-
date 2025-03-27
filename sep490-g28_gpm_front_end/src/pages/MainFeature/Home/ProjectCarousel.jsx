import {
  ArrowBack,
  ArrowBackIos,
  ArrowForward,
  ArrowForwardIos,
} from "@mui/icons-material";
import React from "react";
import Slider from "react-slick";
import { ProjectItem } from "../../../components";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../../../components/Button/Arrow";

const  ProjectCarousel = ({ data }) => {
  const navigate = useNavigate();

  const settings = {
    infinite: true,
    speed: 900,
    dot: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    rows: 2,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  const onViewMore = () => {
    navigate("/du-an");
  };
  return (
    <div className="max-w-full overflow-hidden">
      <div className="bg-[#FEFAF9] py-[45px] lg:px-0 px-4 shadow-lg">
        <div className="container mx-auto md:flex items-center justify-between">
          <div className="lg:text-3xl text-xl text-primary flex flex-col gap-2">
            <span className="font-medium">Các dự án đang góp lẻ</span>
            <h3 className="font-bold uppercase">
              từ 1000đ triệu người chung tay nghìn trường có ngay
            </h3>
          </div>
          <button
            className="border border-primary text-primary fill-primary bg-white px-6 py-[10px] flex gap-2 items-center rounded-xl font-semibold"
            onClick={onViewMore}
          >
            <span>Xem ngay</span>
            <ArrowForward />
          </button>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <Slider {...settings} className="project-slider slider-container">
          {data?.map((item) => (
            <ProjectItem key={item.id} data={item} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProjectCarousel;
