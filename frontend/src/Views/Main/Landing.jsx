import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
        p={2}
      >
        <Grid item>
          <Typography variant="h4" color={"primary"}>
            Welcome
          </Typography>
          <Typography
              component={Link}
              to={"/price"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Price card
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/load"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Load Management
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/stock"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Stock Management
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/bill"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              bill and order Management
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/employee"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Employee Management
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/employee/daily"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Employee Daily Records
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/income"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Income Management
            </Typography>
            <br/>
            <Typography
              component={Link}
              to={"/exp"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Expenses Management
            </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
