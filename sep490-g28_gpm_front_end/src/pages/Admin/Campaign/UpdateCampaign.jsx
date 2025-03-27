import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Typography, TextField, Button, Box, Grid } from "@mui/material";
import { routes } from "../../../config";
import { convertFireBaseImage } from "../../../utils/populate";
import SingleImageUpload from "../../../components/FileUpload/SingleImageUpload";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { toast } from "react-toastify";
import {
  fetchCampaignDetailService,
  updateCampaignService,
} from "../../../services/CampaignService";

const UpdateCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchCampaignDetail();
  }, [id]);

  const fetchCampaignDetail = async () => {
    try {
      const data = await fetchCampaignDetailService(id);
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!campaign.title) {
      errors.title = "Tên chiến dịch không được để trống";
    }
    if (!campaign.description) {
      errors.description = "Nội dung không được để trống";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append(
      "campaign",
      new Blob(
        [
          JSON.stringify({
            title: campaign.title,
            description: campaign.description,
            isActive: campaign.isActive,
            thumbnail: isUploaded ? "" : campaign.thumbnail,
          }),
        ],
        { type: "application/json" }
      )
    );
    formData.append("image", thumbnail);
    try {
      const response = await updateCampaignService(id, formData);
      if (response && response.status === 200) {
        toast.success("Cập nhật thông tin chiến dịch thành công");
        navigate("/admin/manage-campaign");
      } else {
        toast.error("Error updating campaign");
      }
    } catch (error) {
      toast.error(error.response.data.error.message);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper className="w-full overflow-hidden mt-8 p-4">
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          There was an error fetching the data: {error.message}
        </Typography>
      </Paper>
    );
  }

  return (
    <PageHeader
      breadcrumbs={[
        { title: "Dashboard", path: routes.admin },
        { title: "Quản lí chiến dịch", path: routes.manageCampaign },
        { title: "Cập nhật chiến dịch" },
      ]}
      pageTitle={"Cập nhật chiến dịch"}
    >
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên chiến dịch"
              name="title"
              value={campaign.title}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              error={!!validationErrors.title}
              helperText={validationErrors.title}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nội dung"
              name="description"
              value={campaign.description}
              onChange={handleInputChange}
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              className="mt-5"
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SingleImageUpload
              image={thumbnail}
              setImage={setThumbnail}
              label="Tải ảnh bìa"
              setIsUploaded={setIsUploaded}
              initialImageURL={
                campaign.thumbnail
                  ? convertFireBaseImage(campaign.thumbnail)
                  : null
              }
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/manage-campaign")}
          >
            Thoát
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </Box>
      </div>
    </PageHeader>
  );
};

export default UpdateCampaign;
