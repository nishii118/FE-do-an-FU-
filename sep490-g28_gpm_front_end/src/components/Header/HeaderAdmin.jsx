import * as React from "react";
import HomeLogo from "../../assets/images/home-logo.png";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  More,
} from "@mui/icons-material";
import { routes } from "../../config";
import useUserStore from "../../store/useUserStore";
import { convertFireBaseImage } from "../../utils/populate";
import { useState } from "react";
import { useEffect } from "react";

export default function HeaderAdmin({ setIsShrink }) {
  const { logout } = useUserStore();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { avatar } = useUserStore();
  const setAvatar = useUserStore((state) => state.setAvatar);
  const [fullname, setFullname] = useState();
  const role = localStorage.getItem("role");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar !== avatar) {
      setAvatar(storedAvatar);
    }
    setFullname(localStorage.getItem("fullname"));
  }, [avatar]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const onHandleLogout = () => {
    logout();
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      sx={{ mt: "45px" }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={onHandleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt={fullname} src={convertFireBaseImage(avatar)} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="h-[70px]" position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => {
              setIsShrink((pre) => !pre);
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* <div
            className="h-[40px] lg:h-[50px]"
            onClick={() => {
              navigate(routes.home);
            }}
          >
            <img src={HomeLogo} alt="" className="w-full h-full" />
          </div> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            GPM
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {role === null ? (
              <>
                <IconButton
                  size="small"
                  edge="end"
                  aria-haspopup="true"
                  onClick={() => {
                    navigate(routes.login);
                  }}
                  color="inherit"
                >
                  Đăng nhập
                </IconButton>
                <IconButton
                  size="small"
                  edge="end"
                  aria-haspopup="true"
                  onClick={() => {
                    navigate(routes.register);
                  }}
                  color="inherit"
                >
                  Đăng ký
                </IconButton>
              </>
            ) : (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt={fullname} src={convertFireBaseImage(avatar)} />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <More />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
