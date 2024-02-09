import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { getCategoryById, updateCategory } from "../../services/PriceCardService"; // Import getCategoryById and updateCategory functions

const UpdateCategory = () => {
  const { categoryId } = useParams(); // Get categoryId from URL params
  const [categoryData, setCategoryData] = useState({
    timberType: "",
    areaLength: "",
    areaWidth: "",
    length: "",
    thickness: "",
    description: "",
    unitPrice: "",
  });

  // Fetch category data based on categoryId when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoryById(categoryId);
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCategory(categoryId, categoryData);
      console.log("Category updated successfully");
      // Optionally, redirect to another page after successful update
    } catch (error) {
      console.error("Error updating category:", error.message);
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
            Update Category
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            {Object.entries(categoryData).map(([key, value]) => (
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
              Update
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateCategory;
