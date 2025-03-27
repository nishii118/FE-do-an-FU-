import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { convertFireBaseImage } from "../../../utils/populate";
import { routes } from "../../../config";
import PageHeader from "../../../components/PageHeader/PageHeader";
import NoImage from "../../../../src/assets/images/no-image.png";
import { fetchCampaignDetailService } from "../../../services/CampaignService";
import { isValidRole } from "../../../utils/auth";


const CampaignDetails = () => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaignDetail();
  }, [id]);

  const getCampaignDetail = async () => {
    try {
      const data = await fetchCampaignDetailService(id);
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
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
        <CircularProgress />
      </Box>
    );
  }

  const handleEditClick = () => {
    navigate(`/admin/update-campaign/${id}`);
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { title: "Dashboard", path: routes.admin },
          { title: "Quản lí chiến dịch", path: routes.manageCampaign },
          { title: "Chi tiết chiến dịch" },
        ]}
        pageTitle={"Chi tiết chiến dịch"}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên chiến dịch"
              name="title"
              value={campaign.title}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nội dung"
              name="description"
              value={campaign.description}
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Ảnh bìa chiến dịch: </Typography>
            <div className="border-gray-600 border min-h-[250px] max-h-[300px] flex flex-col items-center justify-center rounded-md">
              <Box
                position="relative"
                className="rounded-lg h-[240px] flex-shrink-0 overflow-hidden group"
              >
                <img
                  src={
                    campaign.thumbnail
                      ? convertFireBaseImage(campaign.thumbnail)
                      : NoImage
                  }
                  alt="Campaign thumbnail"
                  className="h-full w-auto object-cover"
                />
              </Box>
            </div>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/manage-campaign")}
          >
            Thoát
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Cập nhật
            </Button>
          )}
        </Box>
      </PageHeader>
    </div>
  );
};

export default CampaignDetails;
