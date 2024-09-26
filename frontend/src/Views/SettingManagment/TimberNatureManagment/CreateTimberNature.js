import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { createTimberNature } from "../../../services/SettingManagementService/TimberNatureService";

const CreateTimberNature = () => {
  const { user } = useSelector((state) => state.auth);

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  let formattedDate = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState({
    natureName: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let formattedFormData = {
        ...formData,
        status: "A",
        createdBy: user.displayName,
        createdDate: formattedDate,
      };

       await createTimberNature(formattedFormData);
      window.location.href = "/setting/timberNature";
    } catch (error) {
      console.error("Error creating tree type:", error.message);
    }
  };

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
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Add timber nature
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            component={"form"}
            onSubmit={handleSubmit}
            padding={2}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Grid item xs={12} padding={1}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="typeName">
                  Nature Name
                </InputLabel>
                <TextField
                  id="natureName"
                  name="natureName"
                  value={formData.natureName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Enter nature name"
                  sx={{ mt: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} padding={1}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="description">
                  Description
                </InputLabel>
                <TextField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter description"
                  sx={{ mt: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              padding={2}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateTimberNature;
