import React, { useMemo } from "react";
import Slider from "react-slick";
import { PROJECTS } from "../../../utils/mocks";
import { ProjectItem } from "../../../components";
import { useFetchDataFilter } from "../../../utils/hooks";
import { fetchListFinishedProjectsService } from "../../../services/PublicService";
import { convertFireBaseImage } from "../../../utils/populate";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";

const FinishedProject = () => {
  const navigate = useNavigate();

  const { data: finishedProjects, isLoading: finishedProjectsLoading } =
    useFetchDataFilter({
      fnc: () => fetchListFinishedProjectsService(),
    });

  const convertFinishedProjects = useMemo(() => {
    return finishedProjects.map((project) => ({
      ...project,
      id: project.project_id,
      location: `${project.ward}-${project.district}-${project.province}`,
      price: project.total_budget,
      goal: project.amount_needed_to_raise,
      totalDonate: project.totalDonation,
      thumbnailUrl: convertFireBaseImage(project.images[0]?.image),
    }));
  }, [finishedProjects]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
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
    <div className="max-w-full overflow-hidden ">
      <div className="container mx-auto my-[60px]">
        <div className="flex items-center justify-between gap-2 bg-[#FEFAF9]">
          <div className="uppercase font-bold text-lg sm:text-4xl px-2">
            Các Dự Án Đã Hoàn Thành
          </div>
          <button
            className="border border-primary rounded-lg lg:px-6 py-2 font-medium text-lg text-primary"
            onClick={() => {
              navigate(routes.homeProjects);
            }}
          >
            Khám phá ngay
          </button>
        </div>
        <div className="py-4 sm:py-12 max-w-full">
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

export default FinishedProject;
