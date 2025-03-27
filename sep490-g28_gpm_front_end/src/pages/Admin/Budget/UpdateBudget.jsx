import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/api";
import useProjectStore from "../../../store/useProjectStore";

const UpdateBudget = ({ id, handleCloseUpdate }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const [budget, setBudget] = useState({
    title: "",
    unit_price: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/admin/projects/budget/${id}`);
        const { title, unit_price, note } = response.data.data;
        setBudget({ title, unit_price: String(unit_price), note });
      } catch (error) {
        toast.error("Error fetching budget data");
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setBudget((prevBudget) => ({
      ...prevBudget,
      [name]: value,
    }));
  }, []);

  const validate = useCallback(() => {
    let tempErrors = {};
    tempErrors.title = budget.title.trim() ? "" : "Tên ngân sách là bắt buộc";
    tempErrors.unit_price = budget.unit_price.trim() && !isNaN(budget.unit_price) ? "" : "Giá trị tiền là bắt buộc và phải là số";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  }, [budget]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (validate()) {
        try {
          const response = await axiosInstance.put(
            `/admin/projects/budget/update/${id}`,
            {
              title: budget.title.trim(),
              unit_price: budget.unit_price.trim(),
              note: budget.note,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.code === "200") {
            toast.success("Ngân sách cập nhật thành công");
            handleCloseUpdate();
          } else {
            toast.error(response.data.message || "Error updating budget");
          }
        } catch (error) {
          console.error("Error updating budget:", error);
          toast.error("Error updating budget");
        }
      }
    },
    [budget, id, handleCloseUpdate, validate]
  );

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

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên ngân sách"
              name="title"
              placeholder="Nhập tên ngân sách..."
              value={budget.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
              InputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              label="Giá trị tiền (VND)"
              name="unit_price"
              placeholder="Nhập giá trị tiền..."
              value={budget.unit_price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.unit_price}
              helperText={errors.unit_price}
              InputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              label="Thông tin chi phí"
              name="note"
              placeholder="Cập nhật thông tin chi phí..."
              value={budget.note}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={5}
              InputProps={{
                readOnly: !isMember,
              }}
            />
          </Grid>
        </Grid>
        <Box className="flex justify-start mt-4">
          {isMember && (
            <Button type="submit" variant="outlined" color="primary">
              Cập nhật
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UpdateBudget;
