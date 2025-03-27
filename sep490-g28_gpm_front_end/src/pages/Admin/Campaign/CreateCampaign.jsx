import React, { useState } from "react";
import { TextField, Button, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import { toast } from "react-toastify";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { addCampaignService } from "../../../services/CampaignService";
import SingleImageUpload from "../../../components/FileUpload/SingleImageUpload";

const CreateCampaign = () => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
  });

  const [thumbnail, setThumbnail] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign({
      ...campaign,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    if (name === "title") {
      tempErrors.title = value.trim()
        ? ""
        : "Tên chiến dịch là bắt buộc và không được để trống.";
    }

    if (name === "description") {
      tempErrors.description = value.trim()
        ? ""
        : "Nội dung là bắt buộc và không được để trống.";
    }

    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = {};
    // Use trim() to ensure the values are not just spaces
    tempErrors.title = campaign.title.trim()
      ? ""
      : "Tên chiến dịch là bắt buộc và không được để trống.";
    tempErrors.description = campaign.description.trim()
      ? ""
      : "Nội dung là bắt buộc và không được để trống.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append(
        "campaign",
        new Blob(
          [
            JSON.stringify({
              title: campaign.title,
              description: campaign.description,
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("image", thumbnail);

      try {
        const data = await addCampaignService(formData);
        // console.log("Campaign created:", data);
        toast.success(data.message);
        navigate(routes.manageCampaign);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Quản lí chiến dịch", path: routes.manageCampaign },
        { title: "Tạo chiến dịch mới" },
      ]}
      pageTitle={"Tạo chiến dịch mới"}
    >
      <div className="w-full flex justify-center">
        <div className="max-w-[960px] w-full">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tên chiến dịch"
                name="title"
                placeholder="Nhập tên chiến dịch..."
                value={campaign.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nội dung"
                name="description"
                placeholder="Nhập nội dung chiến dịch..."
                value={campaign.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <SingleImageUpload
                image={thumbnail}
                setImage={setThumbnail}
                label="Tải ảnh bìa "
                setIsUploaded={setIsUploaded}
              />
            </Grid>
          </Grid>
          <div>
            <Box display="flex" justifyContent="space-between" marginTop="20px">
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(routes.manageCampaign);
                }}
              >
                Thoát
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Tạo mới
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </PageHeader>
  );
};

export default CreateCampaign;
