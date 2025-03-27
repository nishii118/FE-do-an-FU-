import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateButton from "../../../components/Button/CreateButton";
import MemberProject from "./MemberProject";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseTable from "../../../components/Table/BaseTable";
import { isValidRole } from "../../../utils/auth";
import {
  addAssignService,
  deleteAssignService,
  fetchAssignListService,
} from "../../../services/AssignService";
import { debounce } from "lodash";

const MemberManage = ({ id }) => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    email: "",
    isActive: "",
    role: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([
    { field: "fullname", sort: "asc" },
  ]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [assignId, setAssignId] = useState(null);

  const fetchProjectMembers = useCallback(
    async (filters, paginationModel, sortModel) => {
      const { page, pageSize } = paginationModel;
      const sortField = sortModel[0]?.field || "fullname";
      const sortOrder = sortModel[0]?.sort || "asc";
      const params = {
        page: page,
        size: pageSize,
        sortField: sortField,
        sortOrder: sortOrder,
        email: filters.email,
        isActive: filters.isActive,
        role: filters.role,
      };

      setLoading(true);
      try {
        const response = await fetchAssignListService({ id, params });
        const assigns = response.content || [];
        const rows = assigns.map((assign, index) => ({
          index: page * pageSize + index + 1,
          id: assign.assign_id,
          email: assign.accountDTO.email,
          fullname: assign.accountDTO.fullname,
          dob: assign.accountDTO.dob,
          phone: assign.accountDTO.phone,
        }));
        setRows(rows);
        setTotalRows(response.total || 0);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const debouncedFetchProjectMembers = useCallback(
    debounce((filters, paginationModel, sortModel) => {
      fetchProjectMembers(filters, paginationModel, sortModel);
    }, 500),
    [fetchProjectMembers]
  );

  useEffect(() => {
    debouncedFetchProjectMembers(filters, paginationModel, sortModel);
  }, [filters, paginationModel, sortModel, debouncedFetchProjectMembers]);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteAssignService(assignId);
      setOpenDelete(false);
      toast.success("Đã xoá thành viên khỏi dự án!");
      debouncedFetchProjectMembers(filters, paginationModel, sortModel);
    } catch (error) {
      setLoading(false);
      toast.error("Đã có lỗi xảy ra");
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

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleSelectChange = (type, event, value) => {
    if (type === "assign") {
      setSelectedMembers(value);
    }
  };

  const handleDeleteClick = (assignId) => {
    setAssignId(assignId);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Bạn chưa chọn thành viên nào!");
      return;
    }

    const memberData = selectedMembers.map((member) => member.account_id);

    try {
      setLoading(true);
      await addAssignService({ memberData, id });
      toast.success("Thành viên đã được thêm vào dự án");
      debouncedFetchProjectMembers(filters, paginationModel, sortModel);
      handleCloseCreate();
    } catch (error) {
      console.error("There was an error adding the member!", error);
      toast.error("Đã xảy ra lỗi khi thêm thành viên");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "index",
      headerName: "STT",
      flex: 1,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "fullname",
      headerName: "Họ và tên",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => {
        const dob = new Date(params.row.dob); // Assuming dob is a string representation of a date
        const formattedDate = dob.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDeleteClick(params.row.id)}
          startIcon={<DeleteIcon />}
          size="small"
        >
          Xóa
        </Button>
      ),
    });
  }

  if (error) {
    return (
      <Paper className="w-full overflow-hidden mt-8 p-4">
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          There was an error fetching the data: {error.message}
        </Typography>
      </Paper>
    );
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item md={4} lg={4}>
          {isAdmin && (
            <CreateButton
              handleClick={handleOpenCreate}
              message="Thêm thành viên"
            />
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
              label="Tìm theo email"
              variant="outlined"
              size="small"
              name="email"
              value={filters.email}
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
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalRows}
          loading={loading}
        ></BaseTable>
      </Box>
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Thêm thành viên</DialogTitle>
        <DialogContent>
          <MemberProject
            handleSelectChange={handleSelectChange}
            selectedMembers={selectedMembers}
            projectId={id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMembers} color="primary">
            Thêm thành viên
          </Button>
          <Button onClick={handleCloseCreate} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa thành viên này không?
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

export default MemberManage;
