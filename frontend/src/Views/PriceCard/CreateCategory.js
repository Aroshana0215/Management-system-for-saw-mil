import React, { useState } from "react";
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
import { createCategory } from "../../services/PriceCardService"; // Import the createCategory function

const CreateCategory = () => {
  const { user } = useSelector((state) => state.auth);
let currentDate = new Date();
let year = currentDate.getFullYear();
let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
let day = ('0' + currentDate.getDate()).slice(-2);
let formattedDate = `${year}-${month}-${day}`;

const [isplank, setIsplank] = useState(false);
const [isTimberDust, setIsTimberDust] = useState(false);
const [isLumber, setisLumber] = useState(false);

console.log("isLumber:",isLumber);
console.log("isTimberDust:",isTimberDust);
console.log("isplank:",isplank);
// console.log(value);
    const [formData, setFormData] = useState({
      timberType: { bpMD: 6 },
      timberCategory: { bpMD: 6 },
      areaLength: { bpMD: 6 },
      areaWidth: { bpMD: 6 },
      minlength: { bpMD: 6 },
      maxlength: { bpMD: 6 },
      thickness: { bpMD: 6 },
      unitPrice: { bpMD: 6},
      description: { bpMD:6 },
    });
    const [payload, setPayload] = useState({
      timberType: "",
      timberCategory: "",
      areaLength: 0,
      areaWidth: 0,
      minlength: 0,
      maxlength: 0,
      thickness: 0,
      description: "",
      unitPrice: "",
      status: "A",
      createdBy: user.displayName,
      createdDate: formattedDate,
      modifiedBy: "",
      modifiedDate:"",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));
console.log(name);
console.log(value);
      if(name === "timberCategory")
        {
          if ( value === "Planks") {
            setIsplank(true);
            setIsTimberDust(false);
            setisLumber(false);
          } else if ( value === "Dust") {
            setIsplank(false);
            setIsTimberDust(true);
            setisLumber(false);
          }else{
            setIsplank(false);
            setIsTimberDust(false);
            setisLumber(true);
          }
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const loadId = await createCategory(payload);
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
          <Grid item xs={12} md={6} padding={1}>
            <FormControl fullWidth>
              <Typography>Category</Typography>
              <Select
                name="timberCategory"
                value={payload.timberCategory}
                onChange={handleChange}
              >
                <MenuItem value="Lumber">Lumber & Beams</MenuItem>
                <MenuItem value="Planks">Planks</MenuItem>
                <MenuItem value="Dust">Timber Dust</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} padding={1}>
            <FormControl fullWidth>
              <Typography>Area Length</Typography>
              <Select
                name="areaLength"
                value={payload.areaLength}
                onChange={handleChange}
                disabled={isplank || isTimberDust}
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} padding={1}>
            <FormControl fullWidth>
              <Typography>Thickness</Typography>
              <Select
                name="thickness"
                value={payload.thickness}
                onChange={handleChange}
                disabled={isLumber || isTimberDust}
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
          <Grid item xs={12} md={4} padding={1}>
            <FormControl fullWidth>
              <Typography>Area Width</Typography>
              <Select
                name="areaWidth"
                value={payload.areaWidth}
                onChange={handleChange}
                disabled={isTimberDust}
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
          {Object.entries(formData).map(
            ([key, item]) =>
              key !== "timberType" &&
              key !== "timberCategory" &&
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

export default CreateCategory;
