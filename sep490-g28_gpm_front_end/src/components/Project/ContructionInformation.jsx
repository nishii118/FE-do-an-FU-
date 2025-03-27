import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProjectContext } from "../../context/ProjectContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const units = ["phòng học", "nhà", "cầu", "chiếc", "bộ"];

const ConstructionInformation = ({
  errors,
  setErrors,
  showValidationMessage,
  setShowValidationMessage,
  isActive = true,
}) => {
  const { projectData, setProjectData } = useContext(ProjectContext);

  useEffect(() => {
    if (projectData.constructions.length === 0) {
      handleConstructionAddRow();
    }
  }, []);

  const handleConstructionAddRow = () => {
    setProjectData((prevData) => {
      const cloneData = [...prevData.constructions];
      cloneData.push({
        construction_id: "",
        title: "",
        quantity: 1,
        unit: "",
        note: "",
      });
      return { ...prevData, constructions: cloneData };
    });
  };

  const handleConstructionDeleteRow = (index) => {
    const updatedConstructions = projectData.constructions.filter(
      (_, i) => i !== index
    );
    setProjectData((prevData) => ({
      ...prevData,
      constructions: updatedConstructions,
    }));
  };

  const handleConstructionInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedConstructions = [...projectData.constructions];
    updatedConstructions[index][name] =
      name === "quantity" ? Number(value) : value;
    setProjectData((prevData) => ({
      ...prevData,
      constructions: updatedConstructions,
    }));
    clearConstructionError(index, name);
  };

  const handleUnitChange = (event, value, index) => {
    const updatedConstructions = [...projectData.constructions];
    updatedConstructions[index].unit = value;
    setProjectData((prevData) => ({
      ...prevData,
      constructions: updatedConstructions,
    }));
    clearConstructionError(index, "unit");
  };

  const clearConstructionError = (index, field) => {
    const updatedErrors = [...errors];
    if (field === "title" && updatedErrors[index]?.title) {
      updatedErrors[index].title = false;
    }
    if (field === "quantity" && updatedErrors[index]?.quantity) {
      updatedErrors[index].quantity = false;
    }
    if (field === "unit" && updatedErrors[index]?.unit) {
      updatedErrors[index].unit = false;
    }
    setErrors(updatedErrors);
    setShowValidationMessage(false);
  };

  return (
    <div className="mt-2">
      <Typography variant="h6">Thông tin xây dựng</Typography>
      {showValidationMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          Vui lòng điền đầy đủ thông tin các trường bắt buộc (Tên công trình, Số
          lượng, Đơn vị).
        </Typography>
      )}
      {projectData.constructions?.map((info, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            marginTop: 2,
            justifyContent: "center",
          }}
        >
          <TextField
            label="Tên công trình"
            name="title"
            value={info.title}
            onChange={(e) => handleConstructionInputChange(e, index)}
            size="small"
            sx={{ width: "40%" }}
            required
            error={errors[index]?.title}
            InputProps={{
              readOnly: !isActive,
            }}
          />
          <TextField
            label="Số lượng"
            name="quantity"
            type="number"
            value={info.quantity}
            onChange={(e) => handleConstructionInputChange(e, index)}
            size="small"
            sx={{ width: "20%" }}
            required
            error={errors[index]?.quantity}
            InputProps={{
              readOnly: !isActive,
              inputProps: { min: 1 },
            }}
          />
          <FormControl className="w-1/3" error={!!errors[index]?.unit}>
            <InputLabel size="small">Đơn vị</InputLabel>
            <Select
              value={info.unit || ""}
              onChange={(event) =>
                handleUnitChange(event, event.target.value, index)
              }
              label="Đơn vị"
              size="small"
              required
              InputProps={{
                readOnly: !isActive,
              }}
            >
              {units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mô tả"
            name="note"
            value={info.note}
            onChange={(e) => handleConstructionInputChange(e, index)}
            size="small"
            sx={{ width: "100%" }}
            InputProps={{
              readOnly: !isActive,
            }}
          />
          {isActive && (
            <IconButton
              onClick={() => handleConstructionDeleteRow(index)}
              disabled={projectData.constructions.length === 1}
            >
              <DeleteIcon color="error" />
            </IconButton>
          )}
        </Box>
      ))}
      {isActive && (
        <Box sx={{ display: "flex", marginTop: 2 }}>
          <Button
            onClick={handleConstructionAddRow}
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
          >
            Thêm
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ConstructionInformation;
