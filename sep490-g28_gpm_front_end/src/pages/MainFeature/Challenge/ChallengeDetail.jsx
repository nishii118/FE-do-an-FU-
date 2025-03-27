import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ShareDialog from "../../../components/Dialog/ShareDialog";
import { NewsBannerBreadcrumb } from "../Common";
import ProjectsDonationCard from "../../../components/Card/ProjectsDonationCard";
import { useParams } from "react-router-dom";
import { fetchChallengeDetailService } from "../../../services/ChallengeService";
import { formatDate, formatPrice } from "../../../utils/formart";
import { convertImage, getChallengeId } from "../../../utils/populate";
import { toast } from "react-toastify";
import ChallengeDonation from "./ChallengeDonation";
import { convertFireBaseImage } from "./../../../utils/populate";
import { Helmet } from "react-helmet";
import defaultImage from "../../../assets/images/sucmanh2000.png";
import UpdateChallengeDialog from "../../../components/Dialog/UpdateChallengeDialog";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ChallengeDetail = () => {
  const { slug } = useParams();

  const id = getChallengeId(slug);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // state to control UpdateChallengeDialog
  const [challenge, setChallenge] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchChallengeDetail = async () => {
    setLoading(true);
    await fetchChallengeDetailService(id)
      .then((response) => {
        const convertChallenge = {
          ...response,
          avatar: convertFireBaseImage(response.created_by?.avatar ?? null),
          id: response.challenge_id,
          challengeCode: response.challenge_code,
          finishedAt: response.finished_at,
          createdAt: formatDate(response.created_at),
          createdBy: response.created_by,
          totalDonation: response.total_donation ?? 0,
          goal: formatPrice(response.goal),
          projects: response.projects?.map((project) => ({
            ...project,
            id: project.project_id,
            title: project.title,
            target: project.amount_needed_to_raise,
          })),
        };
        setChallenge(convertChallenge);
        setProjects(convertChallenge.projects);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu thử thách");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChallengeDetail();
  }, [id]);

  const shareLink = window.location.href;

  const calculateRemainingDays = (finishedAt) => {
    const now = new Date();
    const finished = new Date(finishedAt);

    now.setHours(0, 0, 0, 0);
    finished.setHours(0, 0, 0, 0);

    if (finished < now) {
      return { text: "Đã kết thúc", isOngoing: false };
    }

    const diffTime = Math.abs(finished - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return { text: `Còn ${diffDays} ngày`, isOngoing: true };
  };

  const handleClickOpenShareDialog = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const handleClickOpenUpdateDialog = () => {
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = (success) => {
    setOpenUpdateDialog(false);
    if (success) {
      // If the update was successful, fetch the updated challenge details
      fetchChallengeDetail();
    }
  };
  const remainingDays = calculateRemainingDays(challenge?.finishedAt);

  const userCode = localStorage.getItem("userCode");
  const numericUserCode = userCode
    ? parseInt(userCode.replace(/^\D+/g, ""))
    : null;

  const isOwner = challenge?.createdBy?.account_id === numericUserCode;

  return (
    <div>
      <Helmet>
        <title>{challenge?.title || "Thử thách SM2000"}</title>
        <meta
          name="description"
          content="Thử thách đồng hành cùng Sức mạnh 2000."
        />
        <meta
          property="og:title"
          content={challenge?.title || "Thử thách SM2000"}
        />
        <meta
          property="og:description"
          content="Thử thách đồng hành cùng Sức mạnh 2000."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <NewsBannerBreadcrumb
        data={[{ title: "Chi tiết" }]}
        pageTitle={challenge?.title}
      ></NewsBannerBreadcrumb>
      <div className="flex justify-center p-6 w-full">
        <Grid
          container
          className="container m-auto py-[50px]"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Grid
            item
            xs={12}
            md={remainingDays.isOngoing ? 7 : 12}
            container
            className="lg:pr-4"
          >
            <div className="border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden w-full">
              <Grid item xs={12} lg={12}>
                <div className="relative">
                  <div className="w-full">
                    <Zoom>
                      <img
                        src={convertImage(challenge?.thumbnail)}
                        alt="Challenge"
                        className="h-[335px] w-full object-contain"
                      />
                    </Zoom>
                  </div>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: "4px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {remainingDays.text}
                  </Typography>
                  <div className="absolute bottom-2 right-2">
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      sx={{
                        borderRadius: "16px",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "none",
                        color: "white",
                      }}
                      className="hover:!border-primary"
                      onClick={handleClickOpenShareDialog}
                    >
                      Chia sẻ
                    </Button>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} lg={12} container className="bg-[#FFFAF7] p-4">
                <Grid container gap={2} item xs={12} lg={6}>
                  <Grid item xs={3} lg={3}>
                    <div className="flex items-center h-full">
                      <Avatar
                        alt={challenge?.createdBy?.fullname}
                        src={challenge?.avatar}
                        sx={{ width: 64, height: 64, margin: "auto" }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={8} lg={8}>
                    <p className="my-1">Người tạo thử thách</p>
                    <p className="my-1 text-xl font-semibold">
                      {challenge?.createdBy?.fullname}
                    </p>
                    <p className="my-1">Ngày bắt đầu: {challenge?.createdAt}</p>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="mt-4 flex justify-between gap-4">
                    <div className="bg-[#FFE8D7] rounded-2xl p-4 w-1/2 text-center">
                      <Typography variant="body2" color="textSecondary">
                        Số tiền đạt được
                      </Typography>
                      <p className="font-semibold text-primary">
                        {formatPrice(challenge?.totalDonation)} VND
                      </p>
                    </div>
                    <div className="bg-[#FFE8D7] rounded-2xl p-4 w-1/2 text-center">
                      <Typography variant="body2" color="textSecondary">
                        Mục tiêu thử thách
                      </Typography>
                      <p className="font-semibold text-primary">
                        {challenge?.goal} VND
                      </p>
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={12} className="text-center mt-4">
                {isOwner && (
                  <div
                    className="italic font-base hover:underline text-primary"
                    onClick={handleClickOpenUpdateDialog}
                  >
                    Cập nhật thông tin cho thử thách
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <div className="p-4">
                  <Typography variant="h6">{challenge?.content}</Typography>
                </div>
              </Grid>
            </div>
          </Grid>
          {remainingDays.isOngoing && (
            <Grid item xs={12} md={5}>
              <div className="sticky top-4">
                <div className="border-2 rounded-2xl shadow-lg">
                  {projects.length > 0 ? (
                    <ProjectsDonationCard
                      projects={projects}
                      challengeCode={challenge?.challengeCode}
                    ></ProjectsDonationCard>
                  ) : (
                    <div className="h-full w-full flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          )}
          <Grid item xs={12}>
            <div className="mt-[75px] ">
              <div className="flex items-center gap-[28px]">
                <hr className="flex-1 border-secondary" />
                <span className="uppercase font-bold lg:text-3xl text-2xl text-[#EF8C7F]">
                  Cập nhật sao kê thử thách
                </span>
                <hr className="flex-1 border-secondary" />
              </div>
              <div className="py-[30px]">
                <ChallengeDonation id={id} setTotalDonation={setChallenge} />
              </div>
            </div>
          </Grid>
        </Grid>

        <ShareDialog
          open={openShareDialog}
          handleClose={handleCloseShareDialog}
          link={shareLink}
        />
        {openUpdateDialog && (
          <UpdateChallengeDialog
            open={openUpdateDialog}
            handleClose={handleCloseUpdateDialog}
            challengeId={id} // pass challenge object to UpdateChallengeDialog
          />
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;
