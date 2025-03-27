import { useEffect, useState } from "react";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { routes } from "../../../config";
import { useNavigate } from "react-router-dom";
import SingleImageUpload from "../../../components/FileUpload/SingleImageUpload";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  createNewsService,
  fetchNewsCategoryService,
} from "../../../services/NewsService";
import CustomEditor from "../../../components/CKeditor/Editor";
import { toast } from "react-toastify";

const CreateNews = () => {
  const navigate = useNavigate();
  const [isUploaded, setIsUploaded] = useState(false);
  const [listNewsCategory, setListNewsCategory] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [editorData, setEditorData] = useState("");
  const [newsData, setNewsData] = useState({
    title: "",
    category: null,
    short_description: "",
    content: "",
  });
  const [errors, setErrors] = useState({});

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
  }, []);

  const handleCancel = () => {
    navigate(routes.manageNews);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = newsData.title.trim() ? "" : "Tên bài viết là bắt buộc";
    tempErrors.category = newsData.category ? "" : "Thể loại là bắt buộc";
    tempErrors.short_description = newsData.short_description.trim()
      ? newsData.short_description.length <= 500
        ? ""
        : "Mô tả ngắn không được quá 500 ký tự"
      : "Mô tả ngắn là bắt buộc";
    tempErrors.content = editorData ? "" : "Nội dung bài viết là bắt buộc";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      const newsDataToSend = {
        ...newsData,
        content: editorData,
      };

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(newsDataToSend)], {
          type: "application/json",
        })
      );
      formData.append("image", thumbnails);

      createNewsService({ formData })
        .then((response) => {
          toast.success("Tạo mới thành công");
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
        { title: "Tạo tin tức mới", path: routes.createNews },
      ]}
      pageTitle={"Tạo tin tức mới"}
    >
      <form onSubmit={onSubmit}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item md={12} lg={9}>
            <TextField
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
              id="category"
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
              image={thumbnails}
              setImage={setThumbnails}
              setIsUploaded={setIsUploaded}
              label="Tải ảnh bìa"
            />
          </Grid>
        </Grid>
        <div className="mt-4">
          <CustomEditor editor={editorData} setEditorData={setEditorData} />
          {errors.content && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{errors.content}</p>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Thoát
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Tạo
          </Button>
        </div>
      </form>
    </PageHeader>
  );
};

export default CreateNews;
