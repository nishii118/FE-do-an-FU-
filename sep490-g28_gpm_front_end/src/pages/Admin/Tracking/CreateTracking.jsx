import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MultipleImageUpload from "../../../components/FileUpload/MultipleImageUpload";
import { toast } from "react-toastify";
import { addTrackingService } from "../../../services/TrackingService";

const CreateTracking = ({ handleCloseCreate, id }) => {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState({
    title: "",
    content: "",
    date: "",
    images: [],
    imageUrls: [],
    initialImageUrls: [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTracking((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    if (name === "title") {
      tempErrors.title = value.trim()
        ? ""
        : "Tên tiến độ cần theo dõi là bắt buộc và không được để trống";
    }

    if (name === "content") {
      tempErrors.content = value.trim()
        ? ""
        : "Nội dung là bắt buộc và không được để trống";
    }

    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      tempErrors.date = value
        ? value <= today
          ? ""
          : "Ngày không được quá ngày hiện tại"
        : "Ngày là bắt buộc";
    }

    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = {};
    const today = new Date().toISOString().split("T")[0];

    tempErrors.title = tracking.title.trim()
      ? ""
      : "Tên tiến độ cần theo dõi là bắt buộc và không được để trống";
    tempErrors.content = tracking.content.trim()
      ? ""
      : "Nội dung là bắt buộc và không được để trống";
    tempErrors.date = tracking.date
      ? tracking.date <= today
        ? ""
        : "Ngày không được quá ngày hiện tại"
      : "Ngày là bắt buộc";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      const dateTimeString = `${tracking.date}T00:00:00`;

      formData.append(
        "tracking",
        new Blob(
          [
            JSON.stringify({
              title: tracking.title,
              content: tracking.content,
              date: dateTimeString,
            }),
          ],
          { type: "application/json" }
        )
      );

      tracking.images.forEach((image) => {
        formData.append("image", image);
      });

      try {
        await addTrackingService({ formData, id });
        toast.success(`Thêm tiến độ thành công`);
        handleCloseCreate();
      } catch (error) {
        console.error("Error creating tracking:", error);
      }
    }
  };

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" error={!!errors.title}>
              <InputLabel id="title-label">Tên tiến độ cần theo dõi</InputLabel>
              <Select
                labelId="title-label"
                name="title"
                value={tracking.title}
                onChange={handleChange}
                label="Tên tiến độ cần theo dõi"
              >
                <MenuItem value="Hiện trạng">Hiện trạng</MenuItem>
                <MenuItem value="Tiến độ">Tiến độ</MenuItem>
                <MenuItem value="Hoàn thiện">Hoàn thiện</MenuItem>
              </Select>
              {errors.title && (
                <Typography color="error">{errors.title}</Typography>
              )}
            </FormControl>
            <TextField
              label="Nội dung"
              name="content"
              placeholder="Nhập nội dung theo dõi tiến độ..."
              value={tracking.content}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              error={!!errors.content}
              helperText={errors.content}
            />
            <TextField
              label="Chọn thông tin ngày cập nhật"
              name="date"
              type="date"
              value={tracking.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"> Hình ảnh </Typography>
            <MultipleImageUpload
              images={tracking.images}
              imageURLs={tracking.imageURLs}
              initialImageURLs={tracking.initialImageURLs}
              setImages={(images) => {
                setTracking((prevState) => ({ ...prevState, images }));
              }}
              setImageURLs={(imageURLs) =>
                setTracking((prevState) => ({ ...prevState, imageURLs }))
              }
              setInitialImageURLs={(initialImageURLs) =>
                setTracking((prevState) => ({ ...prevState, initialImageURLs }))
              }
              label="Tải ảnh tiến độ"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Tạo theo dõi dự án
        </Button>
      </Box>
    </div>
  );
};

export default CreateTracking;
