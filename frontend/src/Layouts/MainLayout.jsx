import { Box, Container, CssBaseline, Grid } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "../Components/Headers/HeaderMain";
import MainSideBar from "../Components/SideBars/MainSideBar";
import Theme from "../Theme/Theme";

const MainLayout = () => {
  return (
    <>
      <CssBaseline />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{ minHeight: "100vh", bgcolor: "background.default" }}
      >
        <Grid item xs={2.5}>
          <MainSideBar />
        </Grid>
        <Grid item xs={9.5}>
          <Box
            sx={{
              height: "100%",
              bgcolor: Theme.palette.primary.mainBgS1,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }}
          >
            <HeaderMain />
            <Container>
              <Outlet />
            </Container>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MainLayout;
