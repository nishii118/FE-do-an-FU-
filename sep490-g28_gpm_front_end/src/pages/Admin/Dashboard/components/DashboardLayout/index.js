
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function DashboardLayout({ children }) {
  return (
    <Box
      sx={({ breakpoints, transitions }) => ({
        p: 2,
        position: "relative",
        [breakpoints.up("xl")]: {
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </Box>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
