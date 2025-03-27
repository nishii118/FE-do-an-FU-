// import { DataGrid } from "@mui/x-data-grid";
// import React from "react";

// const DonationTable = ({
//   rows,
//   rowCount,
//   columns,
//   paginationModel,
//   onPaginationModelChange,
//   ...props
// }) => {
//   return (
//     <DataGrid
//       {...props}
//       rows={rows}
//       rowCount={rowCount}
//       columns={columns}
//       getRowClassName={(params) =>
//         params.indexRelativeToCurrentPage % 2 === 0 ? "bg-white" : "bg-white"
//       }
//       pageSizeOptions={[5, 10, 15]}
//       paginationModel={paginationModel}
//       onPaginationModelChange={onPaginationModelChange}
//       paginationMode="server"
//       disableColumnMenu
//       disableRowSelectionOnClick
//       slotProps={{
//         loadingOverlay: {
//           variant: "circular-progress",
//         },
//       }}
//       autoHeight
//       sx={{
//         minHeight: "400px",
//         "--DataGrid-overlayHeight": "200px",
//         backgroundColor: "white",
//       }}
//     />
//   );
// };

// export default DonationTable;
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const DonationTable = ({
  rows,
  rowCount,
  columns,
  paginationModel,
  onPaginationModelChange,
  ...props
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <DataGrid
        {...props}
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "bg-white" : "bg-white"
        }
        pageSizeOptions={[5, 10, 15]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        paginationMode="server"
        disableColumnMenu
        autoHeight
        sx={{
          minHeight: "400px",
          "--DataGrid-overlayHeight": "200px",
          backgroundColor: "white",
        }}
        onRowClick={handleRowClick}
      />

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          <div className="flex justify-between items-center font-semibold text-lg ">
            <div className="text-center w-full">Chi tiết chuyển khoản</div>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedRow?.bankReceived && (
            <Typography>
              <strong>Ngân hàng nhận:</strong> {selectedRow.bankReceived}
            </Typography>
          )}
          {selectedRow?.value && (
            <Typography>
              <strong>Số tiền:</strong> {selectedRow.value}
            </Typography>
          )}
          {selectedRow?.date && (
            <Typography>
              <strong>Ngày tạo:</strong> {selectedRow.date}
            </Typography>
          )}
          {selectedRow?.description && (
            <Typography>
              <strong>Nội dung CK:</strong> {selectedRow.description}
            </Typography>
          )}
          {selectedRow?.project && (
            <Typography>
              <strong>Dự án:</strong> {selectedRow.project.toString()}
            </Typography>
          )}
          {selectedRow?.transferredProject && (
            <Typography>
              <strong>Tiền dư được chuyển tới:</strong>{" "}
              {selectedRow.transferredProject}
            </Typography>
          )}
          {selectedRow?.corresponsive_name && (
            <Typography>
              <strong>Tên thụ hưởng:</strong> {selectedRow.corresponsive_name}
            </Typography>
          )}
          {selectedRow?.correspensive_account && (
            <Typography>
              <strong>Tài khoản thụ hưởng:</strong>{" "}
              {selectedRow.correspensive_account}
            </Typography>
          )}
          {selectedRow?.note && (
            <Typography>
              <strong>Ghi chú:</strong> {selectedRow.note}
            </Typography>
          )}
          {selectedRow?.correspensive_bank_name && (
            <Typography>
              <strong>Tên ngân hàng thụ hưởng:</strong>{" "}
              {selectedRow.correspensive_bank_name}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationTable;
