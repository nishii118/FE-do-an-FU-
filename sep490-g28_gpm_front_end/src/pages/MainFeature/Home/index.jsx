import React, { useMemo, useState } from "react";
import { Chip, CircularProgress, LinearProgress } from "@mui/material";
import Slider from "react-slick";
import MainBanner from "./MainBanner";
import RegularCharity from "./RegularCharity";
import CampaignCarousel from "./CampaignCarousel";
import ProjectCarousel from "./ProjectCarousel";
import TeamMember from "./TeamMember";
import Banner2 from "../../../assets/images/banner_2.jpg";
import { PROJECTS, TEAMS } from "../../../utils/mocks";
import { ProjectItem } from "../../../components";
import {
  fetchListCampaignsService,
  fetchListFinishedProjectsService,
  fetchListOnGoingProjectsService,
} from "../../../services/PublicService";
import { convertFireBaseImage, convertImage } from "./../../../utils/populate";
import { Achievement } from "../Common";
import { useFetchData, useFetchDataFilter } from "../../../utils/hooks";
import { NextArrow, PrevArrow } from "../../../components/Button/Arrow";
import FundraisingSection from "../Challenge/FundraisingSection";
import { Helmet } from "react-helmet";
import defaultImage from "../../../assets/images/sucmanh2000.png";
import ChallengesSlider from "./../Ranking/ChallengesSlider";
import { fetchCommonAchivementService } from "../../../services/StatisticService";

const PROJECT_TAGS = ["Dự án 2024", "Dự án 2023", "Dự án 2022", "Dự án 2021"];
const PROJECT_YEARS = [2024, 2023, 2022, 2021];

const HomePage = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
  const [activeProjectTag, setActiveProjectTag] = useState(0);

  const { data: campaigns, isLoading: campaignsLoading } = useFetchData({
    fnc: fetchListCampaignsService,
  });

  const { data: achievement, idLoading: achievementLoading } = useFetchData({
    fnc: fetchCommonAchivementService,
  });

  const { data: onGoingProjects, isLoading: onGoingProjectsLoading } =
    useFetchDataFilter({
      fnc: fetchListOnGoingProjectsService,
    });

  const { data: finishedProjects, isLoading: finishedProjectsLoading } =
    useFetchDataFilter({
      fnc: () =>
        fetchListFinishedProjectsService(PROJECT_YEARS[activeProjectTag]),
      dependencies: [activeProjectTag],
    });

  const onChangeProjectTag = (index) => {
    setActiveProjectTag(index);
  };

  const convertCampaigns = useMemo(() => {
    return campaigns.map((campaign) => ({
      ...campaign,
      id: campaign.campaign_id,
      thumbnailUrl: convertImage(campaign.thumbnail),
    }));
  }, [campaigns]);

  const convertOnGoingProjects = useMemo(() => {
    return onGoingProjects.map((project) => ({
      ...project,
      id: project.project_id,
      location: `${project.ward}-${project.district}-${project.province}`,
      price: project.total_budget,
      goal: project.amount_needed_to_raise,
      totalDonation: project.totalDonation,
      thumbnailUrl: convertImage(project.images[0]?.image),
    }));
  }, [onGoingProjects]);

  const convertFinishedProjects = useMemo(() => {
    return finishedProjects.map((project) => ({
      ...project,
      id: project.project_id,
      location: `${project.ward}-${project.district}-${project.province}`,
      price: project.total_budget,
      goal: project.amount_needed_to_raise,
      totalDonate: project.totalDonation,
      thumbnailUrl: convertImage(project.images[0]?.image),
    }));
  }, [finishedProjects]);

  return (
    <div>
      <Helmet>
        <title>Sức Mạnh 2000</title>
        <meta
          name="description"
          content="Sức mạnh 2000 - Tiền lẻ mỗi ngày. Triệu người chung tay xây nghìn trường mới."
        />
        <meta name="keywords" content="sucmanh2000,gople,thiennguyen" />

        <meta property="og:title" content="Sức Mạnh 2000" />
        <meta
          property="og:description"
          content="Sức mạnh 2000 - Tiền lẻ mỗi ngày. Triệu người chung tay xây nghìn trường mới."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content="https://fpt.sucmanh2000.com" />
        <meta property="og:type" content="website" />
      </Helmet>
      <MainBanner />
      <div className="container m-auto flex lg:flex-row flex-col gap-[27px] lg:px-0 px-4 pt-[48px] pb-[95px]">
        <div className="lg:w-[571px] w-full rounded-[40px] overflow-hidden">
          <img src={Banner2} alt="" className="w-full h-full" />
        </div>
        <div className="flex-1 py-[14px] text-lg pl-3 text-justify">
          Dự án xuất phát từ suy nghĩ chỉ với 2.000 đồng mỗi ngày, tuy giá trị
          khiêm tốn nhưng nếu nhiều người cùng chung tay sẽ tạo nên sức mạnh phi
          thường.
          <br />
          <br />
          Chúng ta thử làm một phép tính. Nếu mỗi người đóng góp 2000 đồng mỗi
          ngày, cứ 100.000 người tham gia thì mỗi ngày sẽ có 200 triệu đồng (gần
          bằng 1 điểm trường ) sau một năm sẽ có 73 tỷ đồng được quyên góp, số
          tiền này đủ để xây 292 điểm trường. Tương tự, nếu có 1.000.000 người
          tham gia thì số tiền quyên góp được sẽ lên đến hơn 500 tỷ. Toàn bộ số
          tiền được dùng xây trường, xây cầu, xây nhà hạnh phúc và các hoạt động
          thiện nguyện khác sẽ giúp đỡ được đến 20.000 trẻ em vùng cao trên cả
          nước.
          <br />
          <br />
          Dự án Nuôi Em cũng do Hoàng Hoa Trung sáng lập, điều hành đã lập kỳ
          tích với việc vận động gần 20.000 người tham gia nuôi cơm 20.000 bé.
          <br />
          <br />
          Do đó, Viển Vông nhưng có Cơ Sở. Khiêm Tốn nhưng ẩn chứa sự Phi
          Thường.
        </div>
      </div>
      {/* <RegularCharity /> */}
      <FundraisingSection></FundraisingSection>
      <Achievement data={achievement} />
      <CampaignCarousel data={convertCampaigns} />
      <ProjectCarousel data={convertOnGoingProjects} />
      <ChallengesSlider></ChallengesSlider>
      <TeamMember data={TEAMS} />

      {/* <AmbassadorSlider></AmbassadorSlider> */}

      <div className="container mx-auto overflow-hidden">
        <div className="flex items-center lg:flex-row flex-col lg:gap-0 gap-6 justify-between lg:px-0 px-4">
          <div>
            <div className="uppercase font-bold lg:text-4xl text-2xl lg:text-left text-center">
              Các Dự Án Đã Hoàn Thành
            </div>
            <div className="mt-6 flex gap-2.5">
              {PROJECT_TAGS.map((item, index) => (
                <button key={item} onClick={() => onChangeProjectTag(index)}>
                  <Chip
                    variant={
                      activeProjectTag === index ? "variant" : "outlined"
                    }
                    label={item}
                  />
                </button>
              ))}
            </div>
          </div>
          <button className="border border-primary rounded-lg px-6 py-2 font-medium text-lg text-primary">
            Khám phá ngay
          </button>
        </div>
        <div className="mt-6 lg:px-0 px-4">
          <LinearProgress
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background: "#F26522",
              },
            }}
            variant="determinate"
            value={100}
          />
        </div>
        <div className="py-12">
          {finishedProjectsLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <Slider {...settings}>
              {convertFinishedProjects?.map((item) => (
                <ProjectItem key={item.id} data={item} />
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
