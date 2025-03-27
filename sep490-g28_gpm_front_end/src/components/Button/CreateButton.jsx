import { Button } from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CreateButton = ({handleClick, message}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      startIcon={<AddCircleOutlineIcon />}
      size="medium"
    >
      {message}
    </Button>
  );
};

export default CreateButton;
