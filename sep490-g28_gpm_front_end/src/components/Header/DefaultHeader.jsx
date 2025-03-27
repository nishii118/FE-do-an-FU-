import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeLogo from "../../assets/images/home-logo.png";
import { NAVIGATION_NAVBAR, USER_ACTIONS_NO_AUTH } from "../../utils/const";
import { routes } from "../../config";
import useUserStore from "../../store/useUserStore";
import DefaultHeaderAction from "./DefaultHeaderAction";
import DefaultNavigationMobile from "./DefaultNavigationMobile";
import { Menu, MenuItem } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { fetchCampaignsIdTitleService } from "../../services/PublicService";

const DefaultHeader = () => {
  const { logout } = useUserStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState({});
  const [navigationData, setNavigationData] = useState(NAVIGATION_NAVBAR);
  const [role, setRole] = useState();
  const location = useLocation();

  const fetchCampaignChildren = async () => {
    try {
      const response = await fetchCampaignsIdTitleService();
      const children = response.map((item) => ({
        key: item.campaign_id.toString(), 
        label: item.title,
        path: "/gop-le/" + item.slug, 
      }));
      setNavigationData((prevData) =>
        prevData.map((item) =>
          item.key === "campaigns" ? { ...item, children } : item
        )
      );
    } catch (error) {
      console.error("Error fetching campaign children:", error);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchCampaignChildren();
  }, []);

  const onHandleLogout = async () => {
    setRole(null);
    await logout();
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const expandIcon = (isExpand) => (isExpand ? <ExpandLess /> : <ExpandMore />);

  const handleClick = (event, label) => {
    setAnchorEl((prevOpen) => ({
      ...prevOpen,
      [label]: event.currentTarget,
    }));
  };

  const onClose = (label) => {
    setAnchorEl((prevOpen) => ({
      ...prevOpen,
      [label]: null,
    }));
  };

  return (
    <div className="h-[70px] md:h-[100px] lg:h-[120px] w-full shadow-lg flex items-center justify-center sticky top-0 z-[1000] bg-white">
      <div className="container flex items-center justify-between">
        <DefaultNavigationMobile navigationData={navigationData} />
        <Link to={routes.home} className="h-[50px] lg:h-[66px]">
          <img src={HomeLogo} alt="Home Logo" className="w-full h-full object-contain" />
        </Link>
        <div className="items-center gap-6 hidden lg:flex">
          <ul className="flex items-center gap-6">
            {navigationData?.map((item) => (
              <li key={item.key} className="py-[5px] text-lg font-bold">
                {item.children ? (
                  <>
                    <button onClick={(e) => handleClick(e, item.label)}>
                      {item.label} {expandIcon(anchorEl[item.label])}
                    </button>
                    <Menu
                      sx={{ marginTop: "20px" }}
                      id={item.key}
                      anchorEl={anchorEl[item.label]}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      open={Boolean(anchorEl[item.label])}
                      onClose={() => onClose(item.label)}
                    >
                      {item.children.map((child) => (
                        <MenuItem
                          key={child.key}
                          sx={{ width: 200 }}
                          onClick={() => {
                            navigate(child.path);
                            onClose(item.label);
                          }}
                        >
                          {child.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Link to={item.path}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
          {!role &&
            USER_ACTIONS_NO_AUTH.map((item) => (
              <button
                key={item.key}
                className="uppercase text-base font-bold border border-[#F26522] px-3 py-[5px] rounded-full"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          {role && (
            <DefaultHeaderAction role={role} onHandleLogout={onHandleLogout} />
          )}
        </div>
        <DefaultHeaderAction
          isMobile
          role={role}
          onHandleLogout={onHandleLogout}
        />
      </div>
    </div>
  );
};

export default DefaultHeader;
