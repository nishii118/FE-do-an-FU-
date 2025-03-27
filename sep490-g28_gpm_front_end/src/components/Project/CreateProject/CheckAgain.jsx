import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { ProjectContext } from "../../../context/ProjectContext";
import axiosInstance from "../../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import ListImagePreview from "../../FileDisplay/ListImagePreview";

const CheckAgain = ({ handleBack }) => {
  const { projectData } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const formData = new FormData();

    const projectPayload = {
      title: projectData.title,
      background: projectData.background,
      total_budget: projectData.totalBudget,
      amount_needed_to_raise: projectData.totalBudget,
      campaign: projectData.campaign,
      assign: {
        accounts: projectData.assign?.map((account) => ({
          account_id: account.account_id,
          email: account.email,
        })),
      },
      budgets: projectData.budgets?.map((budget) => ({
        title: budget.name,
        unit_price: budget.amount,
        note: budget.note,
      })),
      constructions: projectData.constructions?.map((construction) => ({
        title: construction.title,
        quantity: construction.quantity,
        unit: construction.unit,
        note: construction.note,
      })),
      province: projectData.province,
      district: projectData.district,
      ward: projectData.ward,
      address: projectData.address,
    };
    // console.log(projectPayload);
    // console.log(projectData);

    formData.append(
      "request",
      new Blob([JSON.stringify(projectPayload)], {
        type: "application/json",
      })
    );

    if (projectData.images.length > 0) {
      projectData.images.forEach((image) => {
        formData.append("project_images", image);
      });
    }
    if (projectData.files.length > 0) {
      projectData.files.forEach((file) => {
        formData.append("project_files", file);
      });
    }

    await axiosInstance
      .post("/admin/projects/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        toast.success("Dự án đã tạo thành công");
        navigate(routes.manageProject);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error?.response?.data?.error?.message);
        toast.error("Đã có lỗi xảy ra khi tạo dự án");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getTotalBudget = useMemo(() => {
    return new Intl.NumberFormat("vi-VN").format(projectData.totalBudget);
  }, [projectData.totalBudget]);

  return (
    <Box className="mt-6">
      <div className="flex justify-center mb-4">
        <Typography variant="h5">Xác nhận thông tin</Typography>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <TextField
            fullWidth
            name="title"
            label="Tên dự án"
            variant="outlined"
            value={projectData.title}
            size="small"
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <TextField
            fullWidth
            name="title"
            label="Tên chiến dịch"
            variant="outlined"
            value={projectData.campaign?.title}
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Bối cảnh dự án:</Typography>
          <div className="mt-4 border border-black rounded-lg min-h-[300px] h-auto">
            <div
              className="ck-content ml-2"
              dangerouslySetInnerHTML={{ __html: projectData.background }}
            ></div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="totalBudget"
            label="Tổng chi phí dự kiến"
            variant="outlined"
            value={getTotalBudget}
          />
        </Grid>
        <Grid item xs={12}>
          <div className="mt-4">
            <Typography variant="subtitle1">Ảnh dự án:</Typography>
            <ListImagePreview displayURLs={projectData.imageURLs} />
          </div>
        </Grid>
      </Grid>
      <div className="flex justify-between mt-8">
        <Button onClick={handleBack} variant="contained" className="mt-4">
          Trở lại
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={loading}
          className="mt-4 ml-2"
        >
          {loading ? <CircularProgress size={24} /> : "Tạo mới"}
        </Button>
      </div>
    </Box>
  );
};

export default CheckAgain;
