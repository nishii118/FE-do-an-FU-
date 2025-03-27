import React, { useState } from "react";
import { TextField, Button, Box, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";
import MultipleFileUpload from "../../../components/FileUpload/MultipleFileUpload";
import { formatPrice } from "../../../utils/formart";
import { addExpenseService } from "../../../services/ExpenseService";

const CreateExpense = ({ id, onClose, refreshData }) => {
  const [expense, setExpense] = useState({
    title: "",
    unit_price: "",
    files: [],
    fileURLs: [],
    initialFileURLs: [],
  });

  const [errors, setErrors] = useState({});

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

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    if (name === "title") {
      tempErrors.title = value.trim() ? "" : "Tên chi phí là bắt buộc";
    }

    if (name === "unit_price") {
      tempErrors.unit_price = value ? "" : "Giá trị tiền là bắt buộc";
    }

    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.title = expense.title.trim() ? "" : "Tên chi phí là bắt buộc";
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
              project_id: expense.project_id,
            }),
          ],
          { type: "application/json" }
        )
      );

      expense.files.forEach((file) => {
        formData.append("file", file);
      });

      try {
        await addExpenseService({ formData, id });
        toast.success("Thêm chi phí thành công");
        onClose();
        refreshData();
      } catch (error) {
        console.error("Đã có lỗi xảy ra:", error);
        toast.error("Đã có lỗi xảy ra!");
      }
    }
  };

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
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Tạo chi phí dự án
        </Button>
      </Box>
    </div>
  );
};

export default CreateExpense;
