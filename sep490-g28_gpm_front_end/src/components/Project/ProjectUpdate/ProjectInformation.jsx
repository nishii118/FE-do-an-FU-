import {
  Grid,
  TextField,
  Button,
  Autocomplete,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  fetchProjectDetailService,
  updateProjectDetailService,
} from "../../../services/ProjectService";
import MultipleImageUpload from "../../FileUpload/MultipleImageUpload";
import { fetchCampaignsIdTitleService } from "../../../services/CampaignService";
import { toast } from "react-toastify";
import CustomEditor from "../../CKeditor/Editor";
import LocationSelector from "../../LocationSelector/LocationSelector";
import ConstructionInformation from "../ContructionInformation";
import { ProjectContext } from "../../../context/ProjectContext";
import MultipleFileUpload from "../../FileUpload/MultipleFileUpload";
import useProjectStore from "../../../store/useProjectStore";

const ProjectInformation = ({ id }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const [listCampaign, setListCampaign] = useState([]);
  const { projectData, setProjectData } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    campaign: false,
  });
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [constructionErrors, setConstructionErrors] = useState([]);
  const [
    showConstructionValidationMessage,
    setShowConstructionValidationMessage,
  ] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetchCampaignsIdTitleService();
      setListCampaign(response);
      setLoading(false);
    } catch (error) {
      toast.error("Đã có lỗi khi tải danh sách chiến dịch");
      setLoading(false);
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchProjectInformation = async () => {
    setLoading(true);
    try {
      const response = await fetchProjectDetailService(id);
      const initialImageURLs = response.images.map(
        (imageObj) => imageObj.image
      );
      const initialFileURLs = response.files.map((fileObj) => fileObj.file);
      setProjectData({
        code: response.code,
        projectId: response.project_id,
        title: response.title,
        background: response.background ?? "",
        campaign: {
          campaign_id: response.campaign.campaign_id,
          title: response.campaign.title,
        },
        address: response.address,
        ward: response.ward,
        district: response.district,
        province: response.province,
        constructions: response.constructions ?? [],
        images: [],
        imageURLs: [],
        initialImageURLs: initialImageURLs ?? [],
        fileURLs: [],
        initialFileURLs: initialFileURLs ?? [],
        files: [],
        status: response.status,
      });
      setDataReady(true);
    } catch (error) {
      toast.error("Đã có lỗi khi tải dữ liệu dự án");
      console.error("Error fetching project information:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectInformation();
    fetchCampaigns();
  }, []);

  const validateFields = () => {
    const newErrors = {
      title: projectData.title.trim() === "" || projectData.title.length > 300,
      campaign: !projectData.campaign,
    };
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some((error) => error);
    setShowValidationMessage(!isValid);
    return isValid;
  };

  const validateConstructionFields = () => {
    const newErrors = projectData.constructions.map((info) => ({
      title: String(info.title).trim() === "",
      quantity: typeof info.quantity !== "number" || info.quantity <= 0,
      unit: String(info.unit).trim() === "",
    }));
    setConstructionErrors(newErrors);
    const isValid = !newErrors.some(
      (error) => error.title || error.quantity || error.unit
    );
    setShowConstructionValidationMessage(!isValid);
    return isValid;
  };

  const handleSave = async () => {
    if (validateFields() && validateConstructionFields()) {
      const formData = new FormData();
      // console.log("projectData", projectData);
      const {
        title,
        background,
        campaign,
        constructions,
        province,
        district,
        ward,
        address,
        initialFileURLs,
        initialImageURLs,
      } = projectData ?? {};

      const projectPayload = {
        title,
        background,
        campaign,
        constructions: constructions,
        province: province,
        district: district,
        ward: ward,
        address,
        images: initialImageURLs?.map((imageURL) => ({ image: imageURL })),
        files: initialFileURLs?.map((fileURL) => ({ file: fileURL })),
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(projectPayload)], {
          type: "application/json",
        })
      );

      if (projectData.images.length > 0) {
        projectData.images.forEach((image) => {
          formData.append("images", image);
        });
      }
      if (projectData.files.length > 0) {
        projectData.files.forEach((file) => {
          formData.append("files", file);
        });
      }
      setSaveLoading(true);
      try {
        await updateProjectDetailService({ formData, id });
        fetchProjectInformation(); // Refresh data after update
        toast.success("Dự án đã được cập nhật!");
        setSaveLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.error?.toString() ||
            "Đã có lỗi khi cập nhật dự án."
        );
        console.error("Error updating project:", error);
        setSaveLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    clearError(name);
  };

  const handleSelectChange = (field, event, value) => {
    setProjectData((prevData) => ({ ...prevData, [field]: value }));
    clearError(field);
  };

  const clearError = (field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    setShowValidationMessage(false);
  };

  if (loading) {
    return (
      <div className="h-[400px] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={!isMember ? "pointer-events-none" : ""}>
      <Grid container spacing={2}>
        <Grid item xs={2} lg={2}>
          <TextField
            fullWidth
            name="code"
            label="Mã dự án"
            variant="outlined"
            value={projectData.code}
            size="small"
            onChange={handleChange}
            InputProps={{
              readOnly: true,
            }}
            error={errors.title}
            required
          />
        </Grid>
        <Grid item xs={10} lg={6}>
          <TextField
            fullWidth
            name="title"
            label="Tên dự án"
            variant="outlined"
            value={projectData?.title}
            size="small"
            onChange={handleChange}
            InputProps={{
              readOnly: !isMember,
            }}
            error={errors.title}
            required
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          {isMember ? (
            <Autocomplete
              onChange={(event, value) =>
                handleSelectChange("campaign", event, value)
              }
              id="campaign"
              options={listCampaign ?? []}
              getOptionLabel={(option) => option.title || ""}
              isOptionEqualToValue={(option, value) =>
                option.campaign_id === value.campaign_id
              }
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
          ) : (
            <Autocomplete
              readOnly
              onChange={(event, value) =>
                handleSelectChange("campaign", event, value)
              }
              id="campaign"
              options={listCampaign}
              getOptionLabel={(option) => option.title || ""}
              isOptionEqualToValue={(option, value) =>
                option.campaign_id === value.campaign_id
              }
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
          )}
        </Grid>
        {showValidationMessage && (
          <Grid item xs={12}>
            <Typography color="error" variant="body2">
              Vui lòng điền đầy đủ thông tin các trường bắt buộc (Tên dự án,
              Chiến dịch, Địa điểm, Thông tin xây dựng).
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <ConstructionInformation
            errors={constructionErrors}
            setErrors={setConstructionErrors}
            showValidationMessage={showConstructionValidationMessage}
            setShowValidationMessage={setShowConstructionValidationMessage}
            isActive={isMember}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <div className="">
            <Typography variant="h6">Địa điểm</Typography>
            <LocationSelector isActive={isMember} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Bối cảnh dự án</Typography>
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
          <Typography variant="h6">Ảnh dự án</Typography>
          {dataReady && (
            <MultipleImageUpload
              images={projectData.images}
              setImages={(images) =>
                setProjectData((prevData) => ({ ...prevData, images }))
              }
              imageURLs={projectData.imageURLs}
              setImageURLs={(imageURLs) =>
                setProjectData((prevData) => ({
                  ...prevData,
                  imageURLs,
                }))
              }
              initialImageURLs={projectData.initialImageURLs}
              setInitialImageURLs={(initialImageURLs) =>
                setProjectData((prevData) => ({
                  ...prevData,
                  initialImageURLs,
                }))
              }
              isActive={isMember}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Các tài liệu liên quan</Typography>
          <MultipleFileUpload
            files={projectData?.files}
            fileURLs={projectData?.fileURLs}
            initialFileURLs={projectData?.initialFileURLs}
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
            isActive={isMember}
          />
        </Grid>
        {isMember && (
          <Grid item xs={12}>
            <Button onClick={handleSave} variant="contained" color="primary">
              {saveLoading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Lưu"
              )}
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default ProjectInformation;
