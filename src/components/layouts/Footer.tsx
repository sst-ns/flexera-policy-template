import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const terms_of_use_uri = `${
  import.meta.env.VITE_API_TERMS_OF_USE
}/support_portal?id=sp_acn_4_0_terms_of_use`;

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: { xs: "auto", md: "3rem" },
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "width 0.3s ease, height 0.3s ease",
        flexShrink: 0,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        © 2001–2025 Accenture. All rights reserved. Accenture Highly
        Confidential. For internal use only |
        <MuiLink
          component={RouterLink}
          to={terms_of_use_uri}
          target="_blank"
          underline="hover"
          sx={{ color: "white", ml: 1 }}
        >
          Terms of use
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;
