import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { formatPrice } from "./../../../utils/formart";
import { addSponsorService } from "../../../services/SponsorService";
import { AddCircleOutline } from "@mui/icons-material";
import SingleFileUpload from "./../../../components/FileUpload/SingleFileUpload";
import useProjectStore from "../../../store/useProjectStore";
import SingleImageUpload from "./../../../components/FileUpload/SingleImageUpload";

const CreateSponsor = ({ handleCloseCreate, id }) => {
  const [sponsor, setSponsor] = useState({
    companyName: "",
    businessField: "",
    representative: "",
    representativeEmail: "",
    phoneNumber: "",
    value: "",
    note: "",
    contract: null,
    initialContractURL: null,
    logo: null,
    logoUrl: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "value") {
      const numericValue = value.replace(/\D/g, "");
      setSponsor({
        ...sponsor,
        value: numericValue,
      });
    } else {
      setSponsor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    validateField(name, value);
  };

  const validate = () => {
    let tempErrors = {};

    // Validate company name
    tempErrors.companyName = sponsor.companyName.trim()
      ? ""
      : "Tên công ty là bắt buộc và không được để trống.";

    // Validate representative
    tempErrors.representative = sponsor.representative.trim()
      ? ""
      : "Người đại diện là bắt buộc và không được để trống";

    // Validate representative email with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    tempErrors.representativeEmail = sponsor.representativeEmail.trim()
      ? emailRegex.test(sponsor.representativeEmail)
        ? ""
        : "Email người đại diện không đúng định dạng"
      : "Email người đại diện là bắt buộc và không được để trống.";

    // Validate phone number with regex for 10 digits
    const phoneRegex = /^\d{10}$/;
    tempErrors.phoneNumber = sponsor.phoneNumber.trim()
      ? phoneRegex.test(sponsor.phoneNumber)
        ? ""
        : "Số điện thoại phải có 10 chữ số"
      : "Số điện thoại là bắt buộc và không được để trống.";

    // Validate sponsor value
    tempErrors.value =
      sponsor.value && sponsor.value > 0 ? "" : "Giá trị tài trợ là bắt buộc";

    // Validate contract
    tempErrors.contract = sponsor.contract ? "" : "Hợp đồng là bắt buộc.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };

    if (name === "companyName") {
      tempErrors.companyName = value.trim()
        ? ""
        : "Tên công ty là bắt buộc và không được để trống.";
    }

    if (name === "representative") {
      tempErrors.representative = value.trim()
        ? ""
        : "Người đại diện là bắt buộc và không được để trống.";
    }

    if (name === "representativeEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      tempErrors.representativeEmail = value.trim()
        ? emailRegex.test(value)
          ? ""
          : "Email người đại diện không đúng định dạng"
        : "Email người đại diện là bắt buộc và không được để trống.";
    }

    if (name === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      tempErrors.phoneNumber = value.trim()
        ? phoneRegex.test(value)
          ? ""
          : "Số điện thoại phải có 10 chữ số"
        : "Số điện thoại là bắt buộc và không được để trống.";
    }

    if (name === "value") {
      tempErrors.value = value ? "" : "Giá trị tài trợ là bắt buộc";
      if (value && value <= 0) {
        tempErrors.value = "Giá trị tài trợ phải lớn hơn 0";
      }
    }

    if (name === "contract") {
      tempErrors.contract = value ? "" : "Hợp đồng là bắt buộc.";
    }

    setErrors(tempErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              company_name: sponsor.companyName,
              business_field: sponsor.businessField,
              representative: sponsor.representative,
              representative_email: sponsor.representativeEmail,
              phone_number: sponsor.phoneNumber,
              value: sponsor.value,
              note: sponsor.note,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (sponsor.contract) {
        formData.append("contract", sponsor.contract);
      } else {
        // If contract is not available, prevent the submission and return
        setErrors((prevErrors) => ({
          ...prevErrors,
          contract: "Hợp đồng là bắt buộc.",
        }));
        return;
      }

      if (sponsor.logo) {
        formData.append("logo", sponsor.logo);
      }
      setLoading(true);
      // console.log("formData", formData);
      try {
        await addSponsorService({ formData, id });
        toast.success("Thêm nhà tài trợ thành công");
        handleCloseCreate();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error creating sponsor:", error);
        toast.error("Đã có lỗi khi thêm nhà tài trợ!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Tên công ty"
              name="companyName"
              placeholder="Nhập tên công ty..."
              value={sponsor.companyName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
              required
            />
            <TextField
              size="small"
              label="Lĩnh vực kinh doanh"
              name="businessField"
              placeholder="Nhập lĩnh vực kinh doanh..."
              value={sponsor.businessField}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              size="small"
              label="Người đại diện"
              name="representative"
              placeholder="Nhập tên người đại diện..."
              value={sponsor.representative}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.representative}
              helperText={errors.representative}
              required
            />
            <TextField
              size="small"
              label="Email người đại diện"
              name="representativeEmail"
              placeholder="Nhập email người đại diện..."
              value={sponsor.representativeEmail}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.representativeEmail}
              helperText={errors.representativeEmail}
              required
            />
            <TextField
              size="small"
              label="Số điện thoại"
              name="phoneNumber"
              placeholder="Nhập số điện thoại..."
              value={sponsor.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
            />
            <TextField
              size="small"
              label="Số tiền tài trợ"
              name="value"
              placeholder="Nhập giá trị tài trợ..."
              value={formatPrice(sponsor.value)}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.value}
              helperText={errors.value}
              required
            />
            <TextField
              size="small"
              label="Ghi chú"
              name="note"
              placeholder="Nhập ghi chú..."
              value={sponsor.note}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6"> Hợp đồng* </Typography>
            <SingleFileUpload
              label="Tải hợp đồng"
              file={sponsor.contract}
              setFile={(file) =>
                setSponsor((prev) => ({ ...prev, contract: file }))
              }
              initialFileURL={sponsor.initialContractURL}
              setInitialFileURL={(initialContractURL) =>
                setSponsor((prevState) => ({
                  ...prevState,
                  initialContractURL: initialContractURL,
                }))
              }
            />
            {errors.contract && (
              <div className="mt-2">
                <Typography color="error" variant="body2">
                  {errors.contract}
                </Typography>
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            <SingleImageUpload
              image={sponsor.logo}
              setImage={(file) =>
                setSponsor((prev) => ({ ...prev, logo: file }))
              }
              label="Tải logo nhà tài trợ "
            ></SingleImageUpload>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 2 }}
          size="small"
          disabled={loading}
          startIcon={<AddCircleOutline />}
        >
          {loading ? <CircularProgress size={24} /> : "Thêm nhà tài trợ"}
        </Button>
      </Box>
    </div>
  );
};

export default CreateSponsor;
