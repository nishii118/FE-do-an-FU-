import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField } from "@mui/material";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import DonationTable from "../../../components/Table/DonationTable";
import { formatDateTime, formatPrice, getPrice } from "../../../utils/formart";
import { Search } from "@mui/icons-material";
import { toast } from "react-toastify";

import { fetchAllDonationsService } from "../../../services/DonationService";

const DonationList = () => {
  const [statements, setStatements] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [params, setParams] = useState({
    size: paginationModel.pageSize,
    page: paginationModel.page,
    description: null,
  });

  const fetchDonation = async (params) => {
    console.log(params);
    try {
      const response = await fetchAllDonationsService(params);
      const statements = response?.content.map((statement) => ({
        ...statement,
        note: statement.note,
        id: statement.donation_id,
        // value: getPrice(statement.value),
        value: statement.value,
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
      }));
      setTotalDonation(response?.summary?.total_donation_by_refer ?? 0);
      setTotal(response.total);
      setStatements(statements);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu quyên góp!");
    }
  };

  useEffect(() => {
    fetchDonation(params); // Fetch initially
  }, [params]);

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
      width: 150,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "description",
      headerName: "Nội dung CK",
      width: 350,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "project",
      headerName: "Dự án đích",
      width: 250,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "transferredProject",
      headerName: "Tiền dư được chuyển tới",
      width: 250,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 100,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 200,
      headerClassName: "bg-[F5F5F5] text-[848895]",
    },
  ];

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        { id: 2, title: "Danh sách quyên góp" },
      ]}
      pageTitle={"Danh sách quyên góp"}
    >
      <div className="flex flex-col gap-4 shadow-xl border rounded-lg w-full">
        <div className="p-4">
          <Grid container justifyContent="flex-end" className="mb-3">
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
    </PageHeader>
  );
};

export default DonationList;
