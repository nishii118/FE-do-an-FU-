import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { fetchListChallengeAdminService } from "../../../services/ChallengeService";
import { toast } from "react-toastify";
import BaseTable from "../../../components/Table/BaseTable";
import { formatDate, formatPrice } from "../../../utils/formart";
import { fetchSystemUserAccountsService } from "../../../services/AccountService";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [load, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [minDonation, setMinDonation] = useState("");
  const [maxDonation, setMaxDonation] = useState("");
  const [params, setParams] = useState({
    size: paginationModel.pageSize,
    page: paginationModel.page,
    phone: null,
    fullname: null,
    minDonation: null,
    maxDonation: null,
  });

  const fetchListChallenges = async () => {
    setLoading(true);
    await fetchSystemUserAccountsService(params)
      .then((res) => {
        const convertData = (res.content || []).map((item, index) => ({
          ...item,
          id: item.account_id,
          index: index + 1 + paginationModel.page * paginationModel.pageSize,
          createdAt: formatDate(item.created_at),
          totalDonation: formatPrice(item.total_donation),
          finishedAt: formatDate(item.finished_at),
        }));
        setUsers(convertData);
        setTotalRow(res.total);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Đã có lỗi khi tải dữ liệu thử thách");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListChallenges();
  }, [params]);

  const handleSearchName = (event) => {
    const value = event.target.value;
    setFullname(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, fullname: value }));
    }, 500);
  };

  const handleSearchPhone = (event) => {
    const value = event.target.value;
    setPhone(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, phone: value }));
    }, 500);
  };

  const handlePageChange = (newModel) => {
    setPaginationModel(newModel);
    setParams((prev) => ({
      ...prev,
      size: newModel.pageSize,
      page: newModel.page,
    }));
  };

  const handleMinDonationChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");
    setMinDonation(numericValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, minDonation: numericValue }));
    }, 500);
  };

  const handleMaxDonationChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");
    setMaxDonation(numericValue);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, maxDonation: numericValue }));
    }, 500);
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      flex:1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "fullname",
      headerName: "Họ tên",
      width: 200,
      flex:2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      width: 100,
      flex:1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      flex:1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 150,
      flex:1.5,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "totalDonation",
      headerName: "Số tiền đã quyên góp",
      width: 150,
      flex:1.5,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo tài khoản",
      width: 200,
      flex:2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "action",
      headerName: "",
      width: 100,
      flex:1,
      headerClassName: "bg-blue-500 text-white",
    },
  ];

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        { id: 2, title: "Danh sách người dùng" },
      ]}
      pageTitle={"Danh sách người dùng"}
    >
      <div className="p-4">
        <Grid container justifyContent="flex-end" className="mb-3" gap={2}>
          <Grid item lg={2} xs={3}>
            <TextField
              placeholder="Min số tiền quyên góp"
              size="small"
              value={formatPrice(minDonation)}
              onChange={handleMinDonationChange}
              fullWidth
            />
          </Grid>
          <Grid item lg={2} xs={3}>
            <TextField
              placeholder="Max số tiền quyên góp"
              size="small"
              value={formatPrice(maxDonation)}
              onChange={handleMaxDonationChange}
              fullWidth
            />
          </Grid>
          <Grid item lg={2} xs={12}>
            <TextField
              placeholder="Số điện thoại..."
              size="small"
              value={phone}
              onChange={handleSearchPhone}
              InputProps={{
                endAdornment: <Search />,
              }}
              fullWidth
            />
          </Grid>
          <Grid item lg={2} xs={12}>
            <TextField
              placeholder="Họ và tên..."
              size="small"
              value={fullname}
              onChange={handleSearchName}
              InputProps={{
                endAdornment: <Search />,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
        <div>
          <BaseTable
            rows={users}
            columns={columns}
            rowCount={totalRow}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePageChange}
          />
        </div>
      </div>
    </PageHeader>
  );
};

export default ManageUser;
