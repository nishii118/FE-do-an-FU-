import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="calc(100vh - 64px)" // Adjust based on your layout
    >
      <Box textAlign="center">
        <Typography variant="h1" component="h1" gutterBottom>
          Không tìm thấy trang
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Trang bạn tìm kiếm không tồn tại
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ marginTop: "16px" }}
        >
          Quay về trang chủ
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;