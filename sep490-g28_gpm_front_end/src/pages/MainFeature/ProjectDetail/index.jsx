import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { routes } from "../../../config";
import { useParams } from "react-router-dom";
import {
  CalendarMonthOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { StatementTable } from "../../../components";
import { FinishedProject } from "../Common";
import Slider from "react-slick";
import {
  fetchProjectDetailService,
  fetchProjectSponsorsService,
  fetchProjectTrackingService,
} from "../../../services/PublicService";
import { PROJECT_STATUS } from "../../../utils/const";
import { formatDate, formatPrice } from "../../../utils/formart";
import {
  convertFireBaseImage,
  convertImage,
  getProjectId,
} from "../../../utils/populate";
import DonationCard from "../../../components/Card/DonationCard";
import NoImage from "../../../assets/images/no-image.png";
import { Helmet } from "react-helmet";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="p-6">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

const ImageSlider = ({ title = "", images }) => {
  const settings = {
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div>
      {title && (
        <div className="mb-4 text-center">
          <span className="lg:text-3xl text-lg font-semibold">{title}</span>
        </div>
      )}
      <div className="border border-gray-100 bg-gray-100 overflow-hidden p-2">
        <div className="border-2 border-white">
          {images?.length === 0 && (
            <img
              src={NoImage}
              alt=""
              className="lg:h-[267px] h-[200px] object-cover w-full rounded-xl"
            />
          )}
          {images?.length === 1 ? (
            <Zoom>
              <div className="lg:h-[267px] h-[200px] flex justify-center">
                <img src={images[0]} alt="" className="h-full object-cover" />
              </div>
            </Zoom>
          ) : (
            <Slider {...settings}>
              {images?.map((item, index) => (
                <Zoom>
                  <div className="lg:h-[267px] h-[200px] flex justify-center">
                    <img
                      key={index}
                      src={item}
                      alt=""
                      className="max-h-full h-auto w-auto object-cover"
                    />
                  </div>
                </Zoom>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const id = getProjectId(slug);
  const [project, setProject] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const projectDetailRef = useRef(null);
  const [value, setValue] = useState(0);
  const [sponsors, setSponsor] = useState([]);
  const [currentStatusImages, setCurrentStatusImages] = useState([]);
  const [completedImages, setCompletedImages] = useState([]);
  const [progressImages, setProgressImages] = useState([]);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const response = await fetchProjectDetailService(id);
      const project = {
        ...response,
        id: response.project_id,
        campaign: response.campaign,
        address: `${response.address} - ${response.ward} - ${response.district} - ${response.province} `,
        totalBudget: response.total_budget,
        target: response.amount_needed_to_raise,
        constructions: response.constructions?.map(
          (item) =>
            `${item.title}: ${item.quantity} ${item.unit} (${item.note})`
        ),
        imageUrls: response.images?.map((imageObj) =>
          convertImage(imageObj.image)
        ),
        createdAt: formatDate(response.created_at),
      };
      setProject(project);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSponsorData = async () => {
    setLoading(true);
    try {
      const response = await fetchProjectSponsorsService(id);
      const sponsors = response?.content?.map((sponsor) => sponsor);
      setSponsor(sponsors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const response = await fetchProjectTrackingService(id);
      // console.log(response);
      const currentStatus = response.find(
        (item) => item.title === "Hiện trạng"
      );
      const completed = response.find((item) => item.title === "Hoàn thiện");
      const progress = response.find((item) => item.title === "Tiến độ");

      setCurrentStatusImages(
        currentStatus?.imageUrls.map((item) => convertImage(item)) || []
      );
      setCompletedImages(
        completed?.imageUrls.map((item) => convertImage(item)) || []
      );
      setProgressImages(
        progress?.imageUrls.map((item) => convertImage(item)) || []
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorData();
    fetchTrackingData();
    fetchProjectData();
    // if (projectDetailRef.current) {
    //   projectDetailRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container mx-auto pt-[30px]" ref={projectDetailRef}>
      <Helmet>
        <title>{project?.title || "Chi tiết dự án"}</title>
        <meta
          name="description"
          content={project?.background || "Thông tin chi tiết về dự án."}
        />
        <meta
          name="keywords"
          content={`${project?.title}, dự án từ thiện, dự án cộng đồng`}
        />
        <meta
          property="og:title"
          content={project?.title || "Chi tiết dự án"}
        />
        {/* <meta
          property="og:description"
          content={project?.background || "Thông tin chi tiết về dự án."}
        /> */}
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
      </Helmet>

      <div className="flex lg:flex-row flex-col justify-between lg:gap-[90px] items-center ">
        <div className="flex flex-col gap-6 p-3 md:w-2/3">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href={routes.home}>
              Trang chủ
            </Link>
            <Typography className="text-primary">Dự án</Typography>
          </Breadcrumbs>
          <h3 className="font-bold lg:text-4xl text-base uppercase">
            {project?.title}
          </h3>
          <div className="flex items-center gap-[30px]">
            <div className="flex items-center gap-2">
              <PersonOutlineOutlined />
              <span>SUCMANH2000</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarMonthOutlined />
              <span>{project?.createdAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Chip label={project?.campaign?.title} color="primary" />
            <Chip label={PROJECT_STATUS[project?.status]} color="secondary" />
            {project?.totalBudget !== 0 && (
              <Chip label={formatPrice(project?.totalBudget)} color="success" />
            )}
          </div>
        </div>
        <div className="md:w-1/3 w-full">
          <ImageSlider images={project?.imageUrls} />
        </div>
      </div>
      <div className="mt-8 h-[200px] bg-gray-100 w-full rounded-lg shadow-lg p-3">
        {sponsors?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-3xl font-semibold">
              Dự án hiện chưa có nhà tài trợ.
            </span>
          </div>
        ) : (
          <div>
            <span className="lg:text-3xl text-xl font-semibold">
              Dự án được tài trợ bởi
            </span>
            {sponsors?.map((sponsor) => (
              <div className="flex justify-between items-center">
                <div className="mt-2">
                  <span className="lg:text-xl text-base font-semibold p-3">
                    - {sponsor.company_name}: {formatPrice(sponsor.value)} VND
                  </span>
                </div>
                {sponsor.logo && (
                  <div>
                    <img
                      src={convertFireBaseImage(sponsor.logo)}
                      alt="logo"
                      className="h-[60px] w-[60px] lg:w-[80px] lg:h-[80px]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Grid container className="pt-[80px] pb-[60px]" spacing={4}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <ImageSlider
                title="Ảnh hiện trạng"
                images={currentStatusImages}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ImageSlider title="Ảnh tiến độ" images={progressImages} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ImageSlider title="Ảnh hoàn thiện" images={completedImages} />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container className="justify-between">
        <Grid
          item
          lg={
            project?.status === 2 && project?.totalDonation < project?.target
              ? 8
              : 12
          }
          // lg={8}
          className="mb-[24px] lg:pr-3 max-w-full overflow-hidden box-border"
        >
          <div className="min-h-[416px] border-2 rounded-lg shadow-xl">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Hoàn cảnh" />
                <Tab label="Nhà hảo tâm" />
                <Tab label="Mô hình xây" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{ __html: project?.background }}
                style={{ maxWidth: "100%", boxSizing: "border-box" }}
              ></div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              {sponsors?.map((sponsor) => (
                <div className="mb-2">
                  <span>
                    - {sponsor.company_name}: {formatPrice(sponsor.value)} VND
                  </span>
                </div>
              ))}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {project?.constructions}
            </TabPanel>
          </div>
        </Grid>
        {project?.status === 2 && project?.totalDonation < project?.target && (
          <Grid item xs={12} lg={4}>
            <div className="sticky top-[120px]">
              <div className="border-gray-100 border-2 rounded-lg shadow-xl">
                <DonationCard data={project} />
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      <div className="mt-[75px] ">
        <div className="flex items-center gap-[28px]">
          <hr className="flex-1 border-secondary" />
          <span className="uppercase font-bold lg:text-3xl text-2xl text-[#EF8C7F]">
            Cập nhật SAO KÊ
          </span>
          <hr className="flex-1 border-secondary" />
        </div>
        <div className="py-[30px]">
          <StatementTable id={id} setTotalDonation={setProject} />
        </div>
      </div>
      <FinishedProject />
    </div>
  );
};

export default ProjectDetail;
