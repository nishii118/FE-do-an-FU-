import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import MultipleImageUpload from "../../../components/FileUpload/MultipleImageUpload";
import { toast } from "react-toastify";
import {
  fetchTrackingDetailService,
  updateTrackingService,
} from "../../../services/TrackingService";
import useProjectStore from "../../../store/useProjectStore";
import SubmitButton from "../../../components/Button/SubmitButton";

const UpdateTracking = ({ id, handleCloseUpdate }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const [tracking, setTracking] = useState({
    title: "",
    content: "",
    date: "",
    images: [],
    imageURLs: [],
    initialImageURLs: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Added loading state
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchTracking = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTrackingDetailService({ id });
      const { title, content, date, tracking_images } = response;
      const initialImageURLs = tracking_images.map((img) => img.image_url);
      setTracking({
        title,
        content,
        date,
        images: [],
        initialImageURLs: initialImageURLs,
      });

      setLoading(false);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTracking({
      ...tracking,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = tracking.title.trim()
      ? ""
      : "Tên theo dõi là bắt buộc và không được để trống";
    tempErrors.content = tracking.content.trim()
      ? ""
      : "Nội dung là bắt buộc và không được để trống";
    tempErrors.date = tracking.date ? "" : "Ngày là bắt buộc";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(tracking);
    if (validate()) {
      const formData = new FormData();
      const dateTimeString = tracking.date ? `${tracking.date}T00:00:00` : "";

      formData.append(
        "tracking",
        new Blob(
          [
            JSON.stringify({
              title: tracking.title || "",
              content: tracking.content || "",
              date: dateTimeString,
              tracking_images: tracking.initialImageURLs.map((url) => ({
                image_url: url,
              })),
            }),
          ],
          { type: "application/json" }
        )
      );

      tracking.images.forEach((image, index) => {
        formData.append("image", image);
      });

      setUpdateLoading(true);
      try {
        await updateTrackingService({ formData, id });
        toast.success(`Cập nhật tiến độ thành công`);
        handleCloseUpdate();
        setUpdateLoading(false);
      } catch (error) {
        setUpdateLoading(false);
        toast.error("Đã xảy ra lỗi khi cập nhật tiến độ");
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        <CircularProgress></CircularProgress>
      </Box>
    );
  }

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên tiến độ cần theo dõi"
              name="title"
              placeholder="Nhập tên tiến độ cần theo dõi..."
              value={tracking.title}
              onChange={handleChange}
              fullWidth
              InputProps={{
                readOnly: !isMember,
              }}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Nội dung"
              name="content"
              placeholder="Nhập nội dung theo dõi tiến độ..."
              value={tracking.content}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              InputProps={{
                readOnly: !isMember,
              }}
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
              InputProps={{
                readOnly: !isMember,
              }}
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
              isActive={isMember}
            />
          </Grid>
        </Grid>
        <Box className="flex justify-start mt-4">
          {isMember && (
            // <Button onClick={handleSubmit} variant="outlined" color="primary">
            //   Cập nhật
            // </Button>
            <SubmitButton
              text="Cập nhật"
              onClick={handleSubmit}
              loading={updateLoading}
            ></SubmitButton>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UpdateTracking;
