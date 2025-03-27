import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { USER_ACTIONS_AUTH, USER_ACTIONS_NO_AUTH } from "../../utils/const";
import { convertFireBaseImage } from "./../../utils/populate";
import useUserStore from "../../store/useUserStore";

const DefaultHeaderAction = ({
  isMobile = false,
  role = "",
  onHandleLogout,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const { avatar } = useUserStore();
  const setAvatar = useUserStore((state) => state.setAvatar);
  const [fullname, setFullname] = useState();
  const actionsMenu = useMemo(() => {
    return role ? USER_ACTIONS_AUTH() : USER_ACTIONS_NO_AUTH;
  }, [role]);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar !== avatar) {
      setAvatar(storedAvatar);
    }
    setFullname(localStorage.getItem("fullname"));
  }, [avatar]);

  const onToggleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={isMobile ? "flex items-center lg:hidden" : undefined}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onToggleMenu}
        color="inherit"
      >
        {role ? (
          <Avatar alt={fullname} src={convertFireBaseImage(avatar)} />
        ) : (
          <AccountCircle sx={{ width: 40, height: 40 }} />
        )}
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={onClose}
      >
        {actionsMenu.map((item) => (
          <MenuItem
            key={item.key}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
        {role && <MenuItem onClick={onHandleLogout}>Đăng xuất</MenuItem>}
      </Menu>
    </div>
  );
};

DefaultHeaderAction.propTypes = {
  isMobile: PropTypes.bool,
  role: PropTypes.string.isRequired,
  onHandleLogout: PropTypes.func,
};

export default DefaultHeaderAction;
