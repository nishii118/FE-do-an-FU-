import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { createCategoryService } from "../../../services/CategoryService";
import CreateButton from "../../../components/Button/CreateButton";
import { Close } from "@mui/icons-material";

const CreateCategory = ({ onSuccess }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

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
      await createCategoryService({ title, description });
      toast.success("Tạo tiêu đề thành công");
      if (onSuccess) {
        onSuccess(); // Call the onSuccess callback to refresh the list
      }
      handleCloseDialog();
      toast.success("Thêm mới thành công")
    } catch (error) {
      toast.error("Đã có lỗi khi tạo tiêu đề");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CreateButton
        message={"Thêm tiêu đề"}
        handleClick={handleOpenDialog}
      ></CreateButton>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm danh mục mới</DialogTitle>
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
            {loading ? <CircularProgress size={24} /> : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateCategory;
