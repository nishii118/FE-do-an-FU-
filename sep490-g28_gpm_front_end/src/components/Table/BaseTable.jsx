import { Box, Typography } from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import React from "react";


const BaseTable = ({
  rows,
  columns,
  paginationModel,
  onPaginationModelChange,
  tableLoading,
  rowCount,
  ...props
}) => {
  return (
    <DataGrid
      {...props}
      rows={rows}
      columns={columns}
      pagination
      paginationMode="server"
      pageSizeOptions={[5, 10, 15]}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      rowCount={rowCount}
      loading={tableLoading}
      slotProps={{
        loadingOverlay: {
          variant: "circular-progress",
        },
      }}
      autoHeight
      sx={{ minHeight: "500px", "--DataGrid-overlayHeight": "400px" }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "bg-gray-200" : "bg-white"
      }
    />
  );
};

export default BaseTable;
