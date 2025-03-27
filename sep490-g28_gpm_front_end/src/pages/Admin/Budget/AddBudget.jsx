import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../../services/api";
import { toast } from "react-toastify";
import { AddCircleOutline } from "@mui/icons-material";

const AddBudget = ({ id, handleCloseCreate }) => {
  const [budgets, setBudgets] = useState([
    { title: "", unit_price: "", note: "" },
    { title: "", unit_price: "", note: "" },
  ]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [errors, setErrors] = useState([]);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const handleAddRow = () => {
    setBudgets([...budgets, { title: "", unit_price: "", note: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updatedBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(updatedBudgets);
    updateTotalCost(updatedBudgets);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedBudgets = [...budgets];

    if (name === "unit_price") {
      const numericValue = value.replace(/\D/g, "");
      updatedBudgets[index][name] = numericValue;
    } else {
      updatedBudgets[index][name] = value;
    }

    setBudgets(updatedBudgets);
    updateTotalCost(updatedBudgets);
    clearError(index, name);
  };

  const updateTotalCost = (updatedBudgets) => {
    const total = updatedBudgets.reduce(
      (sum, item) => sum + parseFloat(item.unit_price || 0),
      0
    );
    setTotalBudget(total);
  };

  const formatPrice = (value) => {
    if (!value) return "";
    const number = parseFloat(value.replace(/,/g, ""));
    return number.toLocaleString("vi-VN");
  };

  const validateFields = () => {
    const newErrors = budgets.map((budget) => ({
      title: budget.title.trim() === "",
      unit_price: budget.unit_price.trim() === "" || isNaN(budget.unit_price),
    }));
    setErrors(newErrors);
    const isValid = !newErrors.some((error) => error.title || error.unit_price);
    setShowValidationMessage(!isValid);
    return isValid;
  };

  const clearError = (index, field) => {
    const updatedErrors = [...errors];
    if (field === "title" && updatedErrors[index]?.title) {
      updatedErrors[index].title = false;
    }
    if (field === "unit_price" && updatedErrors[index]?.unit_price) {
      updatedErrors[index].unit_price = false;
    }
    setErrors(updatedErrors);
    setShowValidationMessage(false);
  };

  const handleSaveData = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/admin/projects/${id}/budget/add`,
        budgets
      );
      if (response.data.code === "200") {
        toast.success("Đã thêm chi phí thành công");
        handleCloseCreate();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  return (
    <Box className="mt-6 flex flex-col items-center">
      <div className="flex justify-center">
        <Typography variant="h5">CHI PHÍ DỰ KIẾN</Typography>
      </div>
      {showValidationMessage && (
        <Box sx={{ mt: 2 }}>
          {errors.map((error, index) => (
            <div key={index}>
              {error.title && (
                <Typography color="error" variant="body2">
                  Vui lòng nhập Tên khoản tiền cho hàng {index + 1}.
                </Typography>
              )}
              {error.unit_price && (
                <Typography color="error" variant="body2">
                  Vui lòng nhập Số tiền hợp lệ cho hàng {index + 1}.
                </Typography>
              )}
            </div>
          ))}
        </Box>
      )}
      <div className="mt-8  w-full">
        <div>
          {budgets.map((budget, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: 2,
                justifyContent: "center",
              }}
            >
              <TextField
                label="Tên khoản tiền"
                name="title"
                value={budget.title}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "50%" }}
                required
                error={errors[index]?.title}
              />
              <TextField
                label="Số tiền"
                name="unit_price"
                type="text"
                value={formatPrice(budget.unit_price)}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "50%" }}
                required
                error={errors[index]?.unit_price}
              />
              <TextField
                label="Thông tin chi phí"
                name="note"
                placeholder="Nhập thông tin chi phí..."
                value={budget.note}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "100%" }}
                multiline
              />
              <IconButton onClick={() => handleDeleteRow(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: "flex", marginTop: 2 }}>
            <Button
              onClick={handleAddRow}
              variant="contained"
              size="small"
              startIcon={<AddCircleOutline />}
            >
              Thêm
            </Button>
          </Box>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Tổng chi phí: {totalBudget.toLocaleString("vi-VN")} VND
          </Typography>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            onClick={handleSaveData}
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Tạo chi phí
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default AddBudget;

