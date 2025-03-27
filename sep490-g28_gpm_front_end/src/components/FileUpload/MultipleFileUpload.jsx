import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, IconButton, Grid, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { getFileIcon } from "../../utils/getFileIcon";
import { convertFireBaseFile } from "../../utils/populate";

const MultipleFileUpload = ({
  files = [],
  setFiles,
  size,
  fileURLs = [],
  setFileURLs,
  initialFileURLs = [],
  setInitialFileURLs,
  label = "Ấn vào đây để tải files",
  isActive = true,
}) => {
  const uploadFileRef = useRef(null);

  useEffect(() => {
    const convertedURLs = initialFileURLs?.map((url) => url);
    if (fileURLs.length === 0 && convertedURLs) {
      setFileURLs(convertedURLs);
    }
  }, []);
  // [fileURLs, initialFileURLs]

  const handleUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = [];
    const newFileURLs = [];

    for (let file of selectedFiles) {
      if (file.size / 1024 / 1024 > 5) {
        toast.error(`File ${file.name} vượt quá giới hạn data: 5MB`);
        continue;
      }
      if (files.some((existingFile) => existingFile.name === file.name)) {
        toast.error(`File ${file.name} trùng lặp!`);
        continue;
      }
      newFileURLs.push(URL.createObjectURL(file));
      newFiles.push(file);
    }

    const updatedFileList = [...files, ...newFiles];

    setFiles(updatedFileList);
    setFileURLs([...fileURLs, ...newFileURLs]);
    event.target.value = null;
  };

  const handleDelete = (index) => {
    const adjustedIndex = index - (fileURLs.length - files.length);
    const newFileURLs = fileURLs.filter((_, i) => i !== index);
    const newInitialFileURLs = initialFileURLs.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== adjustedIndex);

    setFiles(newFiles);
    setFileURLs(newFileURLs);
    setInitialFileURLs(newInitialFileURLs);
  };

  const handleClick = () => {
    uploadFileRef.current.click();
  };

  const renderFileList = () => {
    if (!fileURLs.length) return null;

    return (
      <div className="flex-grow">
        <Grid container spacing={1}>
          {fileURLs.map((fileURL, index) => (
            <Grid
              key={index}
              item
              xs={12}
              display="flex"
              alignItems="center"
              justifyContent="start"
            >
              {fileURL ? getFileIcon(fileURL) : null}
              <a
                href={convertFireBaseFile(fileURL)}
                download={files[index]?.name}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flexGrow: 1 }}
              >
                <Typography
                  variant="body2"
                  className="!truncate cursor-pointer hover:underline"
                >
                  {fileURL}
                </Typography>
              </a>
              {isActive && (
                <IconButton color="error" onClick={() => handleDelete(index)}>
                  <Close />
                </IconButton>
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <div className="border-2 rounded-md min-h-[150px] flex flex-col justify-end">
      {renderFileList()}
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
        multiple
        onChange={handleUpload}
        ref={uploadFileRef}
      />
    </div>
  );
};

MultipleFileUpload.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  setFiles: PropTypes.func.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fileURLs: PropTypes.arrayOf(PropTypes.string),
  setFileURLs: PropTypes.func.isRequired,
  initialFileURLs: PropTypes.arrayOf(PropTypes.string),
  setInitialFileURLs: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default MultipleFileUpload;
