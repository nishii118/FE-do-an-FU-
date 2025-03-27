import React from "react";
import Slider from "react-slick";
import { TeamMemberItem } from "../../../components";

const TeamMember = ({ data }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };
  return (
    <div className="max-w-full overflow-hidden">
      <div>
        <div className="flex items-center gap-[28px]">
          <hr className="flex-1 border-secondary" />
          <span className="uppercase font-bold lg:text-5xl text-3xl text-gradient-1">
            MEET OUR TEAM
          </span>
          <hr className="flex-1 border-secondary" />
        </div>
        <p className="text-gradient-1 lg:text-4xl text-2xl  text-center mt-2">
          NHÀ SÁNG LẬP & HỘI ĐỒNG CỐ VẤN
        </p>
      </div>
      <div className="container mx-auto py-12">
        <Slider {...settings}>
          {data?.map((item) => (
            <TeamMemberItem key={item.id} data={item} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TeamMember;
