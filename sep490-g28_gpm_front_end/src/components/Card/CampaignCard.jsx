import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { LinearCardTag } from "../Tag";
import DonationCard from "./DonationCard";
import StatementTable from "./StatementTable";
import { convertImage } from "../../utils/populate";
import Slider from "react-slick";
import NoImage from "../../assets/images/no-image.png";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { NextArrow, PrevArrow } from "../Button/Arrow";

const ImageSlider = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // Convert image URLs only when images exist
  const imageUrls = images?.map((item) => convertImage(item.image)) || [];

  // Settings for the main slider
  const mainSliderSettings = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  // Settings for the nav slider
  const navSliderSettings = {
    asNavFor: nav1,
    ref: (slider) => setNav2(slider),
    slidesToShow: imageUrls.length < 3 ? imageUrls.length : 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    swipeToSlide: true,
    infinite: true,
    // centerMode: imageUrls.length === 2,
    arrow: false,
  };

  // Handle cases where no images are provided
  if (imageUrls.length === 0) {
    return (
      <div className="border border-gray-100 bg-gray-100 p-2 rounded-2xl h-full">
        <div className="h-full border-2 border-white rounded-2xl overflow-hidden flex justify-center items-center">
          <div className="w-full">
            <img
              src={NoImage}
              alt="default"
              className="object-cover lg:h-[340px] h-[200px] w-full rounded-xl "
            />
          </div>
        </div>
      </div>
    );
  }

  // Render single image with zoom if only one image is provided
  if (imageUrls.length === 1) {
    return (
      <div className="border border-gray-100 bg-gray-200 p-2 rounded-2xl h-full">
        <div className="h-full border-2 border-white rounded-2xl overflow-hidden p-3 flex items-center justify-center">
          <div className="w-full">
            <Zoom>
              <img
                src={imageUrls[0]}
                alt="first"
                className="w-full lg:h-[340px] h-[200px] object-cover"
              />
            </Zoom>
          </div>
        </div>
      </div>
    );
  }

  // Render slider for multiple images
  return (
    <div className="border border-gray-100 bg-gray-50 p-2 rounded-2xl h-full">
      <div className="h-full border-2 border-white rounded-2xl p-3">
        <Slider {...mainSliderSettings}>
          {imageUrls.map((item, index) => (
            <div key={index} className="my-auto">
              <Zoom>
                <img
                  src={item}
                  alt={`Slide ${index + 1}`}
                  className="w-full lg:h-[280px] h-[200px] object-cover"
                />
              </Zoom>
            </div>
          ))}
        </Slider>
        <div className="lg:mt-4 px-6">
          <Slider {...navSliderSettings}>
            {imageUrls.map((item, index) => (
              <div key={index} className="px-1">
                <img
                  src={item}
                  alt={`Nav Slide ${index + 1}`}
                  className="w-full h-[80px] object-cover rounded-md hover:cursor-pointer"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, content, isNotice }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
        setIsOverflowing(true);
      }
    };

    checkOverflow();
  }, [content]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      <LinearCardTag label={label} />
      <div
        className={`${
          isNotice ? "bg-white p-6 my-6 rounded-3xl" : "py-6"
        } ck-content`}
        style={{
          maxHeight: isExpanded ? "none" : "calc(1.5em * 20)", // Giả sử line-height là 1.5
          overflow: "hidden",
          position: "relative",
        }}
        ref={contentRef}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {isOverflowing && (
        <button onClick={toggleExpand} className="mt-2 text-[#EF8C7F]">
          {isExpanded ? (
            <div>
              <ExpandLess></ExpandLess>Thu gọn
            </div>
          ) : (
            <div>
              <ExpandMore></ExpandMore>Xem thêm
            </div>
          )}
        </button>
      )}
    </div>
  );
};

const CampaignCard = ({ isHideStatementTable = true, data }) => {
  const [project, setProject] = useState(data ?? {});
  const [needDonation, setNeedDonation] = useState(false);

  useEffect(() => {
    setNeedDonation(project.totalDonation < project.target);
  }, []);
  return (
    <div className="bg-[white] lg:p-8 p-3 lg:rounded-[50px] rounded-xl flex flex-col gap-6 group shadow-2xl">
      <Grid
        container
        alignItems="stretch"
        justifyContent="space-between"
        className="gap-6 lg:gap-0"
      >
        <Grid
          item
          xs={12}
          lg={needDonation ? 6 : 12}
          md={12}
          className="lg:p-3"
        >
          <ImageSlider images={project.images} />
        </Grid>

        <Grid item xs={12} lg={6} className="lg:p-3 ">
          {project.status === 2 && needDonation && (
            <div className="border border-gray-200 rounded-2xl">
              <DonationCard data={project} />
            </div>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        className="overflow-hidden  transition ease-in duration-500"
      >
        <Grid item xs={12} md={6} className="p-3">
          <Detail label="Thông tin" content={project?.background} />
        </Grid>
        <Grid item xs={12} md={6} className="p-3">
          <div className="">
            <Detail
              label="Đề xuất xây dựng"
              content={project.constructions
                ?.map((item) => item)
                .join("<br/><br/>")}
            />
            <Detail
              label="Một Số Lưu Ý"
              isNotice
              content={
                "+ Không thu bất kì chi phí quản lý nào, 100% số tiền tới tay đối tượng và đúng mục đích.<br/>+ Sao kê được cập nhật sau mỗi 30s.<br/>+ Trong trường hợp số tiền xây dựng đã đủ mà vẫn có người đóng góp, số tiền đó sẽ được chuyển sang dự án khác. Bạn có thể thấy dự án đó ở phần Được chuyển tới. Thông tin chuyển khoản của bạn cũng sẽ được hiển thị ở sao kê của dự án đó"
              }
            />
          </div>
        </Grid>
      </Grid>
      {isHideStatementTable && (
        <div>
          <div className="flex items-center gap-[28px] mb-4">
            <hr className="flex-1 border-secondary" />
            <span className="uppercase font-bold lg:text-3xl text-2xl text-[#EF8C7F]">
              Cập nhật SAO KÊ
            </span>
            <hr className="flex-1 border-secondary" />
          </div>
          <StatementTable id={project?.id} setTotalDonation={setProject} />
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
