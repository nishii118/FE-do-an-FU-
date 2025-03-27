import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Grid, Typography } from "@mui/material";
import axiosInstance from "../../../services/api";
import { toast } from "react-toastify";
import { formatPrice } from "../../../utils/formart";
import SingleFileUpload from "../../../components/FileUpload/SingleFileUpload";
import { isValidRole } from "../../../utils/auth";
import useProjectStore from "../../../store/useProjectStore";
import SingleImageUpload from "../../../components/FileUpload/SingleImageUpload";
import { fetchSponsorDetailService } from "../../../services/SponsorService";
import { convertFireBaseImage } from "./../../../utils/populate";

const UpdateSponsor = ({ handleCloseUpdate, id }) => {
  // const isMember = isValidRole("ROLE_ADMIN");
  const isMember = useProjectStore((state) => state.isMember);

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

  useEffect(() => {
    console.log("isMember", isMember);
    const fetchSponsor = async () => {
      try {
        const response = await fetchSponsorDetailService({ id });
        if (response) {
          setSponsor({
            companyName: response.company_name,
            businessField: response.business_field,
            representative: response.representative,
            representativeEmail: response.representative_email,
            phoneNumber: response.phone_number,
            value: response.value,
            note: response.note,
            initialContractURL: response.contract,
            logo: response.logo ?? null,
            logoUrl: convertFireBaseImage(response.logo),
          });
        }
      } catch (error) {
        console.error("Error fetching sponsor data:", error);
        toast.error("Error fetching sponsor data");
      }
    };

    fetchSponsor();
  }, [id]);

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
  };

  const validate = () => {
    let tempErrors = {};

    // Validate company name
    tempErrors.companyName = sponsor.companyName.trim()
      ? ""
      : "Tên công ty là bắt buộc và không được để trống";

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
      : "Email người đại diện là bắt buộc và không được để trống";

    // Validate phone number with regex for 10 digits
    const phoneRegex = /^\d{10}$/;
    tempErrors.phoneNumber = sponsor.phoneNumber
      ? phoneRegex.test(sponsor.phoneNumber)
        ? ""
        : "Số điện thoại phải có 10 chữ số"
      : "Số điện thoại là bắt buộc";

    // Validate sponsor value
    tempErrors.value =
      sponsor.value && sponsor.value > 0
        ? ""
        : "Giá trị tài trợ phải lớn hơn 0";

    // Validate contract
    tempErrors.contract =
      sponsor.contract || sponsor.initialContractURL
        ? ""
        : "Hợp đồng là bắt buộc.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
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
              contract: sponsor.initialContractURL,
              note: sponsor.note,
              logo: sponsor.contract ?? null,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (sponsor.contract) {
        formData.append("contract", sponsor.contract);
      }

      if (sponsor.logo) {
        formData.append("logo", sponsor.logo);
      }

      try {
        const response = await axiosInstance.put(
          `admin/projects/sponsors/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.code === "200") {
          toast.success(`Sponsor updated successfully`);
          handleCloseUpdate();
        } else {
          toast.error("Error updating sponsor");
        }
      } catch (error) {
        console.error("Error updating sponsor:", error);
        toast.error("Error updating sponsor");
      }
    } else {
      console.log("validate fail");
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
              required
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
              inputProps={{
                readOnly: !isMember,
              }}
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
              inputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              size="small"
              label="Người đại diện"
              name="representative"
              placeholder="Nhập tên người đại diện..."
              value={sponsor.representative}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.representative}
              helperText={errors.representative}
              inputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              size="small"
              label="Email người đại diện"
              name="representativeEmail"
              placeholder="Nhập email người đại diện..."
              value={sponsor.representativeEmail}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.representativeEmail}
              helperText={errors.representativeEmail}
              inputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              size="small"
              label="Số điện thoại"
              name="phoneNumber"
              placeholder="Nhập số điện thoại..."
              value={sponsor.phoneNumber}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              inputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              size="small"
              label="Giá trị tài trợ"
              name="value"
              placeholder="Nhập giá trị tài trợ..."
              value={formatPrice(sponsor.value)}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              error={!!errors.value}
              helperText={errors.value}
              inputProps={{
                readOnly: !isMember,
              }}
            />
            <TextField
              size="small"
              label="Ghi chú"
              name="note"
              placeholder="Nhập ghi chú..."
              value={sponsor.note}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              inputProps={{
                readOnly: !isMember,
              }}
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
              isActive={isMember}
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
              initialImageURL={sponsor.logoUrl}
            ></SingleImageUpload>
          </Grid>
        </Grid>
        {isMember && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Cập nhật nhà tài trợ
          </Button>
        )}
      </Box>
    </div>
  );
};

export default UpdateSponsor;
