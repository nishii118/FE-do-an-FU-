import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ChallengeCard from "../../../components/Card/ChallengeCard";
import { NextArrow, PrevArrow } from "../../../components/Button/Arrow";
import { ArrowForward } from "@mui/icons-material";
import { fetchTopChallengesService } from "../../../services/ChallengeService";
import { toast } from "react-toastify";
import { routes } from "../../../config";
import { useNavigate } from "react-router-dom";

const ChallengesSlider = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const numberChallenges = 10;
  const navigate = useNavigate();

  const fetchTopChallenges = async () => {
    setLoading(true);
    try {
      const data = await fetchTopChallengesService(numberChallenges);
      const convertChallenges = data.map((item) => ({
        ...item,
        createdBy: item.created_by?.fullname ?? null,
        accountCode: item.created_by?.code ?? null,
      }));
      setChallenges(convertChallenges);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu thử thách!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopChallenges();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleForward = () => {
    navigate("/thu-thach");
  };

  if (challenges.length === 0) return <div></div>;

  return (
    <div className="max-w-full overflow-hidden">
      <div className="bg-[#FEFAF9] lg:py-[45px] py-[20px] lg:px-0 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="lg:text-3xl text-2xl text-primary">
            <h3 className="font-bold uppercase">CÁC THỬ THÁCH TIÊU BIỂU</h3>
          </div>
          <button
            className="border border-primary text-primary fill-primary bg-white px-6 lg:py-[10px] flex gap-2 items-center rounded-xl font-semibold"
            onClick={handleForward}
          >
            <span>Xem thêm</span>
            <ArrowForward />
          </button>
        </div>
      </div>
      <div className="container  mx-auto py-12">
        <Slider {...settings}>
          {challenges?.map((challenge) => (
            <ChallengeCard key={challenge.challenge_id} data={challenge} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ChallengesSlider;
