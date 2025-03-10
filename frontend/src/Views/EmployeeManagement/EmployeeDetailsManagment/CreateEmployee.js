import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  Input,
} from "@mui/material";
import { useSelector } from "react-redux";
import { newEmployee } from "../../../services/EmployeeManagementService/EmployeeDetailService";

const CreateEmployee = () => {
  const { user } = useSelector((state) => state.auth);

  let currentDate = new Date().toISOString().split("T")[0];

  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    address: "",
    phoneNo: "",
    otValuePerHour: "",
    salaryPerDay: "",
    currentLendAmount: "",
    joinDate: "",
    employeeImage: null,
    status: "A",
    createdDate: currentDate,
    createdBy: user.displayName,
    modifiedBy: "",
    modifiedDate: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!payload.firstName) tempErrors.firstName = "First name is required";
    if (!payload.lastName) tempErrors.lastName = "Last name is required";
    if (!payload.nic) tempErrors.nic = "NIC is required";
    else if (!/^[0-9]{9}[VvXx]|[0-9]{12}$/.test(payload.nic))
      tempErrors.nic = "Invalid NIC format";
    if (!payload.phoneNo) tempErrors.phoneNo = "Phone number is required";
    else if (!/^\d{10}$/.test(payload.phoneNo))
      tempErrors.phoneNo = "Phone number must be 10 digits";
    if (!payload.salaryPerDay) tempErrors.salaryPerDay = "Salary per day is required";
    else if (isNaN(payload.salaryPerDay) || payload.salaryPerDay <= 0)
      tempErrors.salaryPerDay = "Enter a valid positive number";
    if (!payload.otValuePerHour) tempErrors.otValuePerHour = "OT value per hour is required";
    else if (isNaN(payload.otValuePerHour) || payload.otValuePerHour <= 0)
      tempErrors.otValuePerHour = "Enter a valid positive number";
    if (!payload.address) tempErrors.address = "Address is required";
    if (!payload.joinDate) tempErrors.joinDate = "Join Date is required";
    if (!payload.employeeImage) tempErrors.employeeImage = "Employee image is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      employeeImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const newEmployeeId = await newEmployee(payload);
      window.location.href = `/employee`;
    } catch (error) {
      console.error("Error creating employee:", error.message);
    }
  };

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2} p={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Employee Details Submission
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            component="form"
            onSubmit={handleSubmit}
            padding={2}
            sx={{ bgcolor: "background.default", borderRadius: 2 }}
          >
            {Object.entries(payload).map(([key, value]) => (
              ["status", "createdDate", "createdBy", "modifiedBy", "modifiedDate", "employeeImage"].includes(key) ? null : (
                <Grid item key={key} xs={12} md={6} padding={1}>
                  <FormControl fullWidth>
                    <Typography>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                    </Typography>
                    <TextField
                      name={key}
                      value={value}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      type={key === "joinDate" ? "date" : "text"}
                      InputLabelProps={{ shrink: key === "joinDate" }}
                      error={!!errors[key]}
                      helperText={errors[key]}
                      sx={{ mt: 2 }}
                    />
                  </FormControl>
                </Grid>
              )
            ))}
            <Grid item xs={12} md={6} padding={1}>
              <FormControl fullWidth>
                <Typography>Employee Image</Typography>
                <Input
                  type="file"
                  accept="image/png"
                  onChange={handleFileChange}
                  error={!!errors.employeeImage}
                />
                {errors.employeeImage && (
                  <Typography color="error" variant="body2">{errors.employeeImage}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} padding={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
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
