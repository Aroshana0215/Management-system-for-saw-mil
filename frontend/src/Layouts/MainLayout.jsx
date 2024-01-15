import { Box, CssBaseline } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "../Components/Headers/HeaderMain";

const MainLayout = () => {
  return (
    <>
      <CssBaseline />
      <Box>
        <HeaderMain />
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
