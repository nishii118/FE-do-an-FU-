import { useState, useEffect } from "react";
import { Grid, TextField, Button } from "@mui/material";
import axiosInstance from "../../../services/api";
import { routes } from "../../../config";
import { useParams, useNavigate } from "react-router-dom";
import { convertFireBaseImage } from "../../../utils/populate";
import PageHeader from "../../../components/PageHeader/PageHeader";
import NoImage from "../../../../src/assets/images/no-image.png";
import { isValidRole } from "../../../utils/auth";

const NewsDetails = () => {
  const [newsData, setNewsData] = useState({
    title: "",
    category: "",
    short_description: "",
    thumbnail: "",
    content: "",
  });
  const [isCreator, setIsCreator] = useState(false);
  const { id } = useParams(); // Assuming the news ID is passed as a URL parameter
  const navigate = useNavigate();

  const checkCreator = (createdBy) => {
    if (isValidRole("ROLE_ADMIN")) return true;

    const email = localStorage.getItem("email").trim();

    if (email === createdBy) return true;

    return false;
  };

  useEffect(() => {
    setIsCreator(checkCreator());
  }, []);

  const fetchNewsDetail = async () => {
    await axiosInstance.get(`/news/${id}`).then((response) => {
      const newsDetail = response.data.data;
      setNewsData({
        ...newsDetail,
        title: newsDetail.title,
        category: newsDetail.category.title,
        short_description: newsDetail.short_description,
        thumbnail: newsDetail.thumbnail,
        content: newsDetail.content,
      });
      setIsCreator(checkCreator(newsDetail.created_by.email));
    });
  };

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  const handleCancel = () => {
    navigate(routes.manageNews);
  };

  const handleUpdateClick = () => {
    navigate("./edit");
  };

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Danh sách tin tức", path: routes.manageNews },
        { title: "Thông tin chi tiết", path: routes.newsDetail },
      ]}
      pageTitle={"Thông tin chi tiết"}
    >
      <div>
        <Grid container spacing={2}>
          <Grid item md={12} lg={9}>
            <TextField
              fullWidth
              name="title"
              label="Tên bài viết"
              variant="outlined"
              value={newsData.title}
              size="small"
            />
          </Grid>
          <Grid item md={12} lg={3}>
            <TextField
              fullWidth
              name="category"
              label="Phân loại"
              variant="outlined"
              value={newsData.category}
              size="small"
            />
          </Grid>

          <Grid item md={12} lg={9}>
            <TextField
              multiline
              fullWidth
              name="shortDescription"
              label="Mô tả ngắn bài viết"
              variant="outlined"
              value={newsData.short_description}
              size="small"
              rows={12}
            />
          </Grid>

          <Grid item md={12} lg={3}>
            <div className="h-[293px] border-2 rounded flex justify-center">
              <img
                src={
                  newsData.thumbnail
                    ? convertFireBaseImage(newsData.thumbnail)
                    : NoImage
                }
                alt="Thumbnail"
                className="h-full rounded object-cover"
              />
            </div>
          </Grid>
        </Grid>
        <div className="mt-4 border border-black rounded-lg min-h-[300px]">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: newsData.content }}
          ></div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Thoát
          </Button>
          {isCreator && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateClick}
            >
              Cập nhật
            </Button>
          )}
        </div>
      </div>
    </PageHeader>
  );
};

export default NewsDetails;
