import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  FormControl,
  OutlinedInput,
  Stack,
  FormLabel,
} from "@mui/material";
import { NewLdRelatedTimber } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";

const AddLoadRelatedTimber = () => {
  const { loadId } = useParams();
  const [formData, setFormData] = useState({
    timberNo: { bpMD: 6 },
    treeType: { bpMD: 6 },
    perimeter: { bpMD: 6 },
    length: { bpMD: 6 },
    cubicAmount: { bpMD: 6 },
    otherDetails: { bpMD: 6 },
    unitPrice: { bpMD: 6 },
    totalTimerValue: { bpMD: 6 }, // Initialize totalTimerValue as empty string
    totalCuttingValue: { bpMD: 6 },
    outComeValue: { bpMD: 6 },
    cuttingDate: { bpMD: 6 },
    timberStatus: { bpMD: 6 },
    status: { bpMD: 6 },
    createdBy: { bpMD: 6 },
    createdDate: { bpMD: 6 },
    modifiedBy: { bpMD: 6 },
    modifiedDate: { bpMD: 6 },
    permitid_fk: { bpMD: 6 },
  });
  // eslint-disable-next-line no-unused-vars
  const [payload, setPayload] = useState({
    timberNo: "",
    treeType: "",
    perimeter: "",
    length: "",
    cubicAmount: "",
    otherDetails: "",
    unitPrice: "",
    totalTimerValue: "", // Initialize totalTimerValue as empty string
    totalCuttingValue: "",
    outComeValue: "",
    cuttingDate: "",
    timberStatus: "PENDING",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
    permitid_fk: loadId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    // Calculate totalTimerValue
    const totalTimerValue =
      parseFloat(newFormData.cubicAmount) * parseFloat(newFormData.unitPrice);
    newFormData.totalTimerValue = isNaN(totalTimerValue)
      ? ""
      : totalTimerValue.toFixed(2); // Ensure it's a string with 2 decimal places
    setFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const TimberId = await NewLdRelatedTimber(formData);
      console.log("New category ID:", TimberId);
      // Redirect to "/load" after successful submission
      window.location.href = "/load";
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
                  Add Timber
                </Typography>
              </Stack>
            </Grid>
            {Object.entries(formData).map(([key, item]) => (
              <Grid item key={key} xs={12} md={item.bpMD} padding={1}>
                <FormControl
                  fullWidth
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormLabel>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </FormLabel>
                  <OutlinedInput
                    size="small"
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
                Add Timber
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddLoadRelatedTimber;
