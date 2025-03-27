import React, { useEffect, useMemo, useState } from "react";
import { CircularProgress, Divider, Grid } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { NewsBannerBreadcrumb } from "../Common";
import {
  CalendarMonth,
  CalendarMonthOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { useFetchDataFilter } from "../../../utils/hooks";
import {
  fetchNewsCategoriesServices,
  fetchNewsDetailService,
  fetchNewsListService,
} from "../../../services/PublicService";
import { formatDate } from "../../../utils/formart";
import { convertImage, getNewsId } from "../../../utils/populate";
import { routes } from "../../../config";
import { Helmet } from "react-helmet";
import defaultImage from "../../../assets/images/sucmanh2000.png";

const ITEMS_PER_PAGE = 6;

const HorizontalNewsCard = ({ data, isRelated = false }) => {
  const imgRelatedSize = isRelated
    ? "w-[80px] h-[60px]"
    : "w-[200px] h-[100px]";
  const { news_id, title, created_at, short_description, thumbnail, slug } =
    data ?? {};

  const navigation = useNavigate();
  const handleClick = () => {
    navigation(`/tin-tuc/${slug}`);
  };

  return (
    <div
      className="rounded-[20px] flex items-center gap-4 hover:scale-105 transition duration-300"
      onClick={handleClick}
    >
      <img
        src={convertImage(thumbnail)}
        alt=""
        className={`${imgRelatedSize} object-cover rounded-lg min-w-[80px]`}
      />
      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-1">
          <CalendarMonth sx={{ width: 15 }} />
          <span className="text-sm">{formatDate(created_at)}</span>
        </div>
        {!isRelated && <p className="line-clamp-3">{short_description}</p>}
      </div>
    </div>
  );
};

const HomeNewsDetail = () => {
  const { slug } = useParams();
  const id = getNewsId(slug);
  const [params, setParams] = useState({
    size: ITEMS_PER_PAGE,
    page: 0,
    title: null,
    category_id: null,
  });
  const [newsDetail, setNewsDetail] = useState(undefined);
  const [loading, setLoading] = useState();

  const { data: news, isLoading: newsLoading } = useFetchDataFilter({
    fnc: () => fetchNewsListService(params),
    dependencies: [params],
  });

  const { data: categories, isLoading: categoriesLoading } = useFetchDataFilter(
    {
      fnc: fetchNewsCategoriesServices,
    }
  );

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      const response = await fetchNewsDetailService(id);
      const news = {
        ...response,
        createdAt: formatDate(response.created_at),
        createdBy: response.created_by.fullname,
      };
      setNewsDetail(news);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const totalNews = useMemo(() => {
    return categories?.reduce((prev, value) => prev + value.total, 0);
  }, [categories]);

  const handleCategoryClick = (category_id) => {
    setParams((prev) => ({ ...prev, category_id, page: 0 }));
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>{newsDetail?.title || "Chi tiết bài viết"}</title>
        <meta
          property="og:title"
          content={newsDetail?.title || "Chi tiết bài viết"}
        />
        <meta
          property="og:description"
          content={newsDetail?.short_description || "Mô tả bài viết"}
        />
        <meta
          property="og:image"
          content={convertImage(newsDetail?.thumbnail) || defaultImage}
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <NewsBannerBreadcrumb
        data={[
          { title: "Tin tức", path: routes.homeNewsList },
          { title: "Chi tiết" },
        ]}
        pageTitle={"Chi tiết bài viết"}
      />
      <div className="container mx-auto">
        <Grid container padding={"40px 0"} spacing={6}>
          <Grid item md={3}>
            <div>
              <div>
                <h4 className="text-2xl font-bold px-3">Thể loại</h4>
              </div>
              <div className="mt-2.5">
                <Link
                  className={`flex items-center justify-between py-2 hover:bg-[#ccc] px-5 -mx-2 ${
                    !params.category_id ? "bg-[#ccc]" : ""
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  <span>Tất cả</span>
                  <span>{totalNews}</span>
                </Link>
                {categories?.map((item) => {
                  if (item.total > 0) {
                    return (
                      <Link
                        key={item.category_id}
                        className={`flex items-center justify-between py-2 hover:bg-[#ccc] px-5 -mx-2 ${
                          params.category_id === item.category_id
                            ? "bg-[#ccc]"
                            : ""
                        }`}
                        onClick={() => handleCategoryClick(item.category_id)}
                      >
                        <span>{item.title}</span>
                        <span>{item.total}</span>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            <div className="mt-4">
              <div>
                <h4 className="text-2xl font-bold">Bài viết liên quan</h4>
              </div>
              <div className="mt-2.5 flex flex-col gap-2.5">
                {news?.map((item) => (
                  <HorizontalNewsCard
                    key={item.news_id}
                    isRelated
                    data={item}
                  />
                ))}
              </div>
            </div>
          </Grid>
          <Grid item md={9}>
            {loading ? (
              <div className="flex justify-center mt-8">
                <CircularProgress />
              </div>
            ) : (
              <div className="mt-8">
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <img
                    src={convertImage(newsDetail?.thumbnail)}
                    alt={newsDetail?.title}
                    className="w-full h-[300px] object-cover rounded-md"
                  />
                  <div className="mt-4">
                    <div className="flex items-center gap-[30px]">
                      <div className="flex items-center gap-2">
                        <PersonOutlineOutlined />
                        <span>{newsDetail?.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarMonthOutlined />
                        <span>{newsDetail?.createdAt}</span>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold mt-6 mb-6">
                      {newsDetail?.title}
                    </h2>
                    <Divider></Divider>
                    <p
                      className="ck-content mt-4"
                      dangerouslySetInnerHTML={{ __html: newsDetail?.content }}
                    ></p>
                  </div>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default HomeNewsDetail;
