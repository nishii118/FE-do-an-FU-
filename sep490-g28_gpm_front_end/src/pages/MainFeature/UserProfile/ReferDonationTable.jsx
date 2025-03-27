import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { ArrowForward, Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import { fetchListDonatationsChallengeService } from "./../../../services/ChallengeService";
import { formatDateTime, formatPrice } from "../../../utils/formart";
import { FETCH_DONATION_TIME, routes } from "../../../config";
import DonationTable from "../../../components/Table/DonationTable";
import { fetchListReferDonatationsService } from "../../../services/ProfileService";
import { useNavigate } from "react-router-dom";

const ReferDonationTable = ({ userCode }) => {
  const navigate = useNavigate();
  const [statements, setStatements] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [params, setParams] = useState({
    size: paginationModel.pageSize,
    page: paginationModel.page,
    description: null,
  });

  const fetchDonation = async (params) => {
    try {
      const response = await fetchListReferDonatationsService(userCode, params);
      const statements = response?.content.map((statement) => ({
        ...statement,
        note: statement.note,
        id: statement.donation_id,
        value: formatPrice(statement.value),
        bankReceived: statement.bank_sub_acc_id,
        date: formatDateTime(statement.created_at),
        project:
          statement?.project &&
          statement?.project?.code + `-` + statement.project?.title,
        transferredProject:
          statement?.transferred_project &&
          statement?.transferred_project?.code +
            `-` +
            statement?.transferred_project?.title,
        slug:
          statement?.transferred_project &&
          statement?.transferred_project?.slug,
      }));
      setTotalDonation(response?.summary?.total_donation_by_refer ?? 0);
      setTotal(response.total);
      setStatements(statements);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.error?.code === "1011") {
        navigate(routes.notFound);
        // toast.warn("Trang không tồn tại");
      } else {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu quyên góp!");
      }
    }
  };

  useEffect(() => {
    fetchDonation(params); // Fetch initially
  }, [params, userCode]);

  useEffect(() => {
    const interval = setInterval(() => {
      // setParams((prev) => ({ ...prev, page: 0 }));
      fetchDonation(params);
    }, FETCH_DONATION_TIME); // Fetch every 30 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [userCode]);

  const handlePageChange = (newModel) => {
    setPaginationModel(newModel);
    setParams((prev) => ({
      ...prev,
      size: newModel.pageSize,
      page: newModel.page,
    }));
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setParams((prev) => ({ ...prev, description: value }));
    }, 500);
  };

  const columns = [
    {
      field: "bankReceived",
      headerName: "Tài khoản nhận",
      width: 100,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "date",
      headerName: "Ngày",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "value",
      headerName: "Số tiền",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "description",
      headerName: "Nội dung CK",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "project",
      headerName: "Dự án đích",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "transferredProject",
      headerName: "Tiền dư được chuyển tới",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
      renderCell: (params) => {
        const handleClick = () => {
          navigate(`/du-an/${params.row.slug}`);
        };

        return params.value ? (
          <div
            className="flex items-center text-green-600 hover:underline"
            onClick={handleClick}
          >
            <ArrowForward />
            <div className="ml-2">{params.value}</div>
          </div>
        ) : null;
      },
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
  ];

  return (
    <div className="flex flex-col gap-4 shadow-xl border rounded-lg w-full">
      <div className="p-4">
        <p className="text-red-500 italic mb-2">
          *Nếu bạn sử dụng mã QR hoặc chuyển khoản đúng nội dung, sao kê sẽ được
          cập nhật sau mỗi 30s
        </p>
        <Grid container justifyContent="space-between" className="mb-3">
          <Grid item lg={4} xs={12}>
            <TextField
              placeholder="Nội dung chuyển khoản..."
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: <Search />,
              }}
              fullWidth
              className="bg-white"
            />
          </Grid>
          {/* <Grid item lg={4} xs={12}>
            <div className="flex justify-end w-full">
              <div className="font-medium text-lg">
                Tổng số tiền: {formatPrice(totalDonation)} VNĐ
              </div>
            </div>
          </Grid> */}
        </Grid>

        <DonationTable
          rows={statements}
          rowCount={total}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ReferDonationTable;
