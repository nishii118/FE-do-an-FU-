import React from "react";
import Slider from "react-slick";
import { BackgroundCard, CampaignItem } from "../../../components";

const CampaignCarousel = ({ data }) => {
  const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="max-w-full overflow-hidden">
      <BackgroundCard
        title="CÁC HẠNG MỤC CÔNG TRÌNH CHÍNH SỨC MẠNH 2000 SẼ THỰC HIỆN"
        variant="secondary"
      />
      <div className="container mx-auto py-12">
        <Slider {...settings}>
          {data?.map((item) => (
            <CampaignItem key={item.id} data={item} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CampaignCarousel;
