import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Close } from "@mui/icons-material";
import { fetchProjectsIdTitleService } from "../../services/PublicService";
import { toast } from "react-toastify";
import SingleImageUpload from "./../FileUpload/SingleImageUpload";
import { createChallengeService } from "../../services/ChallengeService";
import dayjs from "dayjs";
import { formatPrice } from "../../utils/formart";

const CheckboxGroup = ({ data, selectedProjects, setSelectedProjects }) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const handleProjectCheckboxChange = (projectId) => {
    setSelectedProjects((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter((id) => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  const handleCampaignCheckboxChange = (campaignId, projectIds) => {
    if (selectedCampaigns.includes(campaignId)) {
      setSelectedCampaigns((prevSelected) =>
        prevSelected.filter((id) => id !== campaignId)
      );
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => !projectIds.includes(id))
      );
    } else {
      setSelectedCampaigns((prevSelected) => [...prevSelected, campaignId]);
      setSelectedProjects((prevSelected) => [
        ...prevSelected,
        ...projectIds.filter((id) => !prevSelected.includes(id)),
      ]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectedProjects.length === getAllProjectIds().length) {
      setSelectedProjects([]);
      setSelectedCampaigns([]);
    } else {
      setSelectedProjects(getAllProjectIds());
      setSelectedCampaigns(data.map((campaign) => campaign.campaign_id));
    }
  };

  const getAllProjectIds = () => {
    return data.flatMap((campaign) =>
      campaign.projects.map((project) => project.project_id)
    );
  };

  const isCampaignChecked = (projectIds) =>
    projectIds.every((id) => selectedProjects.includes(id));

  const isAllChecked = selectedProjects.length === getAllProjectIds().length;

  return (
    <div className="border-2 border-gray-200 rounded-lg my-2 p-4">
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isAllChecked} onChange={handleSelectAllChange} />
          }
          label="Chọn tất cả"
        />
      </FormGroup>
      <Divider></Divider>
      <div className="max-h-[200px] overflow-y-auto">
        {data.map((campaign) => (
          <div key={campaign.campaign_id}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCampaignChecked(
                      campaign.projects.map((project) => project.project_id)
                    )}
                    onChange={() =>
                      handleCampaignCheckboxChange(
                        campaign.campaign_id,
                        campaign.projects.map((project) => project.project_id)
                      )
                    }
                  />
                }
                label={campaign.title}
              />
            </FormGroup>
            <div className="pl-5">
              {campaign.projects.map((project) => (
                <FormGroup key={project.project_id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedProjects.includes(project.project_id)}
                        onChange={() =>
                          handleProjectCheckboxChange(project.project_id)
                        }
                      />
                    }
                    label={project.title}
                  />
                </FormGroup>
              ))}
            </div>
            <Divider></Divider>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateChallengeDialog = ({ open, handleClose }) => {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [onGoingProjects, setOnGoingProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOnGoingProjects();
  }, []);

  const fetchOnGoingProjects = async () => {
    try {
      const response = await fetchProjectsIdTitleService();
      setOnGoingProjects(response);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi load dữ liệu!");
      console.error("Error fetching campaigns:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Tên thử thách là bắt buộc";
    if (!goal) {
      newErrors.goal = "Số tiền mong muốn đạt được là bắt buộc";
    } else if (!/^\d+$/.test(goal)) {
      newErrors.goal = "Số tiền phải là số nguyên dương";
    }
    if (!endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    } else if (new Date(endDate) < new Date()) {
      newErrors.endDate = "Ngày kết thúc phải là một ngày trong tương lai";
    }
    if (!content) newErrors.content = "Nội dung thử thách là bắt buộc";
    if (selectedProjects.length === 0)
      newErrors.selectedProjects = "Vui lòng chọn ít nhất một dự án";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const challengeData = {
      title,
      goal,
      endDate: new Date(endDate).toISOString(),
      content,
      thumbnail,
      selectedProjects,
    };
    // console.log(challengeData);
    await createChallengeService({ challengeData })
      .then((response) => {
        toast.success("Thử thách đã được tạo thành công");
        setTitle("");
        setGoal("");
        setEndDate(null);
        setContent("");
        setThumbnail(null);
        setSelectedProjects([]);
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating challenge:", error);
        toast.error("Đã có lỗi xảy ra khi tạo thử thách!");
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeGoal = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");
    setGoal(numericValue);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle className="bg-[#ff855f] text-white ">
        <div className="flex justify-between items-center font-semibold text-lg ">
          <div className="text-center w-full">Tạo thử thách mới</div>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <div>
            <div className="mt-4">
              <TextField
                label="Tên thử thách"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title || ""}
              />
            </div>
            <div className="">
              <Grid container justifyContent="space-between">
                <Grid item xs={12} lg={6} className="flex items-center">
                  <TextField
                    label="Số tiền mong muốn đạt được"
                    fullWidth
                    margin="dense"
                    value={formatPrice(goal)}
                    onChange={handleChangeGoal}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">VNĐ</InputAdornment>
                      ),
                    }}
                    error={!!errors.goal}
                    helperText={errors.goal || ""}
                  />
                </Grid>
                <Grid item xs={12} lg={6} className="flex items-center lg:pl-4">
                  <TextField
                    label="Ngày kết thúc"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate || ""}
                  />
                </Grid>
              </Grid>
            </div>
            <div>
              <TextField
                label="Nội dung thử thách"
                fullWidth
                multiline
                rows={6}
                margin="dense"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={!!errors.content}
                helperText={errors.content || ""}
              />
            </div>

            <div className="py-2">
              <p className="font-semibold text-lg">
                Lựa chọn dự án để đồng hành
              </p>
              <CheckboxGroup
                data={onGoingProjects}
                selectedProjects={selectedProjects}
                setSelectedProjects={setSelectedProjects}
              />
              {errors.selectedProjects && (
                <p className="text-red-600">{errors.selectedProjects}</p>
              )}
            </div>
            <div>
              <SingleImageUpload
                image={thumbnail}
                setImage={(file) => setThumbnail(file)}
                label="Tải ảnh bìa thử thách"
              />
            </div>
          </div>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "16px" }}
              disabled={loading}
              className="!text-white !bg-primary"
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Tạo thử thách"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeDialog;
