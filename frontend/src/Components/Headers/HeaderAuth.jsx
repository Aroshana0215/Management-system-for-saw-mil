import React from "react";
import { Box, Stack, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import sawMillLogo from "../../assets/images/sawMillLogo.png";
import Theme from "../../Theme/Theme";
import LoginIcon from "@mui/icons-material/Login";

export default function HeaderAuth() {
  const mainBgS1 = Theme.palette.primary.mainBgS1;
  return (
    <>
      <AppBar
        position="sticky"
        sx={{ boxShadow: 0, borderTopLeftRadius: 20, bgcolor: mainBgS1 }}
      >
        <Toolbar>
          <Box component={Link} to={"/"} paddingX={2}>
            <img alt="Logo" src={sawMillLogo} width={60} />
          </Box>

          <Stack
            spacing={3}
            direction={"row"}
            marginX={2}
            sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
          >
            <Button
              variant="text"
              sx={{ color: "#111" }}
              //TODO:
              // component={Link}
              // to={"/where/to"}
            >
              About Us
            </Button>
            <Button
              variant="text"
              sx={{ color: "#111" }}
              //TODO:
              // component={Link}
              // to={"/where/to"}
            >
              Contact Us
            </Button>
          </Stack>
          <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems="center"
            columnGap={2}
          >
            <Button variant="text" startIcon={<LoginIcon />}>
              Sign In
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
