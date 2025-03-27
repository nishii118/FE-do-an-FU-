import React, { useRef, useState } from "react";
import BannerBreadcrumb from "./../Common/BannerBreadcrumb";
import ProfileCard from "../../../components/Card/ProfileCard";
import { Search } from "@mui/icons-material";
import useInfinityAmbassador from "../../../hook/useInfinityAmbassador";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { InfiniteScroll } from "../../../components";
import useInfinityChallenges from "../../../hook/useInfinityChallenges";
import ChallengeCard from "../../../components/Card/ChallengeCard";
import { Helmet } from "react-helmet";
import defaultImage from "../../../assets/images/sucmanh2000.png";

const ChallengeList = () => {
  const [search, setSearch] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const debounceRef = useRef(null);

  const {
    data: challenges,
    params,
    isLoading,
    setParams,
    onLoadMore,
  } = useInfinityChallenges();

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, fullname: value }));
    }, 500);
  };

  const handleSearchTitleChange = (event) => {
    const value = event.target.value;
    setSearchTitle(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, title: value }));
    }, 500);
  };

  return (
    <div>
      <Helmet>
        <title>Thử thách SM2000</title>
        <meta
          name="description"
          content="Thử thách đồng hành cùng Sức mạnh 2000."
        />

        <meta property="og:title" content="Thử thách SM2000" />
        <meta
          property="og:description"
          content="Thử thách đồng hành cùng Sức mạnh 2000."
        />
        <meta property="og:image" content={defaultImage} />
        <meta
          property="og:url"
          content="https://fpt.sucmanh2000.com/thu-thach"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <BannerBreadcrumb
        data={[{ title: "Danh sách thử thách" }]}
        pageTitle={"Danh sách thử thách Sức Mạnh 2000"}
      ></BannerBreadcrumb>
      <div className="container mx-auto py-10">
        <div>
          <Grid
            container
            justifyContent={{ md: "flex-end", xs: "center" }}
            gap={1}
          >
            <Grid item lg={3} className="lg:px-6">
              <TextField
                label="Tên người tạo"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                className="w-full"
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item lg={3} className="lg:px-6">
              <TextField
                label="Tên thử thách"
                variant="outlined"
                value={searchTitle}
                onChange={handleSearchTitleChange}
                className="w-full"
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
          </Grid>
        </div>
        {challenges.data ? (
          <InfiniteScroll
            // className={"flex"}
            loader={
              <div>
                <CircularProgress />
              </div>
            }
            fetchMore={onLoadMore}
            hasMore={challenges.hasMore}
          >
            <div className="">
              <div>
                {challenges.data.length ? (
                  <Grid container>
                    {challenges.data.map((item) => (
                      <Grid item xs={12} md={3} key={item.challenge_id}>
                        <div className="py-4">
                          <ChallengeCard data={item} />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <div className="border-2 border-gray-200 h-[200px] flex justify-center items-center mt-4 mx-6 rounded-xl">
                    Không tìm thấy thử thách
                  </div>
                )}
              </div>
            </div>
          </InfiniteScroll>
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeList;
