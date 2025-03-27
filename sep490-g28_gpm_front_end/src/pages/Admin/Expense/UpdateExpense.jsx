import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/api";
import { toast } from "react-toastify";
import { formatPrice } from "../../../utils/formart";
import MultipleFileUpload from "../../../components/FileUpload/MultipleFileUpload";
import {
  fetchExpenseDetailService,
  updateExpenseService,
} from "../../../services/ExpenseService";
import useProjectStore from "../../../store/useProjectStore";

const UpdateExpense = ({ id, handleCloseUpdate }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    title: "",
    unit_price: "",
    files: [],
    fileURLs: [],
    initialFileURLs: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      const response = await fetchExpenseDetailService({ id });
      const { title, unit_price, status, expense_files } = response;
      const initialFileURLs = expense_files.map((img) => img.file);
      setExpense({
        title,
        unit_price,
        status,
        initialFileURLs: initialFileURLs,
      });
      setLoading(false);
    } catch (error) {
      toast.error("Có lỗi khi tải dử liệu!");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "unit_price") {
      const numericValue = value.replace(/\D/g, "");
      setExpense({
        ...expense,
        unit_price: Number(numericValue),
      });
    } else {
      setExpense({
        ...expense,
        [name]: value,
      });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = expense.title.trim() ? "" : "Tên chi phí là bắt buộc và không được để trống";
    tempErrors.unit_price = expense.unit_price
      ? ""
      : "Giá trị tiền là bắt buộc";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();

      formData.append(
        "expense",
        new Blob(
          [
            JSON.stringify({
              title: expense.title,
              unit_price: expense.unit_price,
              expense_files: expense.initialFileURLs.map((url) => ({
                file: url,
              })),
            }),
          ],
          { type: "application/json" }
        )
      );

      if (expense.files) {
        expense.files.forEach((file, index) => {
          formData.append("file", file);
        });
      }

      try {
        await updateExpenseService({ formData, id });
        toast.success(`Cập nhật thành công`);
        handleCloseUpdate();
      } catch (error) {
        console.error("Error updating expense:", error.message);
        toast.error("Đã có lỗi xảy ra");
      }
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

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Tên chi phí"
              name="title"
              placeholder="Nhập tên chi phí..."
              value={expense.title}
              onChange={handleChange}
              fullWidth
              InputProps={{
                readOnly: !isMember,
              }}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Giá trị tiền (VND)"
              name="unit_price"
              placeholder="Nhập giá trị tiền..."
              value={formatPrice(expense.unit_price)}
              onChange={handleChange}
              fullWidth
              InputProps={{
                readOnly: !isMember,
              }}
              margin="normal"
              error={!!errors.unit_price}
              helperText={errors.unit_price}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"> Chứng minh </Typography>
            <MultipleFileUpload
              files={expense.files}
              fileURLs={expense.fileURLs}
              initialFileURLs={expense.initialFileURLs}
              setFiles={(files) => {
                setExpense((prevState) => ({ ...prevState, files }));
              }}
              setFileURLs={(fileURLs) =>
                setExpense((prevState) => ({ ...prevState, fileURLs }))
              }
              setInitialFileURLs={(initialFileURLs) =>
                setExpense((prevState) => ({ ...prevState, initialFileURLs }))
              }
              isActive={isMember}
            />
          </Grid>
        </Grid>
        {isMember && (
          <Box className="flex justify-start mt-4">
            <Button onClick={handleSubmit} variant="outlined" color="primary">
              Cập nhật
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default UpdateExpense;
