import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const ShareDialog = ({ open, handleClose, link }) => {
  const handleShareToFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      link
    )}`;

    const width = 800;
    const height = 600;

    window.open(
      facebookShareUrl,
      "facebook-share-dialog",
      `width=${width},height=${height}`
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Liên kết đã được sao chép!");
      })
      .catch((err) => {
        toast.error("Không thể sao chép liên kết: ", err);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: "16px", // Tùy chỉnh góc bo tròn
        },
      }}
    >
      <DialogTitle className="bg-[#ff855f] text-white ">
        <div className="flex justify-between items-center font-semibold text-lg ">
          <div className="text-center w-full">Lan tỏa yêu thương đến cộng đồng</div>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent className="mt-2">
        <Typography>
          Bằng cách chia sẻ dự án đến với cộng đồng, bạn sẽ góp phần giúp đỡ
          những hoàn cảnh khó khăn.
        </Typography>
        <div className="mt-4 font-semibold text-lg">Chia sẻ</div>
        <div className="flex mt-2">
          <IconButton color="primary" onClick={handleShareToFacebook}>
            <FacebookRoundedIcon
              sx={{
                width: "45px",
                height: "45px",
              }}
            />
          </IconButton>
        </div>
        <Grid container alignItems="stretch" justifyContent="space-between">
          <Grid item xs={12}>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              className="mt-2"
              value={link}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {/* <Grid item xs={2}>
            <Button
              variant="contained"
              size="small"
              onClick={handleCopyLink}
              className="h-full !text-center !rounded-xl !bg-primary !font-semibold"
            >
              Sao chép
            </Button>
          </Grid> */}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
