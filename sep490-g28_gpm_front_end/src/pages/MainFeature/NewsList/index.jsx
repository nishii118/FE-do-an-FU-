import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Grid,
  Pagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { NewsBannerBreadcrumb } from "../Common";
import {
  Apps,
  CalendarMonth,
  FormatListBulleted,
  Search,
} from "@mui/icons-material";
import { useFetchDataFilter } from "../../../utils/hooks";
import {
  fetchNewsCategoriesServices,
  fetchNewsListService,
} from "../../../services/PublicService";
import { formatDate } from "../../../utils/formart";
import { convertImage } from "../../../utils/populate";
import defaultImage from "../../../assets/images/sucmanh2000.png";
import { Helmet } from "react-helmet-async";
const ITEMS_PER_PAGE = 9;

const VerticalNewsCard = ({ data, alignment }) => {
  const { news_id, title, created_at, short_description, thumbnail, slug } =
    data ?? {};
  const navigation = useNavigate();
  const handleClick = () => {
    navigation(`/tin-tuc/${slug}`);
  };

  return (
    <Grid item md={alignment === "multiple" ? 4 : 12}>
      <div
        className="border border-primary p-5 rounded-[20px] flex flex-col gap-4 hover:scale-105 transition duration-300"
        onClick={handleClick}
      >
        <img
          src={convertImage(thumbnail)}
          alt=""
          className="h-[152px] w-full object-cover rounded-[20px]"
        />
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <CalendarMonth />
            <span>{formatDate(created_at)}</span>
          </div>
          <h3 className="line-clamp-4 font-bold text-base h-[96px]">{title}</h3>
          {/* <p className="line-clamp-3">{short_description}</p> */}
        </div>
      </div>
    </Grid>
  );
};

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
        className={`${imgRelatedSize} object-cover rounded-lg min-w-[150px] lg:min-w-[200px]`}
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

const NewsList = () => {
  const [alignment, setAlignment] = useState("multiple");
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef(null);
  const [params, setParams] = useState({
    size: ITEMS_PER_PAGE,
    page: 0,
    title: null,
    category_id: null,
  });

  const {
    total,
    data: news,
    isLoading: newsLoading,
  } = useFetchDataFilter({
    fnc: () => fetchNewsListService(params),
    dependencies: [params],
  });

  const { data: categories, isLoading: categoriesLoading } = useFetchDataFilter(
    {
      fnc: fetchNewsCategoriesServices,
    }
  );

  const totalNews = useMemo(() => {
    return categories?.reduce((prev, value) => prev + value.total, 0);
  }, [categories]);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handlePageChange = (event, value) => {
    setParams((prev) => ({ ...prev, page: value - 1 }));
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, title: value }));
    }, 500);
  };

  const handleCategoryClick = (category_id) => {
    setParams((prev) => ({ ...prev, category_id, page: 0 }));
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Tin Sức mạnh 2000</title>
        <meta
          name="description"
          content="Bài viết sức mạnh 2000, cập nhật thông tin xây dựng, báo cáo tài chính."
        />

        <meta property="og:title" content="Tin Sức mạnh 2000" />
        <meta
          property="og:description"
          content="Bài viết sức mạnh 2000, cập nhật thông tin xây dựng, báo cáo tài chính."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content="https://fpt.sucmanh2000.com/tin-tuc" />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewsBannerBreadcrumb
        data={[{ title: "Tin sức mạnh 2000" }]}
        pageTitle="Tin Sức mạnh 2000"
      />
      <div className="container mx-auto">
        <Grid container padding={"40px 0"} spacing={6}>
          <Grid item xs={12} md={3}>
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
            {/* <div className="mt-4">
              <div>
                <h4 className="text-2xl font-bold">Bài viết liên quan</h4>
              </div>
              <div className="mt-2.5 flex flex-col gap-2.5">
                {news.map((item) => (
                  <HorizontalNewsCard
                    key={item.news_id}
                    isRelated
                    data={item}
                  />
                ))}
              </div>
            </div> */}
          </Grid>
          <Grid item md={9}>
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold">Tin mới nhất</h4>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                size="small"
              >
                <ToggleButton value="multiple">
                  <Apps />
                </ToggleButton>
                <ToggleButton value="single">
                  <FormatListBulleted />
                </ToggleButton>
              </ToggleButtonGroup>
              <TextField
                placeholder="Tìm kiếm tin tức..."
                size="small"
                value={searchInput}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </div>
            {alignment === "multiple" ? (
              <Grid container mt="10px" padding="10px" spacing={3}>
                {news.map((item) => (
                  <VerticalNewsCard
                    key={item.news_id}
                    data={item}
                    alignment={alignment}
                  />
                ))}
              </Grid>
            ) : (
              <div className="mt-[34px] flex flex-col gap-4">
                {news.map((item) => (
                  <HorizontalNewsCard key={item.news_id} data={item} />
                ))}
              </div>
            )}
            <div className="mt-10 flex justify-center">
              <Pagination
                count={Math.ceil(total / ITEMS_PER_PAGE)}
                page={params.page + 1}
                onChange={handlePageChange}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default NewsList;
