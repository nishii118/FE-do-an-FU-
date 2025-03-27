import React, { useRef, useState } from "react";
import BannerBreadcrumb from "./../Common/BannerBreadcrumb";
import ProfileCard from "../../../components/Card/ProfileCard";
import { Search } from "@mui/icons-material";
import useInfinityAmbassador from "../../../hook/useInfinityAmbassador";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { InfiniteScroll } from "../../../components";
import defaultImage from "../../../assets/images/sucmanh2000.png";
import { Helmet } from "react-helmet";

const AmbassadorsList = () => {
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const {
    data: ambassadors,
    params,
    isLoading,
    setParams,
    onLoadMore,
  } = useInfinityAmbassador();

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

  return (
    <div>
      <Helmet>
        <title>Đại sứ SM2000</title>
        <meta
          name="description"
          content="Đại sứ đồng hành cùng Sức mạnh 2000."
        />

        <meta property="og:title" content="Đại sứ SM2000" />
        <meta
          property="og:description"
          content="Đại sứ đồng hành cùng Sức mạnh 2000."
        />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content="https://fpt.sucmanh2000.com/dai-su" />
        <meta property="og:type" content="website" />
      </Helmet>

      <BannerBreadcrumb
        data={[{ title: "Đại sứ đồng hành" }]}
        pageTitle={"Đại sứ đồng hành cùng Sức Mạnh 2000"}
      ></BannerBreadcrumb>
      <div className="container mx-auto py-10">
        <div>
          <Grid container justifyContent={{ lg: "flex-end", xs:"center"  }}>
            <Grid item lg={3} className="lg:px-6">
              <TextField
                label="Tên đại sứ"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                className="w-full"
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
          </Grid>
        </div>
        {ambassadors.data ? (
          <InfiniteScroll
            // className={"flex"}
            loader={
              <div>
                <CircularProgress />
              </div>
            }
            fetchMore={onLoadMore}
            hasMore={ambassadors.hasMore}
          >
            <div>
              {ambassadors?.data?.length ? (
                <Grid container>
                  {ambassadors.data.map((item) => (
                    <Grid item xs={12} md={3} lg={3} key={item.accountId}>
                      <div className="py-4">
                        <ProfileCard data={item} />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div className="border-2 border-gray-200 h-[200px] flex justify-center items-center mt-4 mx-6 rounded-xl">
                  Không tìm thấy đại sứ
                </div>
              )}
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

export default AmbassadorsList;
