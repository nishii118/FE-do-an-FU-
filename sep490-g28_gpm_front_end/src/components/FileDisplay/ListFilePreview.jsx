import { Grid, Typography } from "@mui/material";
import React from "react";
import { getFileIcon } from "../../utils/getFileIcon";
import { convertFireBaseFile } from "../../utils/populate";

const ListFilePreview = (fileURLs, files) => {
  if (!fileURLs.length) return null;

  return (
    <div className="flex-grow">
      <Grid container spacing={1}>
        {fileURLs.map((fileURL, index) => (
          <Grid
            key={index}
            item
            xs={12}
            display="flex"
            alignItems="center"
            justifyContent="start"
          >
            {fileURL ? getFileIcon(fileURL) : null}
            <a
              href={convertFireBaseFile(fileURL)}
              download={files[index]?.name}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flexGrow: 1 }}
            >
              <Typography
                variant="body2"
                className="!truncate cursor-pointer hover:underline"
              >
                {fileURL}
              </Typography>
            </a>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ListFilePreview;
