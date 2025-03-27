import { ExpandLess, ExpandMore, MenuOutlined } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const DefaultNavigationMobile = ({navigationData}) => {
  const [open, setOpen] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClick = (text) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [text]: !prevOpen[text],
    }));
  };

  const expandIcon = (isExpand) => {
    return isExpand ? <ExpandLess /> : <ExpandMore />;
  };

  return (
    <div className="flex items-center lg:hidden">
      <IconButton onClick={() => setOpenDrawer(true)}>
        <MenuOutlined />
      </IconButton>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {navigationData.map((item) => (
              <div key={item.label}>
                {!item.children ? (
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ) : (
                  <>
                    <ListItemButton onClick={() => handleClick(item.label)}>
                      <ListItemText primary={item.label} />
                      {item.children && expandIcon(open[item.label])}
                    </ListItemButton>
                    {item.children && (
                      <Collapse
                        in={open[item.label]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {item.children.map((subItem) => (
                            <ListItemButton
                              component={Link}
                              to={subItem.path}
                              key={subItem.label}
                              sx={{ pl: 4 }}
                              onClick={() => setOpenDrawer(false)}
                            >
                              <ListItemText primary={subItem.label} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </>
                )}
              </div>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default DefaultNavigationMobile;
