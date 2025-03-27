import React, { useState, useEffect, useCallback, useRef } from "react";
import { Paper, TextField, Typography, Box, Grid, Button } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseTable from "../../../components/Table/BaseTable";
import { isValidRole } from "../../../utils/auth";
import { formatPrice } from "../../../utils/formart";
import {
  exportDonationFile,
  fetchDonationListAdminService,
  fetchDonationListService,
} from "./../../../services/DonationService";
import { Search } from "@mui/icons-material";
import { formatDateTime } from "./../../../utils/formart";
import DonationTable from "../../../components/Table/DonationTable";

const ProjectDonations = ({ id }) => {
  const [statements, setStatements] = useState([]);
  const [totalRow, setTotalRow] = useState(0);
  const [totalDonation, setTotalDonation] = useState(0);
  const [search, setSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
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
    setTableLoading(true);
    try {
      const response = await fetchDonationListAdminService({ id, params });
      const statements = response?.content.map((statement) => ({
        ...statement,
        id: statement.donation_id,
        value: formatPrice(statement.value),
        bankReceived: statement.bank_sub_acc_id,
        date: formatDateTime(statement.created_at),
        project:
          statement?.project &&
          statement?.project?.code + `-` + statement.project?.title,
        transferedProject:
          statement?.tranfered_project &&
          statement?.tranfered_project?.code +
            `-` +
            statement?.tranfered_project?.title,
      }));

      setTotalDonation((prevData) => ({
        ...prevData,
        totalDonation: response?.data?.total_donation,
      }));

      setTotalRow(response.total);
      setStatements(statements);
      setTableLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu!");
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation(params); // Fetch initially

    // const interval = setInterval(() => {
    //   setParams((prev) => ({ ...prev, page: 0 }));
    //   fetchDonation(params);
    // }, 30000); // Fetch every 30 seconds

    // return () => clearInterval(interval); // Clear interval on component unmount
  }, [params, id]);

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
  const handleExportFile = async () => {
    try {
      const response = await exportDonationFile(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `donation_export_${id}.xlsx`); // Adjust the file name and extension as needed
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xuất file!");
    }
  };

  return (
    <div className="p-4">
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
        <Grid item lg={4} xs={12}>
          <div className="flex justify-end">
            <Button variant="contained" onClick={handleExportFile}>
              Xuất file
            </Button>
          </div>
        </Grid>
      </Grid>
      <DonationTable
        rows={statements}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePageChange}
        tableLoading={tableLoading}
        rowCount={totalRow}
        disableColumnSorting
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ProjectDonations;
