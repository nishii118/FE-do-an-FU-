import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  fetchCategoryDetailService,
  updateCategoryService,
} from "../../../services/CategoryService";
import { Close, Edit } from "@mui/icons-material";

const UpdateCategory = ({ categoryId, onSuccess }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (dialogOpen && categoryId) {
      fetchCategoryDetails();
    }
  }, [dialogOpen, categoryId]);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchCategoryDetailService(categoryId);
      setTitle(response.title ?? null);
      setDescription(response.description ?? null);
    } catch (error) {
      setLoading(false);
      toast.error("Đã có lỗi khi tải chi tiết tiêu đề");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTitle("");
    setDescription("");
    setTitleError("");
    setDescriptionError("");
  };

  const validateInputs = () => {
    let isValid = true;

    if (title.trim() === "") {
      setTitleError("Tiêu đề không được để trống");
      isValid = false;
    } else if (title.length > 100) {
      setTitleError("Tiêu đề không được vượt quá 100 ký tự");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (description.trim() === "") {
      setDescriptionError("Mô tả không được để trống");
      isValid = false;
    } else if (description.length > 255) {
      setDescriptionError("Mô tả không được vượt quá 255 ký tự");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await updateCategoryService(categoryId, { title, description });
      toast.success("Cập nhật tiêu đề thành công");
      if (onSuccess) {
        onSuccess(); // Call the onSuccess callback to refresh the list
      }
      handleCloseDialog();
    } catch (error) {
      toast.error("Đã có lỗi khi cập nhật tiêu đề");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Chi tiết thử thách">
        <IconButton onClick={handleOpenDialog}>
          <Edit color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật tiêu đề</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 100 }}
            margin="dense"
            required
            error={Boolean(titleError)}
            helperText={titleError}
          />
          <TextField
            label="Mô tả"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 255 }}
            margin="dense"
            required
            multiline
            rows={4}
            error={Boolean(descriptionError)}
            helperText={descriptionError}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
            sx={{ marginRight: "14px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateCategory;
