import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography, Tooltip, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { convertFireBaseImage } from "../../utils/populate";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import background from "../../assets/images/image_upload.jpg";

const ListImagePreview = ({ displayURL, index, onDelete, isActive }) => {
  return (
    <Box
      key={index}
      position="relative"
      className="rounded-lg h-[200px] flex-shrink-0 overflow-hidden group my-1"
    >
      <img
        src={displayURL}
        alt={`Uploaded ${index}`}
        className="h-full w-auto object-cover"
      />
      {isActive && (
        <div className="absolute rounded-lg top-0 left-0 right-0 bottom-0 invisible group-hover:visible bg-[rgba(0,0,0,0.5)]">
          <Tooltip placement="bottom" title="Xóa">
            <IconButton
              color="inherit"
              className="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              onClick={onDelete}
            >
              <Delete className="!fill-white" />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Box>
  );
};

const MultipleImageUpload = ({
  images = [],
  setImages,
  size,
  imageURLs = [],
  setImageURLs,
  initialImageURLs = [],
  setInitialImageURLs,
  isActive = true,
}) => {
  const uploadFileRef = useRef(null);

  useEffect(() => {
    const convertedURLs = initialImageURLs.map((url) =>
      convertFireBaseImage(url)
    );
    if (imageURLs.length === 0) {
      setImageURLs([...imageURLs, ...convertedURLs]);
    }
  }, [initialImageURLs]);

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImageURLs = [];
    const newImages = [];

    for (let file of files) {
      if (file.size / 1024 / 1024 > 2) {
        toast.error(`Ảnh ${file.name} vượt quá giới hạn data: ${2}MB`);
        continue;
      }
      newImageURLs.push(URL.createObjectURL(file));
      newImages.push(file);
    }

    const updatedImages = [...images, ...newImages];
    const updatedImageURLs = [...imageURLs, ...newImageURLs];

    setImages(updatedImages);
    setImageURLs(updatedImageURLs);

    event.target.value = null;
  };

  const handleDelete = (index) => {
    const x = imageURLs.length - images.length;
    const newImageURLs = imageURLs.filter((_, i) => i !== index);
    const newInitialImageURLs = initialImageURLs.filter((_, i) => i !== index);
    const newImages = images.filter((_, i) => i !== index - x);
    setImages(newImages);
    setImageURLs(newImageURLs);
    setInitialImageURLs(newInitialImageURLs);
  };

  const renderImagePreview = (url, index) => {
    return (
      <ListImagePreview
        displayURL={url}
        index={index}
        onDelete={() => handleDelete(index)}
        isActive={isActive}
      />
    );
  };

  return (
    <div>
      <Box
        className="relative cursor-pointer p-2 pb-0"
        border={1}
        borderColor="grey.500"
        borderRadius={2}
        width={"100%"}
        height={size ?? 275}
        justifyContent="center"
        sx={{
          backgroundImage:
            imageURLs.length === 0 ? `url(${background})` : "none",
          backgroundPosition: "center",
          backgroundRepeat: "",
          backgroundSize: "contain",
        }}
      >
        <Box className="max-w-full max-h-full overflow-y-hidden">
          <div className="flex w-full gap-4 overflow-x-auto">
            {imageURLs.map((url, index) => renderImagePreview(url, index))}
          </div>
        </Box>
        {isActive && (
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            onClick={() => uploadFileRef.current.click()}
            className="w-full"
            sx={{
              position: "absolute",
              bottom: 0, // Adjust the value to fine-tune the positioning
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1, // Ensure the button is above the background
            }}
          >
            Ấn vào đây để tải ảnh
          </Button>
        )}
      </Box>
      <input
        accept="image/*"
        className="hidden"
        id="contained-button-file"
        type="file"
        multiple
        onChange={handleUpload}
        ref={uploadFileRef}
      />
    </div>
  );
};

export default MultipleImageUpload;
