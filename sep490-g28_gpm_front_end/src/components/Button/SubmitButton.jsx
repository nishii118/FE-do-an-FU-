import { Button, CircularProgress } from "@mui/material";
import React from "react";

const SubmitButton = ({ onClick, loading, text, ...props }) => {
  return (
    <Button
      {...props}
      onClick={onClick}
      variant="contained"
      color="primary"
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : `${text}`}
    </Button>
  );
};

export default SubmitButton;
