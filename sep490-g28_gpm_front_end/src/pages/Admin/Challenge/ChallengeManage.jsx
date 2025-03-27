import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Info, Search } from "@mui/icons-material";
import { fetchListChallengeAdminService } from "../../../services/ChallengeService";
import { toast } from "react-toastify";
import BaseTable from "../../../components/Table/BaseTable";
import { formatDate, formatPrice } from "../../../utils/formart";
import { useNavigate } from "react-router-dom";

const ChallengeManage = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [load, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [minDonation, setMinDonation] = useState("");
  const [maxDonation, setMaxDonation] = useState("");
  const [params, setParams] = useState({
    size: paginationModel.pageSize,
    page: paginationModel.page,
    title: null,
    year: null,
    minDonation: null,
    maxDonation: null,
  });

  const fetchListChallenges = async () => {
    setLoading(true);
    await fetchListChallengeAdminService(params)
      .then((res) => {
        const convertData = (res.content || []).map((item, index) => ({
          ...item,
          id: item.challenge_id,
          index: index + 1 + paginationModel.page * paginationModel.pageSize,
          createdBy: item.created_by?.fullname ?? null,
          goal: formatPrice(item.goal),
          totalDonation: formatPrice(item.total_donation),
          finishedAt: formatDate(item.finished_at),
        }));
        setChallenges(convertData);
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

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, title: value }));
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

  const handleClick = (id) => {
    navigate("./" + { id });
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      width: 70,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "createdBy",
      headerName: "Người tạo",
      width: 150,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "title",
      headerName: "Tên thử thách",
      width: 350,
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "goal",
      headerName: "Mục tiêu",
      width: 150,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "totalDonation",
      headerName: "Số tiền đạt được",
      width: 150,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "finishedAt",
      headerName: "Ngày kết thúc",
      width: 150,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "action",
      headerName: "",
      width: 150,
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => (
        <Tooltip title="Chi tiết thử thách">
          <IconButton onClick={() => navigate(`./${params.row.id}`)}>
            <Info color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        { id: 2, title: "Danh sách thử thách" },
      ]}
      pageTitle={"Danh sách thử thách"}
    >
      <div className="p-4">
        <Grid container justifyContent="flex-end" className="mb-3">
          <Grid item lg={3} xs={12} className="">
            <TextField
              placeholder="Tên thử thách..."
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <Search />,
              }}
              fullWidth
            />
          </Grid>
          <Grid item lg={2} xs={3} className="pl-3">
            <TextField
              placeholder="Min số tiền đạt được"
              size="small"
              value={formatPrice(minDonation)}
              onChange={handleMinDonationChange}
              fullWidth
            />
          </Grid>
          <Grid item lg={2} xs={3} className="pl-3">
            <TextField
              placeholder="Max số tiền đạt được"
              size="small"
              value={formatPrice(maxDonation)}
              onChange={handleMaxDonationChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <div>
          <BaseTable
            rows={challenges}
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

export default ChallengeManage;
