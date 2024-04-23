import React from "react";
import {
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/features/auth/authSlice";
import Theme from "../../Theme/Theme";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

export default function HeaderMain() {
  const { user } = useSelector((state) => state.auth);
  const mainBgS1 = Theme.palette.primary.mainBgS1;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClickLogOut = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <AppBar
        position="sticky"
        sx={{ boxShadow: 0, borderTopLeftRadius: 20, bgcolor: mainBgS1 }}
      >
        <Toolbar>
          <Stack
            spacing={3}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            marginX={2}
            sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
          >
            <Avatar alt={user?.displayName} src={user?.photoURL} />
            <Typography color={"primary"}>{user?.displayName}</Typography>
          </Stack>
          <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems="center"
            columnGap={2}
          >
            <Button
              startIcon={<LogoutIcon />}
              variant="text"
              onClick={(e) => onClickLogOut(e)}
            >
              Sign Out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
