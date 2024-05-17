import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { newDependant } from "../../../services/EmployeeManagementService/EmployeeDependentService"; // Import the createCategory function

const EmpDependatnt = () => {
  const { eid } = useParams(); // Get categoryId from URL params
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState({
    name: { bpMD: 6 },
    nic: { bpMD: 6 },
    phoneNumber: { bpMD: 6 },
    relationship: { bpMD: 6 },
    dateOfBirth: { bpMD: 6 },
    status: { bpMD: 6 },
    createdBy: { bpMD: 6 },
    createdDate: { bpMD: 6 },
    modifiedBy: { bpMD: 6 },
    modifiedDate: { bpMD: 6 },
  });
  const [payload, setPayload] = useState({
    name: "",
    nic: "",
    phoneNumber: "",
    relationship: "",
    dateOfBirth: "",
    status: "",
    createdBy: "",
    createdDate: "",
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
    const combinedDateTime = new Date(payload.dateOfBirth);
    const newDependantPayload = {
      ...payload,
      eid_fk: eid,
      dateOfBirth: combinedDateTime,
    };

    try {
      const newDependantId = await newDependant(newDependantPayload);
      console.log("New category ID:", newDependantId);

      window.location.href = `/employee`;
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
                  Create Dependent
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
                    type={key === "dateOfBirth" ? "datetime-local" : null}
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
                Create Dependent
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EmpDependatnt;
