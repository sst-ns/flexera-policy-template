import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import Footer from "./Footer";

const Layout = () => {
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" bgcolor="primary.dark">
        <Sidebar />
      </Box>

      <Box flex={1} display="flex" flexDirection="column">
        <Header />
        <Box minHeight={"80vh"} px={4} py={4}>
          <Outlet />
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
