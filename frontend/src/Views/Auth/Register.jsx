import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <Container>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Sign up
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: "center", mb: 3 }}>
            Enter your details below to create your account and get started.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Full Name" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone Number" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mt={2}
          >
            <Button variant="outlined" fullWidth>
              Cancel
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Confirm
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            mt={2}
          >
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Already have an account?
            </Typography>
            <Typography
              component={Link}
              to={"/auth/sign-in"}
              variant="body2"
              sx={{ textAlign: "center", textDecoration: "none" }}
            >
              Sign In
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
