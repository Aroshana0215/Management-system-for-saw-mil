import { Container, Grid, Typography } from "@mui/material";
import React from "react";

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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
