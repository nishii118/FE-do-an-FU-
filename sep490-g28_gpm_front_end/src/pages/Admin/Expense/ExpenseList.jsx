import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CreateExpense from "./CreateExpense";
import UpdateExpense from "./UpdateExpense";
import { format } from "date-fns";
import { formatDateTime, formatPrice } from "../../../utils/formart";
import CreateButton from "../../../components/Button/CreateButton";
import BaseTable from "../../../components/Table/BaseTable";
import {
  deleteExpenseService,
  fetchExpenseListService,
} from "../../../services/ExpenseService";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { Info } from "@mui/icons-material";
import useProjectStore from "../../../store/useProjectStore";

const ExpenseList = ({ id }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const fetchExpenses = useCallback(
    async (filters, paginationModel) => {
      setTableLoading(true);
      const { page, pageSize } = paginationModel;
      const params = {
        page: page,
        size: pageSize,
        title: filters.title,
      };
      try {
        const response = await fetchExpenseListService({ id, params });
        const expenseList = (response.content || []).map((item, index) => ({
          id: item.expense_id,
          index: index + 1 + paginationModel.page * paginationModel.pageSize,
          title: item.title,
          unit_price: formatPrice(item.unit_price),
          createdAt: formatDateTime(item.created_at),
        }));
        setRows(expenseList);
        setTotalRows(response.total || 0);
      } catch (error) {
        toast.error("Đã có lỗi khi tải dữ liệu!");
        console.log(error);
      } finally {
        setTableLoading(false);
      }
    },
    [id]
  );

  const debouncedFetchExpenses = useCallback(
    debounce((filters, paginationModel) => {
      fetchExpenses(filters, paginationModel);
    }, 500),
    [fetchExpenses]
  );

  useEffect(() => {
    debouncedFetchExpenses(filters, paginationModel);
  }, [filters, paginationModel, refresh, debouncedFetchExpenses]);

  const handleCreateClick = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleUpdateClick = (expenseId) => {
    setSelectedExpense(expenseId);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPaginationModel((prevModel) => ({ ...prevModel, page: 0 }));
  };

  const handleDeleteClick = (expenseId) => {
    setExpenseToDelete(expenseId);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpenseService({ id: expenseToDelete });

      setRefresh((prev) => !prev); // Refresh the list after deletion
      handleCloseDelete();
      toast.success("Đã xoá thanh toán thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
      console.log(error);
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
      field: "title",
      headerName: "Tên chi phí",
      flex: 4,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "unit_price",
      headerName: "Giá trị",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "createdAt",
      headerName: "Ngày Tạo",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="h-full flex justify-center items-center gap-2">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateClick(params.row.id)}
            startIcon={<Info />}
            size="small"
          >
            Chi tiết
          </Button>
          {isMember && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDeleteClick(params.row.id)}
              startIcon={<DeleteIcon />}
              size="small"
            >
              Xóa
            </Button>
          )}
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
              message={"Tạo mới"}
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
              label="Tìm theo tên thanh toán"
              variant="outlined"
              size="small"
              name="title"
              value={filters.title}
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
          onPaginationModelChange={setPaginationModel}
          paginationModel={paginationModel}
          tableLoading={tableLoading}
        />
      </Box>

      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Tạo chi phí</DialogTitle>
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
          <CreateExpense
            id={id}
            onClose={handleCloseCreate}
            refreshData={() => setRefresh((prev) => !prev)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>Cập nhật chi phí</DialogTitle>
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
          {selectedExpense && (
            <UpdateExpense
              id={selectedExpense}
              handleCloseUpdate={() => {
                handleCloseUpdate();
                setRefresh((prev) => !prev);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa khoản thanh toán</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa khoản thanh toán này không?
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

export default ExpenseList;
