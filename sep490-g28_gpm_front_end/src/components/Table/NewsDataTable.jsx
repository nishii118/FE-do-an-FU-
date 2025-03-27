import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import NewsTableActions from "../ColumnAction/NewsTableActions";
import { NEWS_STATUS } from "../../utils/const";
import { formatDate } from "../../utils/formart";

export const NewsDataTable = ({
  data,
  refreshData,
  rowsPerPage,
  page,
  totalRows,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const getStatusTitle = (status) => {
    const statusObj = NEWS_STATUS.find((item) => item.status === status);
    return statusObj ? statusObj.title : "Unknown Status";
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-blue-500">
            <TableRow>
              <TableCell className="!text-white">Tiêu đề</TableCell>
              <TableCell className="!text-white">Thể loại</TableCell>
              <TableCell className="!text-white">Người viết</TableCell>
              <TableCell className="!text-white">Trạng thái</TableCell>
              <TableCell className="!text-white">Chỉnh sửa</TableCell>
              <TableCell className="!text-white">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{height:"300px"}}>
                  <Typography variant="body1" color="textSecondary">
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((news) => (
                <TableRow key={news.news_id}>
                  <TableCell>{news.title}</TableCell>
                  <TableCell>{news.category.title}</TableCell>
                  <TableCell>
                    {news.created_by.fullname}
                    <br />
                    Ngày tạo: {formatDate(news.created_at)}
                  </TableCell>
                  <TableCell>{getStatusTitle(news.status)}</TableCell>
                  <TableCell>
                    {news.updated_by.fullname}
                    <br />
                    Lần cuối: {formatDate(news.updated_at)}
                  </TableCell>
                  <TableCell>
                    <NewsTableActions news={news} refreshData={refreshData} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
