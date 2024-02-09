import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { NewInventory } from "../../../services/InventoryManagementService/StockManagementService"; // Import the createCategory function

const CreateNewStock = () => {
  const [formData, setFormData] = useState({

    categoryId_fk : "",
    timberId_fk : "",
    sectionNumber : "",
    amountOfPieces : "",
    MachineNo : "",
    status: "A",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loadId = await NewInventory(formData);
      console.log("New category ID:", loadId);
      // Redirect to "/price" after successful submission
      window.location.href = "/stock";
    } catch (error) {
      console.error("Error creating category:", error.message);
      // Handle error
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
            Create Load Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                variant="outlined"
                name={key}
                value={value}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Stock
            </Button>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Typography
            component={Link}
            to={"/load"}
            variant="body2"
            sx={{ textAlign: "center", textDecoration: "none" }}
          >
            Go to Price Page
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateNewStock;
