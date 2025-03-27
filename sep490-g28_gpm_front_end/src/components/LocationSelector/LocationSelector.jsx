import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { ProjectContext } from "../../context/ProjectContext";

const LocationSelector = () => {
  const { projectData, setProjectData } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [errors, setErrors] = useState({});
  const isDisableDistrict = !projectData.province;
  const isDisableWard = !projectData.district;

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://esgoo.net/api-tinhthanh/1/0.htm"
      );
      if (response.data.error === 0) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = useCallback(
    async (provinceName) => {
      try {
        const province = provinces.find((p) => p.full_name === provinceName);
        if (!province) return;
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/2/${province.id}.htm`
        );
        if (response.data.error === 0) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [provinces]
  );

  const fetchWards = useCallback(
    async (districtName) => {
      try {
        const district = districts.find((d) => d.full_name === districtName);
        if (!district) return;
        const response = await axios.get(
          `https://esgoo.net/api-tinhthanh/3/${district.id}.htm`
        );
        if (response.data.error === 0) {
          setWards(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [districts]
  );

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (projectData.province) {
      fetchDistricts(projectData.province);
    }
  }, [fetchDistricts, projectData.province]);

  useEffect(() => {
    if (projectData.district) {
      fetchWards(projectData.district);
    }
  }, [fetchWards, projectData.district]);

  const handleProvinceChange = (event, value) => {
    setProjectData((prevData) => ({
      ...prevData,
      province: value ? value.full_name : "",
      district: "",
      ward: "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, province: "" }));
    if (value) {
      fetchDistricts(value.full_name);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = (event, value) => {
    setProjectData((prevData) => ({
      ...prevData,
      district: value ? value.full_name : "",
      ward: "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, district: "" }));
    if (value) {
      fetchWards(value.full_name);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (event, value) => {
    setProjectData((prevData) => ({
      ...prevData,
      ward: value ? value.full_name : "",
    }));
    setErrors((prevErrors) => ({ ...prevErrors, ward: "" }));
  };

  const handleBlur = (field) => {
    if (!projectData[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } là bắt buộc`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <Box className="mt-2">
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={6} md={4}>
          <Autocomplete
            size="small"
            options={provinces}
            getOptionLabel={(option) => option.full_name}
            onChange={handleProvinceChange}
            onBlur={() => handleBlur("province")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn Tỉnh Thành"
                error={!!errors.province}
                helperText={errors.province}
                required
              />
            )}
            value={
              provinces.find(
                (province) => province.full_name === projectData.province
              ) || null
            }
            isOptionEqualToValue={(option, value) =>
              option.full_name === value.full_name
            }
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <Autocomplete
            size="small"
            options={districts}
            getOptionLabel={(option) => option.full_name}
            onChange={handleDistrictChange}
            onBlur={() => handleBlur("district")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn Quận Huyện"
                error={!!errors.district}
                helperText={errors.district}
                required
              />
            )}
            value={
              districts.find(
                (district) => district.full_name === projectData.district
              ) || null
            }
            isOptionEqualToValue={(option, value) =>
              option.full_name === value.full_name
            }
            disabled={isDisableDistrict}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <Autocomplete
            size="small"
            options={wards}
            getOptionLabel={(option) => option.full_name}
            onChange={handleWardChange}
            onBlur={() => handleBlur("ward")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn Phường Xã"
                error={!!errors.ward}
                helperText={errors.ward}
                required
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.full_name === value.full_name
            }
            value={
              wards.find((ward) => ward.full_name === projectData.ward) || null
            }
            disabled={isDisableWard}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="address"
            label="Địa chỉ chi tiết"
            variant="outlined"
            value={projectData.address}
            onChange={(event) =>
              setProjectData((prevData) => ({
                ...prevData,
                address: event.target.value,
              }))
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationSelector;
