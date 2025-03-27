import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import axiosInstance from "../../../services/api";
import CreateButton from "../../../components/Button/CreateButton";
import { formatPrice } from "../../../utils/formart";
import AddBudget from "./AddBudget";
import UpdateBudget from "./UpdateBudget";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import BaseTable from "../../../components/Table/BaseTable";
import useProjectStore from "../../../store/useProjectStore";

const BudgetList = ({ id }) => {
  const isMember = useProjectStore((state) => state.isMember);

  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const fetchBudgets = useCallback(
    async (filters, paginationModel) => {
      setTableLoading(true);
      const { page, pageSize } = paginationModel;
      const params = {
        page: page,
        size: pageSize,
        title: filters.title,
      };
      try {
        const response = await axiosInstance.get(
          `/admin/projects/${id}/budgets`,
          {
            params,
          }
        );
        if (response && response.data.code === "200") {
          const budgetList = (response.data.data.content || []).map(
            (item, index) => ({
              id: item.budget_id,
              index:
                index + 1 + paginationModel.page * paginationModel.pageSize,
              title: item.title,
              unit_price: item.unit_price, // Keep original unit_price for calculation
              formatted_unit_price: formatPrice(item.unit_price), // Formatted unit_price for display
              note: item.note,
            })
          );

          setRows(budgetList);
          setTotalRows(response.data.data.total || 0);
          setTotalBudget(response.data.data.content[0].total_budget || 0);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setTableLoading(false);
      }
    },
    [id, setError]
  );

  useEffect(() => {
    const debouncedFetch = debounce((filters, paginationModel) => {
      fetchBudgets(filters, paginationModel);
    }, 500);

    debouncedFetch(filters, paginationModel);

    // Cleanup function to cancel debounce if effect is re-run
    return () => {
      debouncedFetch.cancel();
    };
  }, [filters, paginationModel, refresh, fetchBudgets]);

  const handleCreateClick = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setPaginationModel((prevModel) => ({ ...prevModel, page: 0 }));
  };

  const handleDeleteClick = (budgetId) => {
    setBudgetToDelete(budgetId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      try {
        setTableLoading(true);
        const response = await axiosInstance.delete(
          `/admin/projects/budget/delete/${budgetToDelete}`
        );
        if (response.data.code === "200") {
          setRefresh((prev) => !prev); // Refresh the list after deletion
          toast.success("Đã xoá chi phí thành công");
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setTableLoading(false);
        setOpenConfirmDialog(false);
        setBudgetToDelete(null);
      }
    }
  };

  const handleUpdateClick = (budgetId) => {
    // console.log("Selected Budget ID:", budgetId);
    setSelectedBudget(budgetId);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedBudget(null);
    setRefresh((prev) => !prev); // Refresh the list after update
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
      headerName: "Tên Chi Phí",
      flex: 4,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "formatted_unit_price",
      headerName: "Số tiền (VND)",
      flex: 3,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "note",
      headerName: "Thông Tin Chi Phí",
      flex: 3,
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
            startIcon={<InfoIcon />}
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
            <CreateButton handleClick={handleCreateClick} message={"Tạo mới"} />
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
              label="Tìm tên chi phí"
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

      <Box className="w-full min-h-[500px] mt-4">
        <BaseTable
          rows={rows}
          columns={columns}
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          tableLoading={tableLoading}
        />
      </Box>

      <Box className="w-full mt-4 flex justify-end">
        <Typography variant="h6">
          Tổng chi phí của dự án: {formatPrice(totalBudget)} VND
        </Typography>
      </Box>

      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Tạo ngân sách</DialogTitle>
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
          <AddBudget
            id={id}
            handleCloseCreate={() => {
              handleCloseCreate();
              setRefresh((prev) => !prev); // Trigger refresh
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Cập nhật ngân sách</DialogTitle>
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
          <UpdateBudget
            id={selectedBudget}
            handleCloseUpdate={handleCloseUpdate}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa chi phí này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BudgetList;
