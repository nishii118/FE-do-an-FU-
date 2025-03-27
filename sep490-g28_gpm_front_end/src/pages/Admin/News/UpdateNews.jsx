import { useState, useEffect } from "react";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import axiosInstance from "../../../services/api";
import Editor from "../../../components/CKeditor/Editor";
import { routes } from "../../../config";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { convertFireBaseImage } from "../../../utils/populate";
import SingleImageUpload from "../../../components/FileUpload/SingleImageUpload";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { fetchNewsCategoryService } from "../../../services/NewsService";

const UpdateNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUploaded, setIsUploaded] = useState(false);
  const [listNewsCategory, setListNewsCategory] = useState([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [editorData, setEditorData] = useState("");
  const [newsData, setNewsData] = useState({
    title: "",
    category: null,
    short_description: "",
    thumbnail: "",
    content: "",
  });
  const [errors, setErrors] = useState({});

  const fetchNewsDetail = async () => {
    await axiosInstance.get(`/news/${id}`).then((response) => {
      const { title, category, short_description, thumbnail, content } =
        response.data.data;
      setNewsData({ title, category, short_description, thumbnail, content });
      setEditorData(content);
    });
  };

  const fetchCategory = async () => {
    const res = await fetchNewsCategoryService();
    if (res && res.length > 0) {
      setListNewsCategory(res);
    }

    if (res.status > 300) {
      toast.error(res.data.error.message);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchNewsDetail();
  }, []);

  const handleCancel = () => {
    navigate(routes.manageNews);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = newsData.title ? "" : "Tên bài viết là bắt buộc";
    tempErrors.category = newsData.category ? "" : "Thể loại là bắt buộc";
    tempErrors.short_description = newsData.short_description
      ? ""
      : "Mô tả ngắn là bắt buộc";
    tempErrors.content = editorData ? "" : "Nội dung bài viết là bắt buộc";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      const updatedData = {
        ...newsData,
        content: editorData,
        thumbnail: isUploaded ? "" : newsData.thumbnail,
      };

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(updatedData)], {
          type: "application/json",
        })
      );
      formData.append("image", thumbnail);

      axiosInstance
        .put(`admin/news/update/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Cập nhật thành công");
          navigate(routes.manageNews);
        })
        .catch((error) => {
          toast.error(error.response.data.error.message);
        });
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Danh sách tin tức", path: routes.manageNews },
        {
          title: "Cập nhật tin tức",
        },
      ]}
      pageTitle={"Cập nhật tin tức"}
    >
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item md={12} lg={9}>
            <TextField
              InputLabelProps={{ shrink: true }}
              fullWidth
              name="title"
              label="Tên bài viết"
              variant="outlined"
              value={newsData.title}
              onChange={(e) =>
                setNewsData({ ...newsData, title: e.target.value })
              }
              error={!!errors.title}
              helperText={errors.title}
              size="small"
            />
          </Grid>
          <Grid item md={12} lg={3}>
            <Autocomplete
              size="small"
              value={newsData.category}
              onChange={(_, newValue) =>
                setNewsData({ ...newsData, category: newValue })
              }
              options={listNewsCategory}
              getOptionLabel={(option) => option.title || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Phân loại"
                  error={!!errors.category}
                  helperText={errors.category}
                />
              )}
            />
          </Grid>

          <Grid item md={12} lg={9}>
            <TextField
              InputLabelProps={{ shrink: true }}
              multiline
              fullWidth
              name="short_description"
              label="Mô tả ngắn bài viết"
              variant="outlined"
              value={newsData.short_description}
              onChange={(e) =>
                setNewsData({
                  ...newsData,
                  short_description: e.target.value,
                })
              }
              error={!!errors.short_description}
              helperText={errors.short_description}
              size="small"
              rows={12}
            />
          </Grid>

          <Grid item md={12} lg={3}>
            <SingleImageUpload
              image={thumbnail}
              setImage={setThumbnail}
              label="Tải ảnh bìa"
              setIsUploaded={setIsUploaded}
              initialImageURL={convertFireBaseImage(newsData.thumbnail)}
            />
          </Grid>
        </Grid>
        <div className="mt-4">
          <Editor editorData={editorData} setEditorData={setEditorData} />
          {errors.content && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              {errors.content}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Thoát
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </PageHeader>
  );
};

export default UpdateNews;
