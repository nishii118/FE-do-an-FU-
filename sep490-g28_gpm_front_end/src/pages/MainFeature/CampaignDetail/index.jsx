import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  BackgroundCard,
  CampaignCard,
  LinearCardTag,
} from "../../../components";
import { Achievement, FinishedProject } from "../Common";
import { Button, Grid } from "@mui/material";
import HomeLogo from "../../../assets/images/home-logo.png";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCampaignService,
  fetchListProjectsByCampaignIdService,
} from "../../../services/PublicService";
import { convertImage, getCampaignId } from "./../../../utils/populate";
import { routes } from "../../../config";
import defaultImage from "../../../assets/images/sucmanh2000.png";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useFetchData } from "../../../utils/hooks";
import { fetchCampaignAchivementService } from "../../../services/StatisticService";

const CampaignDetail = () => {
  const { slug } = useParams();
  const id = getCampaignId(slug);
  const [page, setPage] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [campaign, setCampaign] = useState({});
  const [achievement, setAchievement] = useState({});
  const navigate = useNavigate();
  const observer = useRef();

  const fetchAchievementData = async () => {
    try {
      setLoading(true);
      const response = await fetchCampaignAchivementService(id);
      setAchievement(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchProjectData = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const response = await fetchListProjectsByCampaignIdService(id, page);
        const newProjects = response.content?.map((project) => ({
          ...project,
          id: project.project_id,
          address: `${project.address} - ${project.ward} - ${project.district} - ${project.province} `,
          totalBudget: project.total_budget,
          target: project.amount_needed_to_raise,
          constructions: project.constructions?.map(
            (item) =>
              `${item.title}: ${item.quantity} ${item.unit} (${item.note})`
          ),
        }));
        setProjects((prevProjects) => [...prevProjects, ...newProjects]);
        setHasMore(response.content.length > 0); // Check if there are more projects to load
        setLoading(false);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
        console.log(error);
        setLoading(false);
      }
    },
    [id]
  );

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const response = await fetchCampaignService(id);
      const convertCampaign = {
        title: response.title,
        description: response.description,
        thumbnail: convertImage(response.thumbnail),
      };
      setCampaign(convertCampaign);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset the projects list and page number when the id changes
    setProjects([]);
    setPage(0);
    setHasMore(true); // Reset the hasMore flag for the new campaign
  }, [id]);

  useEffect(() => {
    fetchProjectData(page);
  }, [fetchProjectData, page]);

  useEffect(() => {
    fetchAchievementData();
    fetchCampaignData();
  }, [id]);

  const lastProjectElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <Helmet>
        <title>{campaign.title || "Góp lẻ"}</title>
        <meta
          name="description"
          content={
            campaign.description ||
            "Dự án Sức mạnh 2000 đang thực hiện, nhằm giúp đỡ những hoàn cảnh khó khăn, trẻ em vùng cao."
          }
        />
        <meta property="og:title" content={campaign.title || "Góp lẻ"} />
        <meta
          property="og:description"
          content={
            campaign.description ||
            "Dự án Sức mạnh 2000 đang thực hiện, nhằm giúp đỡ những hoàn cảnh khó khăn, trẻ em vùng cao."
          }
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Grid
        container
        className="container m-auto py-[65px]"
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Grid item xs={12} md={7}>
          <div className="px-3">
            <LinearCardTag imgUrl={HomeLogo} label="sucmanh2000" />
            <p className="mt-6 mb-3 text-[32px] font-bold leading-[48px]">
              {campaign.title}
            </p>
            <p className="text-base font-normal mb-6 text-justify">
              {campaign.description}
            </p>
            <Button
              variant="outlined"
              className="!border-primary !text-primary capitalize"
              endIcon={<ArrowForward />}
              size="large"
              onClick={() => {
                navigate(routes.home);
              }}
            >
              Khám phá thêm hệ sinh thái
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={5}>
          <div className="px-3 mt-2 lg:mt-0">
            <img
              src={campaign.thumbnail}
              alt=""
              className="h-[266px] w-full object-cover rounded-2xl"
            />
          </div>
        </Grid>
      </Grid>

      <Achievement data={achievement} />

      <div className="relative w-full h-[311px] overflow-hidden">
        <BackgroundCard
          className="absolute top-1/2 -translate-y-1/2 z-10 w-full"
          title="Các công trình đang nhận quyên góp"
          variant="primary"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-4 w-[150%] h-[114px] opacity-[17%] rotate-[-6.6deg]"></div>
      </div>

      <div className="container mx-auto flex flex-col gap-6 sm:gap-[60px] mt-[60px]">
        {projects?.map((project, index) => {
          if (projects.length === index + 1) {
            return (
              <div ref={lastProjectElementRef} key={project.id}>
                <CampaignCard data={project} />
              </div>
            );
          } else {
            return <CampaignCard key={project.id} data={project} />;
          }
        })}
        {loading && <p className="text-center">Đang tải...</p>}
      </div>

      <FinishedProject />
    </div>
  );
};

export default CampaignDetail;
