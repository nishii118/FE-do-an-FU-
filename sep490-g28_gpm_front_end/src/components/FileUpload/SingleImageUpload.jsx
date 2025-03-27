import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Typography, Button, Tooltip } from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import background from "../../assets/images/image_upload.jpg";
import { toast } from "react-toastify";

const SingleImageUpload = ({
  image,
  setImage,
  label,
  setIsUploaded = () => null,
  initialImageURL,
  size,
}) => {
  const [imageURL, setImageURL] = useState(initialImageURL);
  const uploadFileRef = useRef(null);

  useEffect(() => {
    if (initialImageURL) {
      setImageURL(initialImageURL);
    }
  }, [initialImageURL]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        // Check if file size is less than or equal to 2MB
        const newImageURL = URL.createObjectURL(file);
        if (setIsUploaded) {
          setIsUploaded(true);
        }
        setImage(file);
        setImageURL(newImageURL);
      } else {
        toast.warning("Dung lượng ảnh tối đa là 2MB");
        event.target.value = null; // Clear the input to allow re-upload
        return; // Exit early to prevent setting the image or imageURL
      }
    }
  };

  const handleDelete = () => {
    setIsUploaded(true);
    setImage(null);
    setImageURL("");
    if (uploadFileRef.current) {
      uploadFileRef.current.value = null; // Reset the input value after deletion
    }
  };

  return (
    <div className=" h-full w-full">
      <Box
        className="relative cursor-pointer p-2 pb-0 flex justify-center"
        border={1}
        borderColor="grey.500"
        borderRadius={2}
        width={"100%"}
        height={size ?? 293}
        sx={{
          backgroundImage: imageURL ? "none" : `url(${background})`,
          backgroundPosition: "center",
          backgroundRepeat: "",
          backgroundSize: "contain",
        }}
      >
        {imageURL && (
          <Box
            position="relative"
            className="rounded-lg h-[240px] w-full  flex-shrink-0 overflow-hidden group my-1"
          >
            <div className="h-full flex justify-center">
              <img
                src={imageURL}
                alt="ImageURL"
                className="h-full object-contain"
              />
            </div>
            <div className="absolute rounded-lg top-0 left-0 right-0 bottom-0 invisible group-hover:visible bg-[rgba(0,0,0,0.5)]">
              <Tooltip placement="bottom" title="Xóa">
                <IconButton
                  color="inherit"
                  className="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={handleDelete}
                >
                  <Delete className="!fill-white" />
                </IconButton>
              </Tooltip>
            </div>
          </Box>
        )}
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
          {label ? label : "Ấn vào đây để tải ảnh"}
        </Button>
      </Box>
      <input
        accept="image/*"
        className="hidden"
        id="contained-button-file"
        type="file"
        onChange={handleUpload}
        ref={uploadFileRef}
      />
    </div>
  );
};

export default SingleImageUpload;
