import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { createCategory } from "../../services/PriceCardService"; // Import the createCategory function

const CreateCategory = () => {
  const [timberType, setTimberType] = useState("");
  const [areaLength, setAreaLength] = useState("");
  const [areaWidth, setAreaWidth] = useState("");
  const [minlength, setMinlength] = useState("");
  const [maxlength, setMaxlength] = useState("");
  const [thickness, setThickness] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      timberType,
      areaLength,
      areaWidth,
      minlength,
      maxlength,
      thickness,
      description,
      unitPrice,
      status,
      createdBy,
      createdDate,
      modifiedBy,
      modifiedDate,
    };

    try {
      const categoryId = await createCategory(formData);
      console.log("New category ID:", categoryId);
      // Redirect to "/price" after successful submission
      window.location.href = "/price";
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
            Create Category
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Timber Type"
              variant="outlined"
              value={timberType}
              onChange={(e) => setTimberType(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Area Length"
              variant="outlined"
              value={areaLength}
              onChange={(e) => setAreaLength(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Area Width"
              variant="outlined"
              value={areaWidth}
              onChange={(e) => setAreaWidth(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Min Length"
              variant="outlined"
              value={minlength}
              onChange={(e) => setMinlength(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Max Length"
              variant="outlined"
              value={maxlength}
              onChange={(e) => setMaxlength(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Thickness"
              variant="outlined"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Unit Price"
              variant="outlined"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Status"
              variant="outlined"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Created By"
              variant="outlined"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Created Date"
              variant="outlined"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Modified By"
              variant="outlined"
              value={modifiedBy}
              onChange={(e) => setModifiedBy(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Modified Date"
              variant="outlined"
              value={modifiedDate}
              onChange={(e) => setModifiedDate(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create
            </Button>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Typography
            component={Link}
            to={"/price"}
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

export default CreateCategory;
