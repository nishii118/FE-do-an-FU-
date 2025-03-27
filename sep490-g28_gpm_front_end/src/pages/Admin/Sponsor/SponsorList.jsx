import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CreateSponsor from "./CreateSponsor";
import UpdateSponsor from "./UpdateSponsor";
import { formatDate, formatPrice } from "./../../../utils/formart";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateButton from "../../../components/Button/CreateButton";
import BaseTable from "../../../components/Table/BaseTable";
import { toast } from "react-toastify";
import {
  deleteSponsorService,
  fetchSponsorListService,
} from "../../../services/SponsorService";
import useProjectStore from "../../../store/useProjectStore";

const SponsorList = ({ id }) => {
  const isMember = useProjectStore((state) => state.isMember);

  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    companyName: null,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState(null);

  const fetchSponsors = useCallback(async () => {
    setTableLoading(true);
    const { page, pageSize } = paginationModel;
    const params = {
      page: page,
      size: pageSize,
      company_name: filters.companyName,
    };
    try {
      const response = await fetchSponsorListService({ id, params });

      const sponsorList = (response.content || []).map((item, index) => ({
        id: item.sponsor_id,
        index: index + 1 + paginationModel.page * paginationModel.pageSize,
        companyName: item.company_name,
        representative: item.representative,
        representativeEmail: item.representative_email,
        value: formatPrice(item.value),
        createdAt: formatDate(item.created_at),
      }));
      setRows(sponsorList);
      setTotalRows(response.total || 0);
      setTableLoading(false);
      // toast.success("Tải dữ liệu thành công")
    } catch (error) {
      setError(error);
      toast.error("Đã có lỗi khi tải dữ liệu");
      setTableLoading(false);
    }
  }, [filters.companyName, id, paginationModel]);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors, filters, paginationModel, refresh]);

  const handleCreateClick = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleUpdateClick = (sponsorId) => {
    setSelectedSponsor(sponsorId);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDeleteClick = (sponsorId) => {
    setSponsorToDelete(sponsorId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSponsorService({ sponsorToDelete });
      setRefresh((prev) => !prev); // Trigger refresh
      handleCloseDelete();
      toast.success("Đã xoá nhà tài trợ thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
      console.error("Failed to delete sponsor:", error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPaginationModel((prevModel) => ({ ...prevModel, page: 0 }));
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      flex: 0.3,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "companyName",
      headerName: "Tên công ty",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "representative",
      headerName: "Người đại diện",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "representativeEmail",
      headerName: "Email người đại diện",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "value",
      headerName: "Số tiền",
      flex: 1.5,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1.5,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="h-full flex justify-center items-center gap-2">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateClick(params.row.id)}
            startIcon={<InfoIcon />}
            size="small"
          >
            Chi tiết
          </Button>
          {/* {isMember && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDeleteClick(params.row.id)}
              startIcon={<DeleteIcon />}
              size="small"
            >
              Xóa
            </Button>
          )} */}
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item md={4} lg={4}>
          {isMember && (
            <CreateButton
              handleClick={handleCreateClick}
              message={"Nhà tài trợ"}
            ></CreateButton>
          )}
        </Grid>
        <Grid
          item
          md={8}
          lg={8}
          container
          justifyContent="flex-end"
          spacing={2}
        >
          <Grid item md={4} lg={4}>
            <TextField
              label="Tìm tên Công Ty"
              variant="outlined"
              size="small"
              name="companyName"
              value={filters.companyName}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <Box className="mt-4">
        <BaseTable
          rows={rows}
          columns={columns}
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          tableLoading={tableLoading}
        ></BaseTable>
      </Box>

      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Thêm Nhà Tài Trợ</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseCreate}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <CreateSponsor
            id={id}
            handleCloseCreate={() => {
              handleCloseCreate();
              setRefresh((prev) => !prev); // Trigger refresh
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate} fullWidth={true}>
        <DialogTitle>Cập Nhật Nhà Tài Trợ</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUpdate}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {selectedSponsor && (
            <UpdateSponsor
              id={selectedSponsor}
              handleCloseUpdate={() => {
                handleCloseUpdate();
                setRefresh((prev) => !prev); // Trigger refresh
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa nhà tài trợ</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa nhà tài trợ này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SponsorList;
