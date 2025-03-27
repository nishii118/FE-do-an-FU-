import React, { useEffect, useState } from "react";
import UserBanner from "../../../assets/images/user-banner.jpg";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Pagination,
  Tab,
  Tabs,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import ChallengeCard from "../../../components/Card/ChallengeCard";
import CreateChallengeDialog from "../../../components/Dialog/CreateChallengeDialog";
import ProjectsDonationDialog from "../../../components/Dialog/ProjectsDonationDialog";
import { toast } from "react-toastify";
import { convertFireBaseImage } from "./../../../utils/populate";
import {
  fetchActiveChallengeService,
  fetchExpiredChallengeService,
} from "../../../services/ChallengeService";
import { formatPrice } from "../../../utils/formart";
import ReferDonationTable from "./ReferDonationTable";
import { fetchUserProfileService } from "../../../services/ProfileService";
import { routes } from "../../../config";
import { Helmet } from "react-helmet";

const ITEMS_PER_PAGE = 6;

const ProfileAction = ({
  handleOpenDialog,
  handleOpenDonationDialog,
  profile,
  isUser,
}) => {
  return (
    <div className="w-full lg:w-[300px]">
      <div className="absolute -top-[150px] lg:-top-[90px] w-full lg:w-[300px] flex items-center justify-center">
        <Avatar
          sx={{ width: 200, height: 200 }}
          alt={profile?.fullname}
          src={convertFireBaseImage(profile?.avatar)}
        />
      </div>
      <div className="flex flex-col gap-4 mt-[100px] lg:mt-[150px]">
        {isUser && (
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            sx={{
              borderRadius: "16px",
              fontWeight: "bold",
            }}
            className="!border-primary !text-black"
            onClick={handleOpenDialog}
          >
            Tạo thử thách
          </Button>
        )}
        <Button
          className="rounded-xl !border-primary !bg-primary"
          variant="contained"
          sx={{
            borderRadius: "16px",
            fontWeight: "bold",
          }}
          endIcon={<ChevronRight />}
          onClick={handleOpenDonationDialog}
        >
          Quyên góp ngay
        </Button>
      </div>
    </div>
  );
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel({ value, index, data, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          {data.length === 0 ? (
            <div className="h-[300px] bg-gray-100 border-2 w-full rounded-lg flex justify-center items-center text-2xl font-medium">
              Hiện chưa có thử thách nào
            </div> // Render this when data is not available
          ) : (
            <div>
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
                {data.map((item) => (
                  <div key={item.id} className="w-full max-w-full mx-auto">
                    <ChallengeCard data={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const UserProfile = () => {
  const { userCode } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const [profile, setProfile] = useState(undefined);

  const [activeChallenges, setActiveChallenges] = useState([]);
  const [expiredChallenges, setExpiredChallenges] = useState([]);

  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [totalActive, setTotalActive] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);

  const [params, setParams] = useState({
    size: ITEMS_PER_PAGE,
    page: 0,
    account_code: userCode,
  });

  const fetchUserProfileData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserProfileService(userCode);
      const profile = {
        ...data,
        referCode: data.refer_code,
        donationCount: data.donated_count,
        totalDonation: data.total_donated ?? 0,
        totalRefer: data.total_donation_refer ?? 0,
        totalReferCount: data.total_donation_refer_count ?? 0,
      };
      setLoading(false);
      setProfile(profile);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.error?.code === "1011") {
        navigate(routes.notFound);
        toast.warn("Trang không tồn tại");
      } else {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu người dùng!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveChallenge = async () => {
    await fetchActiveChallengeService({ params })
      .then((response) => {
        setActiveChallenges(response?.content);
        setTotalActive(response?.total);
      })
      .catch((error) => {
        toast.error("Đã có lỗi khi tải dữ liệu thử thách!");
        console.log(error);
      });
  };

  const fetchExpiredChallenge = async () => {
    await fetchExpiredChallengeService({ params })
      .then((response) => {
        setExpiredChallenges(response?.content);
        setTotalExpired(response?.total);
      })
      .catch((error) => {
        toast.error("Đã có lỗi khi tải dữ liệu thử thách!");
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserProfileData();
    if (userCode === localStorage.getItem("userCode")) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [userCode]);

  useEffect(() => {
    fetchExpiredChallenge();
  }, [userCode, params]);

  useEffect(() => {
    fetchActiveChallenge();
  }, [userCode, refresh, params]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setParams((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (event, value) => {
    setParams((prev) => ({ ...prev, page: value - 1 }));
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRefresh(!refresh);
  };

  const handleOpenDonationDialog = () => {
    setDonationDialogOpen(true);
  };

  const handleCloseDonationDialog = () => {
    setDonationDialogOpen(false);
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>{profile?.fullname || "Đại sứ SM2000"}</title>
        <meta
          name="description"
          content="Đại sứ đồng hành cùng Sức mạnh 2000."
        />

        <meta
          property="og:title"
          content={profile?.fullname || "Đại sứ SM2000"}
        />
        <meta
          property="og:description"
          content="Đại sứ đồng hành cùng Sức mạnh 2000."
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="w-full h-[300px]">
        <img src={UserBanner} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 lg:px-0 lg:py-10">
        <div className="relative flex lg:flex-row flex-col gap-10">
          <ProfileAction
            handleOpenDialog={handleOpenDialog}
            handleOpenDonationDialog={handleOpenDonationDialog}
            profile={profile}
            isUser={isUser}
          />
          <div className="flex-1">
            <Grid container justifyContent="space-between">
              <Grid item xs={12} lg={6}>
                <div className="">
                  <h3 className="lg:text-5xl text-4xl font-bold leading-tight lg:text-left text-center">
                    {profile?.fullname}
                  </h3>
                </div>
              </Grid>
              <Grid item xs={12} lg={5}>
                <div className="flex justify-between items-center lg:mt-0 mt-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(profile?.totalRefer)} VND
                    </div>
                    <div className="text-sm text-gray-600">
                      Cộng đồng của {profile?.fullname}
                    </div>
                  </div>
                  <div className="h-12 border-l border-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(profile?.totalReferCount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Số lượt quyên góp
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <p className="mt-5 lg:text-left text-center">
              Tiền lẻ của bạn có thể góp sức xây thêm hàng nghìn điểm trường để
              thắp sáng ước mơ học tập nơi vùng sâu núi cao, chấm dứt tình trạng
              phải dạy và học trong căn nhà sập xệ, dột nát
            </p>

            <div className="mt-10">
              <h4 className="text-gradient-1 lg:text-4xl text-3xl font-semibold leading-[150%] text-center h-11">
                Chiến dịch đồng hành gây quỹ
              </h4>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: "20px" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  allowScrollButtonsMobile
                  scrollButtons="auto"
                  sx={{
                    borderBottom: "1px solid #e8e8e8",
                    "& .MuiButtonBase-root": {
                      color: "#000",
                      fontWeight: 500,
                      fontSize: 16,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#F26522",
                    },
                  }}
                >
                  <Tab label="Đang thực hiện" {...a11yProps(0)} />
                  <Tab label="Đã kết thúc" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0} data={activeChallenges} />
              <CustomTabPanel
                value={value}
                index={1}
                data={expiredChallenges}
              />
              <div className="mt-10 flex justify-center">
                {value === 0 && (
                  <Pagination
                    count={Math.ceil(totalActive / ITEMS_PER_PAGE)}
                    page={params.page + 1}
                    onChange={handlePageChange}
                  />
                )}
                {value === 1 && (
                  <Pagination
                    count={Math.ceil(totalExpired / ITEMS_PER_PAGE)}
                    page={params.page + 1}
                    onChange={handlePageChange}
                  />
                )}
              </div>
            </div>

            <div className="mt-[75px] ">
              <div className="flex items-center gap-[28px]">
                <hr className="flex-1 border-secondary" />
                <span className="uppercase font-bold lg:text-3xl text-2xl text-[#EF8C7F]">
                  Cập nhật sao kê
                </span>
                <hr className="flex-1 border-secondary" />
              </div>
              <div className="py-[30px] max-w-[964px] w-full">
                <ReferDonationTable userCode={userCode} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateChallengeDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
      />
      <ProjectsDonationDialog
        open={donationDialogOpen}
        handleClose={handleCloseDonationDialog}
        referCode={profile?.referCode}
      />
    </div>
  );
};

export default UserProfile;
