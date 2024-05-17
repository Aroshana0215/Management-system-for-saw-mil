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
      <HeaderMain />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        sx={{ minHeight: "100vh", bgcolor: "background.default" }}
      >
        <Grid item xs={2}>
          <MainSideBar />
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              height: "100%",
              bgcolor: Theme.palette.primary.mainBgS1,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
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
