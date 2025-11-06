import {
  alpha,
  Box,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, type ComponentType } from "react";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import { Link, useLocation } from "react-router-dom";
import { sidebarItems } from "../../constants/sidebarItems";

export interface ISidebarItems {
  icon: ComponentType;
  title: string;
  href: string;
}

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpandSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box
      position={"sticky"}
      top={0}
      sx={{
        width: isExpanded ? 260 : 80,
        transition: "width 0.2s ease",
        height: "100vh",
      }}
    >
      <Tooltip title={isExpanded ? "Reduce" : "Expand"} placement="auto">
        <IconButton
          onClick={toggleExpandSidebar}
          sx={{
            position: "absolute",
            top: "50%",
            left: isExpanded ? 240 : 62,
            transition: "left 0.3s ease",
            backgroundColor: "primary.dark",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            color: "white",
            borderRadius: "50%",
            padding: "4px",
            ":hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <Icon>
            {isExpanded ? (
              <KeyboardDoubleArrowLeftOutlinedIcon />
            ) : (
              <KeyboardDoubleArrowRightOutlinedIcon />
            )}
          </Icon>
        </IconButton>
      </Tooltip>

      {/* sidebar logo */}
      <Box
        display="flex"
        gap="12px"
        alignItems="center"
        height={"6rem"}
        px={2}
        py={2}
        sx={{
          background: "linear-gradient(90deg, #5E2B97 0%, #7C3AED 100% )",
          borderBottom: "1px solid #9370DB",
          transition: "background-color 0.2s ease",
        }}
      >
        {/* logo */}
        <Tooltip title="CMO Flexera">
          <Box
            component="img"
            src="/flexera-logo.png"
            alt="CMO Flexera"
            width={48}
            height={48}
            sx={{
              borderRadius: "50%",
              boxShadow: `0 0 12px 4px rgba(196, 181, 253, 0.8), 0 0 24px 8px rgba(125, 249, 255, 0.8)`,
              transition: "box-shadow 0.3s ease-in-out",
              bgcolor: "primary.light",
              // border: "1px solid red",
              ":hover": {
                boxShadow: `0 0 20px 6px rgba(196, 181, 253, 1), 0 0 30px 10px rgba(125, 249, 255, 1)`, // Enhanced glow on hover
              },
            }}
          />
        </Tooltip>

        {isExpanded && (
          <Box display="flex" flexDirection="column">
            <Typography
              variant="h5"
              fontWeight={500}
              color="primary.contrastText"
            >
              CMO Flexera
            </Typography>
            <Typography
              variant="caption"
              fontWeight={400}
              sx={{ fontSize: "12px", color: "secondary.main" }}
            >
              Policy Generator
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sidebar items */}
      <Box display="flex" flexDirection="column" gap={1} px={2} py={2}>
        {sidebarItems.map((item, idx) => {
          const isActive = location.pathname === item.href;

          return (
            <Tooltip
              key={idx}
              title={isExpanded ? "" : item.title}
              placement="right"
              arrow
              disableInteractive
            >
              <Link
                to={item.href}
                key={idx}
                style={{ textDecoration: "none" }}
                aria-current={isActive ? "page" : undefined}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={2}
                  py={1.25}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "primary.main" : "transparent",
                    color: isActive ? "white" : "white",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    ":hover": {
                      bgcolor: isActive ? "" : "primary.light",
                      color: isActive ? "" : "white",
                    },
                    justifyContent: isExpanded ? "" : "center",
                  }}
                >
                  {item.icon && <item.icon />}
                  {isExpanded && (
                    <Typography
                      variant="body1"
                      fontWeight={isActive ? 600 : 500}
                      color={isActive ? "white" : alpha("#fff", 0.9)}
                    >
                      {item.title}
                    </Typography>
                  )}
                </Box>
              </Link>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
