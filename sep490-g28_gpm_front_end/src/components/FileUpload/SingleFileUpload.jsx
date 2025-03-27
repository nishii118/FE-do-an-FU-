import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography, IconButton, Grid, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { getFileIcon } from "../../utils/getFileIcon";
import { convertFireBaseFile } from "../../utils/populate";

const SingleFileUpload = ({
  file = null,
  setFile,
  initialFileURL = "",
  setInitialFileURL,
  label = "Ấn vào đây để tải file",
  isActive = true,
}) => {
  const uploadFileRef = useRef(null);
  const [fileURL, setFileURL] = useState(initialFileURL);

  useEffect(() => {
    if (initialFileURL) {
      setFileURL(initialFileURL);
    }
  }, [initialFileURL]);

  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile?.size / 1024 / 1024 > 5) {
      toast.error(`File ${selectedFile.name} vượt quá giới hạn data: 5MB`);
      return;
    }
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
    setInitialFileURL("");
    event.target.value = null;
  };

  const handleDelete = () => {
    setFile(null);
    setFileURL("");
    setInitialFileURL("");
  };

  const handleClick = () => {
    uploadFileRef.current.click();
  };

  return (
    <div className="border-2 rounded-md min-h-[100px] flex flex-col justify-end">
      <div className="flex-grow">
        <Grid container spacing={1}>
          {fileURL && (
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="start"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center overflow-hidden">
                  {initialFileURL
                    ? getFileIcon(initialFileURL)
                    : getFileIcon(file.name)}
                  <a
                    href={
                      initialFileURL ? convertFireBaseFile(fileURL) : fileURL
                    }
                    download={file ? file.name : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flexGrow: 1 }}
                  >
                    <Typography
                      variant="body2"
                      className="!truncate cursor-pointer hover:underline"
                    >
                      {file ? file.name : fileURL}
                    </Typography>
                  </a>
                </div>

                {isActive && (
                  <IconButton
                    color="error"
                    onClick={handleDelete}
                    className="ml-auto"
                  >
                    <Close />
                  </IconButton>
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </div>
      {isActive && (
        <Button
          className="bg-blue-500 text-white w-full rounded-md cursor-pointer"
          startIcon={<CloudUploadIcon />}
          onClick={handleClick}
          variant="contained"
        >
          {label}
        </Button>
      )}

      <input
        accept="*/*"
        style={{ display: "none" }}
        id="contained-button-file"
        type="file"
        onChange={handleUpload}
        ref={uploadFileRef}
      />
    </div>
  );
};

SingleFileUpload.propTypes = {
  file: PropTypes.object,
  setFile: PropTypes.func.isRequired,
  initialFileURL: PropTypes.string,
  setInitialFileURL: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default SingleFileUpload;
