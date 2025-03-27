import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import MultipleImageUpload from "../../FileUpload/MultipleImageUpload";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import { ProjectContext } from "../../../context/ProjectContext";
import { fetchCampaignsIdTitleService } from "../../../services/CampaignService";
import { toast } from "react-toastify";
import { fetchAccountsIdEmailService } from "../../../services/AccountService";
import CustomEditor from "../../CKeditor/Editor";
import LocationSelector from "./../../LocationSelector/LocationSelector";
import ConstructionInformation from "../ContructionInformation";
import MultipleFileUpload from "../../FileUpload/MultipleFileUpload";

const ProjectInformation = ({ handleNext }) => {
  const { projectData, setProjectData } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [listCampaign, setListCampaign] = useState([]);
  const [listAccount, setListAccount] = useState([]);
  const [errors, setErrors] = useState({
    title: false,
    campaign: false,
    address: false,
  });

  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [constructionErrors, setConstructionErrors] = useState([]);
  const [
    showConstructionValidationMessage,
    setShowConstructionValidationMessage,
  ] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const response = await fetchCampaignsIdTitleService();
      setListCampaign(response);
    } catch (error) {
      toast.error(error);
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetchAccountsIdEmailService();
      setListAccount(response);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
    clearError(e.target.name);
  };

  const handleSelectChange = (field, event, value) => {
    setProjectData((prevData) => ({ ...prevData, [field]: value }));
    clearError(field);
  };

  const clearError = (field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    setShowValidationMessage(false);
  };

  const validateFields = () => {
    const newErrors = {
      title: projectData.title.trim() === "" || projectData.title.length > 300,
      campaign: !projectData.campaign,
      address:
        !projectData.province || !projectData.district || !projectData.ward,
    };
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some((error) => error);
    setShowValidationMessage(!isValid);
    return isValid;
  };

  const validateConstructionFields = () => {
    const newErrors = projectData.constructions.map((info) => ({
      title: info.title.trim() === "",
      quantity: typeof info.quantity !== "number" || info.quantity <= 0,
      unit: info.unit.trim() === "",
    }));
    setConstructionErrors(newErrors);
    const isValid = !newErrors.some(
      (error) => error.title || error.quantity || error.unit
    );
    setShowConstructionValidationMessage(!isValid);
    return isValid;
  };

  const handleNextClick = () => {
    if (validateFields() && validateConstructionFields()) {
      console.log(projectData);
      handleNext();
    } else {
      toast.error(
        "Vui lòng điền đầy đủ thông tin các trường bắt buộc (Tên dự án, Chiến dịch, Địa điểm, Thông tin xây dựng)."
      );
    }
  };

  return (
    <div>
      <Box className="mt-6 ">
        <div className="flex justify-center">
          <Typography variant="h5">THÔNG TIN CHI TIẾT DỰ ÁN</Typography>
        </div>
        {showValidationMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            Vui lòng điền đầy đủ thông tin các trường bắt buộc (Tên dự án, Chiến
            dịch, Địa điểm, Thông tin xây dựng).
          </Typography>
        )}
        <div className="mt-8">
          <Grid container spacing={2}>
            <Grid item sm={12} lg={8}>
              <TextField
                fullWidth
                name="title"
                label="Tên dự án"
                variant="outlined"
                value={projectData.title}
                onChange={handleChange}
                size="small"
                required={true}
                error={errors.title}
              />
            </Grid>

            <Grid item sm={12} lg={4}>
              <Autocomplete
                onChange={(event, value) =>
                  handleSelectChange("campaign", event, value)
                }
                id="campaign"
                options={listCampaign}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={projectData.campaign || null}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chiến dịch"
                    error={errors.campaign}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <div className="mb-2">
                <Typography variant="h6">Địa điểm</Typography>
              </div>
              <LocationSelector />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <div className="mb-2">
                <Typography variant="h6">Bối cảnh dự án</Typography>
              </div>

              <CustomEditor
                editorData={projectData.background}
                setEditorData={(editorData) =>
                  setProjectData((prevData) => ({
                    ...prevData,
                    background: editorData,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <ConstructionInformation
                errors={constructionErrors}
                setErrors={setConstructionErrors}
                showValidationMessage={showConstructionValidationMessage}
                setShowValidationMessage={setShowConstructionValidationMessage}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <div className="mb-2">
                <Typography variant="h6">Ảnh dự án</Typography>
              </div>

              <MultipleImageUpload
                images={projectData.images}
                imageURLs={projectData.imageURLs}
                initialImageURLs={projectData.initialImageURLs}
                setImages={(images) => {
                  setProjectData((prevState) => ({ ...prevState, images }));
                }}
                setImageURLs={(imageURLs) =>
                  setProjectData((prevState) => ({ ...prevState, imageURLs }))
                }
                setInitialImageURLs={(initialImageURLs) =>
                  setProjectData((prevState) => ({
                    ...prevState,
                    initialImageURLs,
                  }))
                }
                label="Upload Project Images"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Các tài liệu liên quan</Typography>
              <MultipleFileUpload
                files={projectData.files}
                fileURLs={projectData.fileURLs}
                initialFileURLs={projectData.initialFileURLs}
                setFiles={(files) => {
                  setProjectData((prevState) => ({ ...prevState, files }));
                }}
                setFileURLs={(fileURLs) =>
                  setProjectData((prevState) => ({ ...prevState, fileURLs }))
                }
                setInitialFileURLs={(initialFileURLs) =>
                  setProjectData((prevState) => ({
                    ...prevState,
                    initialFileURLs,
                  }))
                }
                label="Tải các tài liệu liên quan"
              ></MultipleFileUpload>
            </Grid>
            <Grid item sm={12}>
              <Autocomplete
                onChange={(event, value) =>
                  handleSelectChange("assign", event, value)
                }
                multiple
                fullWidth
                id="tags-outlined"
                options={listAccount}
                getOptionLabel={(option) => option.email || ""}
                value={projectData.assign}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Thành viên tham gia dự án"
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <Button
            onClick={() => {
              navigate(routes.manageProject);
            }}
            variant="contained"
            className="mt-4"
          >
            Thoát
          </Button>
          <Button
            onClick={handleNextClick}
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Tiếp tục
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default ProjectInformation;
