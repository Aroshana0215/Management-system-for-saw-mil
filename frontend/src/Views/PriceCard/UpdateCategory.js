import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  OutlinedInput,
  FormControl,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getCategoryById, updateCategory } from "../../services/PriceCardService"; // Import getCategoryById and updateCategory functions

const UpdateCategory = () => {
  const { categoryId } = useParams(); // Get categoryId from URL params
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategoryById(categoryId);
        console.log("data:",data);
        setPayload(data);
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [categoryId]);

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
  let day = ('0' + currentDate.getDate()).slice(-2);
  let formattedDate = `${year}-${month}-${day}`;

  const [formData] = useState({
    timberType: { bpMD: 6 },
    areaLength: { bpMD: 3 },
    areaWidth: { bpMD: 3 },
    minlength: { bpMD: 6 },
    maxlength: { bpMD: 6 },
    thickness: { bpMD: 6 },
    unitPrice: { bpMD: 6 },
    description: { bpMD: 6 },
  });

  const [payload, setPayload] = useState({
    timberType: "",
    areaLength: "",
    areaWidth: "",
    minlength: "",
    maxlength: "",
    thickness: "",
    description: "",
    unitPrice: "",
    status: "A",
    createdBy: user.displayName,
    createdDate: formattedDate,
    modifiedBy: "",
    modifiedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCategory(categoryId, payload);;
      window.location.href = `/price`;
    } catch (error) {
      console.error("Error creating category:", error.message);
      // Handle error
    }
  };

  return (
    <>
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
    >
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
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h6" color="primary" align="center">
                Create Load Details
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} padding={1}>
            <FormControl fullWidth>
              <Typography>Timber Type</Typography>
              <Select
                name="timberType"
                value={payload.timberType}
                onChange={handleChange}
              >
                <MenuItem value="Sapu">Sapu</MenuItem>
                <MenuItem value="Grandis">Grandis</MenuItem>
                <MenuItem value="Thekka">Thekka</MenuItem>
                <MenuItem value="Micro">Micro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} padding={1}>
            <FormControl fullWidth>
              <Typography>Area Length</Typography>
              <Select
                name="areaLength"
                value={payload.areaLength}
                onChange={handleChange}
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} padding={1}>
            <FormControl fullWidth>
              <Typography>Area Width</Typography>
              <Select
                name="areaWidth"
                value={payload.areaWidth}
                onChange={handleChange}
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} padding={1}>
            <FormControl fullWidth>
              <Typography>Min Length</Typography>
              <Select
                name="minlength"
                value={payload.minlength}
                onChange={handleChange}
              >
                {[...Array(15)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} padding={1}>
            <FormControl fullWidth>
              <Typography>Max Length</Typography>
              <Select
                name="maxlength"
                value={payload.maxlength}
                onChange={handleChange}
              >
                {[...Array(30)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} padding={1}>
            <FormControl fullWidth>
              <Typography>Thickness</Typography>
              <Select
                name="thickness"
                value={payload.thickness}
                onChange={handleChange}
                disabled={payload.thickness === 0}
              >
                {[0.3, 0.6, 0.9,1, 1.3, 1.6, 1.9, 2, 2.3, 2.6, 2.9, 3, 3.2, 3.6, 3.9, 4].map(
                  (value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
          {Object.entries(formData).map(
            ([key, item]) =>
              key !== "timberType" &&
              key !== "areaLength" &&
              key !== "areaWidth" &&
              key !== "minlength" &&
              key !== "maxlength" &&
              key !== "thickness" && (
                <Grid item key={key} xs={12} md={item.bpMD} padding={1}>
                  <FormControl fullWidth>
                    <Typography>
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </Typography>
                    <OutlinedInput
                      name={key}
                      value={payload[key]}
                      onChange={handleChange}
                    />
                    {/* <FormHelperText/> */}
                  </FormControl>
                </Grid>
              )
          )}
          <Grid
            item
            xs={12}
            padding={2}
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Button type="submit" variant="contained">
              Create Category
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </>
  );
};

export default UpdateCategory;
