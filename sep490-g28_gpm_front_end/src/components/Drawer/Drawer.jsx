import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Box,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FeedIcon from "@mui/icons-material/Feed";
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Assignment,
  Person,
  AttachMoney,
} from "@mui/icons-material";
import { routes } from "../../config";
import { isValidRole } from "../../utils/auth";

const menuItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    link: routes.admin,
  },
  {
    text: "Quản lý",
    icon: <Assignment />,
    subItems: [
      { text: "Dự án", link: "/admin/project-manage" },
      { text: "Chiến dịch", link: "/admin/campaign-manage" },
      { text: "Bài viết", link: "/admin/news-manage" },
    ],
  },
  // Add other menu items similarly...
];

function ResponsiveDrawer({ shrink }) {
  const isAdmin = isValidRole("ROLE_ADMIN");
  const isProjectManager = isValidRole("ROLE_PROJECT_MANAGER");
  const isSocialStaff = isValidRole("ROLE_SOCIAL_STAFF");

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      link: routes.admin,
    },
    {
      text: "Danh sách quyên góp",
      icon: <AttachMoney />,
      link: routes.donationList,
    },
    {
      text: "Quản lý dự án",
      icon: <Assignment />,
      subItems: [
        {
          text: "Tất cả dự án",
          link: routes.manageProject,
        },
        ...(isAdmin
          ? [
              {
                text: "Tạo dự án",
                link: routes.createProject,
              },
            ]
          : []),
        ...(isProjectManager
          ? [
              {
                text: "Dự án tham gia",
                link: routes.assignProject,
              },
            ]
          : []),
      ],
    },
    {
      text: "Quản lý thử thách",
      icon: <Assignment />,
      link: routes.adminChallengeList,
    },
    {
      text: "Quản lý chiến dịch",
      icon: <Assignment />,
      subItems: [
        { text: "Chiến dịch", link: routes.manageCampaign },
        isAdmin && { text: "Tạo chiến dịch", link: routes.createCampaign },
      ].filter(Boolean),
    },
    {
      text: "Quản lý danh mục bài viết",
      icon: <FeedIcon />,
      link: routes.listCategory,
    },
    {
      text: "Quản lý bài viết",
      icon: <FeedIcon />,
      subItems: [
        {
          text: "Danh sách bài viết",
          link: routes.manageNews,
        },
        ...(isSocialStaff
          ? [
              {
                text: "Bài viết bản thân",
                link: routes.createdNews,
              },
            ]
          : []),
        (isSocialStaff || isAdmin) && {
          text: "Tạo bài viết",
          link: routes.createNews,
        },
      ].filter(Boolean),
    },
    {
      text: "Quản lý người dùng",
      icon: <ManageAccountsIcon />,
      link: routes.systemUserList,
    },
    isAdmin && {
      text: "Quản lý tài khoản",
      icon: <ManageAccountsIcon />,
      subItems: [
        {
          text: "Danh sách tài khoản",
          link: routes.manageAccount,
        },
        {
          text: "Tạo tài khoản nhân viên",
          link: routes.createAccount,
        },
      ],
    },
    {
      text: "Tài khoản cá nhân",
      icon: <Person />,
      link: routes.adminProfile,
    },
    // Add other menu items similarly...
  ].filter(Boolean); // Filter out null values

  const [open, setOpen] = useState({
    // "Quản lý dự án": true,
    // "Quản lý chiến dịch": true,
    // "Quản lý bài viết": true,
    // "Quản lý tài khoản": true,
    // Add other menu items similarly if they have sub-items
  });

  const handleClick = (text) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [text]: !prevOpen[text],
    }));
  };

  return (
    <Box
      component="nav"
      className={`${
        shrink ? "sm:w-[250px]" : "md:w-0"
      } ease-in-out duration-200 flex-shrink-0`}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 245,
          borderWidth: 0,
          backgroundColor: "white",
          top: "70px", // Đặt vị trí top của Sidebar dưới Header
          height: "calc(100vh - 70px)", // Chiều cao giới hạn của Drawer
          overflow: "auto", // Cho phép cuộn nội dung
        },
      }}
    >
      <Drawer
        variant="persistent"
        open={shrink}
        className="pb-0 h-[calc(100vh_-_70px)] max-h-[calc(100vh_-_70px)] border-t"
      >
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              {item.link ? (
                <ListItem component={Link} to={item.link}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ) : (
                <>
                  <ListItem onClick={() => handleClick(item.text)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subItems ? (
                      open[item.text] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : null}
                  </ListItem>
                  {item.subItems && (
                    <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem) => (
                          <ListItem
                            component={Link}
                            to={subItem.link}
                            key={subItem.text}
                          >
                            <ListItemText
                              className="pl-14"
                              primary={subItem.text}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
              )}
            </div>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default ResponsiveDrawer;
