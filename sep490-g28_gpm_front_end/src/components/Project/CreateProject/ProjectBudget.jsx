import React, { useContext, useEffect, useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProjectContext } from "../../../context/ProjectContext";

const ProjectBudget = ({ handleBack, handleNext }) => {
  const { projectData, setProjectData } = useContext(ProjectContext);
  const [budgets, setBudgets] = useState(
    projectData.budgets && projectData.budgets.length > 0
      ? projectData.budgets
      : [
          { name: "", amount: "", description: "" },
          { name: "", amount: "", description: "" },
          { name: "", amount: "", description: "" },
        ]
  );
  const [totalBudget, setTotalBudget] = useState(projectData.totalBudget || 0);
  const [errors, setErrors] = useState([]);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const handleAddRow = () => {
    setBudgets([...budgets, { name: "", amount: "", description: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updatedBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(updatedBudgets);
    updateTotalCost(updatedBudgets);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedBudgets = [...budgets];

    if (name === "amount") {
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
      (sum, item) => sum + parseFloat(item.amount || 0),
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
      name: budget.name.trim() === "",
      amount: budget.amount.trim() === "",
    }));
    setErrors(newErrors);
    const isValid = !newErrors.some((error) => error.name || error.amount);
    setShowValidationMessage(!isValid);
    return isValid;
  };

  const clearError = (index, field) => {
    const updatedErrors = [...errors];
    if (field === "name" && updatedErrors[index]?.name) {
      updatedErrors[index].name = false;
    }
    if (field === "amount" && updatedErrors[index]?.amount) {
      updatedErrors[index].amount = false;
    }
    setErrors(updatedErrors);
    setShowValidationMessage(false);
  };

  const handleSaveData = () => {
    setProjectData((prevData) => ({
      ...prevData,
      budgets: budgets,
      totalBudget: totalBudget,
    }));
  };

  const handleNextStep = () => {
    if (validateFields()) {
      handleSaveData();
      handleNext();
    }
  };

  const handleBackStep = () => {
    if (validateFields()) {
      handleSaveData();
      handleBack();
    }
  };

  return (
    <Box className="mt-6 flex flex-col items-center">
      <div className="flex justify-center">
        <Typography variant="h5">CHI PHÍ DỰ KIẾN</Typography>
      </div>
      {showValidationMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Vui lòng điền đầy đủ thông tin các trường bắt buộc (Tên khoản tiền và
          Số tiền).
        </Typography>
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
                name="name"
                value={budget.name}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "50%" }}
                required
                error={errors[index]?.name}
              />
              <TextField
                label="Số tiền"
                name="amount"
                type="text"
                value={formatPrice(budget.amount)}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "50%" }}
                required
                error={errors[index]?.amount}
              />
              <TextField
                label="Mô tả"
                name="description"
                value={budget.description}
                onChange={(e) => handleInputChange(e, index)}
                size="small"
                sx={{ width: "100%" }}
              />
              <IconButton onClick={() => handleDeleteRow(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: "flex", marginTop: 2 }}>
            <Button onClick={handleAddRow} variant="contained" size="small">
              Thêm chi phí
            </Button>
          </Box>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Tổng chi phí: {totalBudget.toLocaleString("vi-VN")} VND
          </Typography>
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={handleBackStep} variant="contained" className="mt-4">
            Trở lại
          </Button>
          <Button
            onClick={handleNextStep}
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default ProjectBudget;
