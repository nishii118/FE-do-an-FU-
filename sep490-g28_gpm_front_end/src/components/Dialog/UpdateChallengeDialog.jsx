import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  IconButton,
  Grid,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  fetchChallengeDetailService,
  updateChallengeService,
} from "../../services/ChallengeService";
import { toast } from "react-toastify";
import SingleImageUpload from "./../FileUpload/SingleImageUpload";
import dayjs from "dayjs";
import { formatPrice } from "../../utils/formart";
import { convertFireBaseImage } from "./../../utils/populate";

const UpdateChallengeDialog = ({ open, handleClose, challengeId }) => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialThumbnail, setInitialThumbnail] = useState(null);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState(null);

  useEffect(() => {
    if (challengeId) {
      fetchChallengeDetails();
    }
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    try {
      const response = await fetchChallengeDetailService(challengeId);
      setTitle(response.title);
      setGoal(response.goal);
      setEndDate(response.finished_at);
      setContent(response.content);
      setInitialThumbnailUrl(convertFireBaseImage(response.thumbnail ?? null));
      setInitialThumbnail(response.thumbnail ?? null);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải thông tin thử thách!");
      console.error("Error fetching challenge details:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Tên thử thách là bắt buộc";
    if (!goal) {
      newErrors.goal = "Số tiền mong muốn đạt được là bắt buộc";
    } else if (!/^\d+$/.test(goal)) {
      newErrors.goal = "Số tiền phải là số nguyên dương";
    }
    if (!endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    } else {
      const selectedDate = new Date(endDate);
      const currentDate = new Date();

      // Set time to midnight for comparison
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        newErrors.endDate = "Ngày kết thúc phải là một ngày trong tương lai";
      }
    }
    if (!content) newErrors.content = "Nội dung thử thách là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const updatedChallengeData = {
      title,
      goal,
      endDate: new Date(endDate).toISOString(),
      content,
      thumbnail,
      initialThumbnail,
    };

    console.log(updatedChallengeData);

    await updateChallengeService(challengeId, updatedChallengeData)
      .then((response) => {
        toast.success("Thử thách đã được cập nhật thành công");
        handleClose(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error updating challenge:", error);
        toast.error("Đã có lỗi xảy ra khi cập nhật thử thách!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeGoal = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");
    setGoal(numericValue);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle className="bg-[#ff855f] text-white ">
        <div className="flex justify-between items-center font-semibold text-lg ">
          <div className="text-center w-full">Cập nhật thử thách</div>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <div>
            <div className="mt-4">
              <TextField
                label="Tên thử thách"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title || ""}
              />
            </div>
            <div className="">
              <Grid container justifyContent="space-between">
                <Grid item xs={12} lg={6} className="flex items-center">
                  <TextField
                    label="Số tiền mong muốn đạt được"
                    fullWidth
                    margin="dense"
                    value={formatPrice(goal)}
                    onChange={handleChangeGoal}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">VNĐ</InputAdornment>
                      ),
                    }}
                    error={!!errors.goal}
                    helperText={errors.goal || ""}
                  />
                </Grid>
                <Grid item xs={12} lg={6} className="flex items-center lg:pl-4">
                  <TextField
                    label="Ngày kết thúc"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate || ""}
                  />
                </Grid>
              </Grid>
            </div>
            <div>
              <TextField
                label="Nội dung thử thách"
                fullWidth
                multiline
                rows={6}
                margin="dense"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={!!errors.content}
                helperText={errors.content || ""}
              />
            </div>
            <div>
              <SingleImageUpload
                image={thumbnail}
                setImage={(file) => setThumbnail(file)}
                label="Tải ảnh bìa thử thách"
                initialImageURL={initialThumbnailUrl}
              />
            </div>
          </div>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "16px" }}
              disabled={loading}
              className="!text-white !bg-primary"
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Cập nhật thử thách"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChallengeDialog;
