import PropTypes from "prop-types";
import { Box, Typography, Divider, Card } from "@mui/material";

function ComplexStatisticsCard({ count, title, icon }) {
  const Icon = icon;
  return (
    <div className="bg-white border-gray-200 border-2 shadow-lg rounded-xl">
      <div className="pt-2 px-4 rounded-lg">
        <Box
          sx={{
            background:
              "linear-gradient(100deg,#0076ff, #00c8ff);",
            color: "white",
          }}
          display="flex"
          coloredShadow="blue"
          borderRadius="0.75rem"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit"></Icon>
        </Box>
        <div className="text-right">
          <Typography variant="h5">{count}</Typography>
        </div>
      </div>
      <Divider />
      <div className="pb-4 px-5">
        <div className="mt-3 text-base">
          {title}
        </div>
      </div>
    </div>
  );
}

export default ComplexStatisticsCard;
