// ListImagePreview.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const ListImagePreview = ({ displayURLs }) => {
  return (
      <Box className="max-w-full max-h-full overflow-y-hidden">
        <div className="flex w-full gap-4 overflow-x-auto">
          {displayURLs && displayURLs.length > 0 ? (
            <div className="flex w-full gap-4 overflow-x-auto">
              {displayURLs.map((displayURL, index) => (
                <Box
                  key={index}
                  height={200}
                  position="relative"
                  className="rounded-lg h-[200px] flex-shrink-0 overflow-hidden group"
                >
                  <img
                    src={displayURL}
                    alt={`Uploaded ${index}`}
                    className="h-full w-auto object-cover"
                  />
                </Box>
              ))}
            </div>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              className="mt-4 w-full h-full border border-gray-600"
              style={{ minHeight: "200px" }}
            >
              <Typography variant="body1">Không có hình ảnh</Typography>
            </Box>
          )}
        </div>
      </Box>
  );
};

export default ListImagePreview;
