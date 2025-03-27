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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import CreateButton from "../../../components/Button/CreateButton";
import CreateTracking from "./CreateTracking";
import UpdateTracking from "./UpdateTracking";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import BaseTable from "../../../components/Table/BaseTable";
import {
  deleteTrackingService,
  fetchTrackingListService,
} from "../../../services/TrackingService";
import useProjectStore from "../../../store/useProjectStore";
import { formatDate } from "../../../utils/formart";

const TrackingList = ({ id }) => {
  const isMember = useProjectStore((state) => state.isMember);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [trackingToDelete, setTrackingToDelete] = useState(null);

  const fetchTrackings = useCallback(
    async (filters, paginationModel) => {
      setTableLoading(true);
      const { page, pageSize } = paginationModel;
      const params = {
        page: page,
        size: pageSize,
        title: filters.title,
      };
      try {
        const response = await fetchTrackingListService({ id, params });
        const trackingList = (response.content || []).map((item, index) => ({
          id: item.tracking_id,
          index: index + 1 + paginationModel.page * paginationModel.pageSize,
          title: item.title,
          content: item.content,
          createdAt: formatDate(item.created_at),
          date: item.date
        }));
        setRows(trackingList);
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

  useEffect(() => {
    const debouncedFetch = debounce((filters, paginationModel) => {
      fetchTrackings(filters, paginationModel);
    }, 500);

    debouncedFetch(filters, paginationModel);

    // Cleanup function to cancel debounce if effect is re-run
    return () => {
      debouncedFetch.cancel();
    };
  }, [filters, paginationModel, fetchTrackings]);

  useEffect(() => {
    fetchTrackings(filters, paginationModel);
  }, [refresh]);
  const handleCreateClick = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleUpdateClick = (trackingId) => {
    setSelectedTracking(trackingId);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedTracking(null);
    setRefresh((prev) => !prev); // Refresh the list after update
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

  const handleDeleteClick = (trackingId) => {
    setTrackingToDelete(trackingId);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTrackingService({ trackingToDelete });
      setRefresh((prev) => !prev); // Trigger refresh
      handleCloseDelete();
      toast.success("Đã xoá tiến độ thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra!");
      console.error("Failed to delete tracking:", error);
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
      headerName: "Tiến độ",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "content",
      headerName: "Nội dung",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
      renderCell: (params) => (
        <div className="truncate max-w-full" title={params.value}>
          {params.value}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Ngày Tạo",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
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
              label="Tìm kiếm theo tên"
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

      <Dialog open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Tạo tiến độ</DialogTitle>
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
          <CreateTracking
            id={id}
            handleCloseCreate={() => {
              handleCloseCreate();
              setRefresh((prev) => !prev);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Cập nhật tiến độ</DialogTitle>
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
          {selectedTracking && (
            <UpdateTracking
              id={selectedTracking}
              handleCloseUpdate={handleCloseUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa tiến độ này không?
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

export default TrackingList;
