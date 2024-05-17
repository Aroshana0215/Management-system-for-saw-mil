import React from "react";
import { Stack, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import sawMillLogo from "../../assets/images/sawMillLogo.png";
import AccountMenu from "../Menus/AccountMenu";

export default function HeaderMain() {
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          boxShadow: 0,
          bgcolor: "background.default",
        }}
      >
        <Toolbar>
          <Box component={Link} to={"/"} paddingX={2}>
            <img alt="Logo" src={sawMillLogo} width={50} />
          </Box>
          <Typography component="div" sx={{ flexGrow: 1 }}></Typography>

          <Stack direction={"row"} justifyContent="center" alignItems="center">
            <AccountMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
