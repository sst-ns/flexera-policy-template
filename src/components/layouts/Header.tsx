import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sidebarItems } from "../../constants/sidebarItems";
import { Box, Typography } from "@mui/material";
import type { ISidebarItems } from "./Sidebar";

const Header = () => {
  const location = useLocation();
  const [headerItem, setHeaderItem] = useState<ISidebarItems | null>(null);

  useEffect(() => {
    const item = sidebarItems.filter((item) => item.href === location.pathname);
    setHeaderItem(item[0]);
  }, [location]);

  return (
    <Box
      component="header"
      display="flex"
      alignItems="center"
      sx={{
        bgcolor: "white",
        padding: "16px",
        position: "sticky",
        top: 0,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "primary.main",
          borderRadius: "30%",
          padding: "8px",
          marginRight: "12px",
          color: "white",
        }}
      >
        {headerItem && <headerItem.icon />}
      </Box>

      <Typography variant="h6" fontWeight={400} color="primary.main">
        {headerItem?.title}
      </Typography>
    </Box>
  );
};

export default Header;
