import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  fetchCategoryService,
  updateCategoryStatusService,
} from "../../../services/CategoryService";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { routes } from "../../../config";
import BaseTable from "../../../components/Table/BaseTable";
import { Close, Publish, Unpublished } from "@mui/icons-material";
import CreateCategory from "./CreateCateogry";
import UpdateCategory from "./UpdateCategory";
import { isValidRole } from "../../../utils/auth";

const CategoryList = () => {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [refresh, setRefresh] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await fetchCategoryService();
      const categories = (response.data || []).map((item, index) => ({
        ...item,
        id: item.category_id,
        index: index + 1 + paginationModel.page * paginationModel.pageSize,
      }));
      setRows(categories);
      setTotalRows(response.total || categories.length); // Assuming response has a total count
      setTableLoading(false);
    } catch (error) {
      setError(error);
      toast.error("Đã có lỗi khi tải dữ liệu");
      setTableLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => !prev); // Trigger a refresh of the list
  };

  const handleStatusChange = (category) => {
    setSelectedCategory(category);
    setOpenConfirmDialog(true);
  };

  const confirmStatusChange = async () => {
    try {
      await updateCategoryStatusService(
        selectedCategory.id,
        !selectedCategory.is_active
      );
      toast.success("Cập nhật trạng thái thành công");
      setOpenConfirmDialog(false);
      handleRefresh();
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi cập nhật trạng thái");
      setOpenConfirmDialog(false);
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
      headerName: "Tiêu đề",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "total",
      headerName: "Số lượng bài viết",
      flex: 2,
      headerClassName: "bg-blue-500 text-white",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      headerClassName: "bg-blue-500 text-white",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="h-full flex justify-center items-center gap-2">
          {isAdmin && (
            <>
              <UpdateCategory
                categoryId={params.row.id}
                onSuccess={handleRefresh}
              />
              <Tooltip title={params.row.is_active ? "Ẩn toàn bộ" : "Hiển thị"}>
                <IconButton onClick={() => handleStatusChange(params.row)}>
                  {params.row.is_active ? (
                    <Unpublished className="text-red-500" />
                  ) : (
                    <Publish className="text-green-500" />
                  )}
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageHeader
      breadcrumbs={[
        { id: 1, title: "Dashboard", path: routes.admin },
        { id: 2, title: "Danh mục tin tức" },
      ]}
      pageTitle={"Danh mục tin tức"}
    >
      <div>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          spacing={2}
        >
          {isAdmin && (
            <Grid item md={4} lg={4}>
              <CreateCategory onSuccess={handleRefresh} />
            </Grid>
          )}
        </Grid>
        <Box className="mt-4">
          <BaseTable
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            tableLoading={tableLoading}
          />
        </Box>
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Xác nhận</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenConfirmDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn
              {selectedCategory?.is_active
                ? " ẩn toàn bộ bài viết và "
                : " hiển thị lại "}
              tiêu đề này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
            <Button onClick={confirmStatusChange} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </PageHeader>
  );
};

export default CategoryList;
