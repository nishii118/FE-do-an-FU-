import React, { useRef } from "react";
import { Avatar, Button } from "@mui/material";
import { convertFireBaseImage } from "../../utils/populate";
import defaultAvatar from "../../assets/images/default-avatar.png";
import { toast } from "react-toastify";

const UploadAvatar = ({ image, setImage, initialImage, isEditing }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        // Check if file size is less than or equal to 5MB
        setImage(file);
      } else {
        toast.warning("Dung lượng ảnh tối đa là 2MB");
        event.target.value = null; // Clear the input to allow re-upload
        return; // Exit early to prevent setting the image or imageURL
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const displayImage = () => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (initialImage) {
      return convertFireBaseImage(initialImage);
    } else {
      return defaultAvatar;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar
        src={displayImage()}
        alt="Avatar"
        sx={{ width: 128, height: 128 }}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        disabled={!isEditing}
        sx={{
          borderRadius: "16px",
          fontWeight: "bold",
        }}
        className="enabled:!bg-primary !disabled:bg-slate-500"
      >
        Chọn Ảnh
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/jpeg, image/png"
      />
      <span className="text-gray-600">
        Dụng lượng file tối đa 2 MB, Định dạng: JPEG, PNG
      </span>
    </div>
  );
};

export default UploadAvatar;
