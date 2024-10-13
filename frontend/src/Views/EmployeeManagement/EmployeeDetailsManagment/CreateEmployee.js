import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { newEmployee } from "../../../services/EmployeeManagementService/EmployeeDetailService";

const CreateEmployee = () => {
  const { user } = useSelector((state) => state.auth);

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  let formattedDate = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState({
    name: { bpMD: 6 },
    nic: { bpMD: 6 },
    address: { bpMD: 6 },
    phoneNo: { bpMD: 6 },
    otValuePerHour: { bpMD: 6 },
    salaryPerDay: { bpMD: 6 },
    currentLendAmount: { bpMD: 6 },
    dateOfBirth: { bpMD: 6 },
    joinDate: { bpMD: 6 },
  });

  const [payload, setPayload] = useState({
    name: "",
    nic: "",
    address: "",
    phoneNo: "",
    otValuePerHour: "",
    salaryPerDay: "",
    currentLendAmount: "",
    joinDate: "",
    dateOfBirth: "",
    status: "A",
    createdDate: formattedDate,
    createdBy: user.displayName,
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
      const newEmployeeId = await newEmployee(payload);
      window.location.href = `/employee/dependatnt/${newEmployeeId}`;
    } catch (error) {
      console.error("Error creating employee:", error.message);
    }
  };

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2} p={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Create Employee
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
            {Object.entries(formData).map(([key, item]) => (
              <Grid item key={key} xs={12} md={item.bpMD} padding={1}>
                <FormControl fullWidth>
                  <Typography>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <TextField
                    name={key}
                    value={payload[key]}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    type={
                      key === "joinDate" || key === "dateOfBirth"
                        ? "datetime-local"
                        : "text"
                    }
                    InputLabelProps={{
                      shrink: key === "joinDate" || key === "dateOfBirth",
                    }}
                    sx={{ mt: 2 }}
                  />
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

export default CreateEmployee;
