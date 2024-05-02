import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  OutlinedInput,
  FormControl,
  Stack,
} from "@mui/material";
import { NewLoad } from "../../../services/InventoryManagementService/LoadDetailsService";
import { useSelector } from "react-redux";

const CreateNewLoadRec = () => {
  const { user } = useSelector((state) => state.auth);
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState({
    sellerName: { bpMD: 6 },
    permitNumber: { bpMD: 6 },
    region: { bpMD: 6 },
    lorryNumber: { bpMD: 6 },
    driver: { bpMD: 6 },
    unloadedDate: { bpMD: 6 },
    otherDetails: { bpMD: 12 },
  });
  const [payload, setPayload] = useState({
    sellerName: "",
    permitNumber: "",
    region: "",
    lorryNumber: "",
    driver: "",
    otherDetails: "",
    unloadedDate: "",
    status: "a",
    createdBy: user.displayName,
    modifiedBy: "",
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
      const loadId = await NewLoad(payload);
      console.log("New category ID:", loadId);
      window.location.href = `/load/timber/view/${loadId}`;
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
            {Object.entries(formData).map(([key, item]) => (
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
            ))}
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
                Create Load
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateNewLoadRec;
