import { Box, CssBaseline, Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "../Components/Headers/HeaderMain";
import MainSideBar from "../Components/SideBars/MainSideBar";
import Theme from "../Theme/Theme";

const MainLayout = () => {
  return (
    <>
      <CssBaseline />
      <HeaderMain />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{
          height: "100%",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "background.default",
        }}
      >
        <Grid item xs={2} paddingTop={2}>
          <MainSideBar />
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              height: "100%",
              bgcolor: Theme.palette.primary.mainBgS1,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              padding: 2,
            }}
          >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MainLayout;
