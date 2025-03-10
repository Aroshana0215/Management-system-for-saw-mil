import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  Paper,
  Box,
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
  const [imagePreview, setImagePreview] = useState(null);

  const placeholders = {
    firstName: "John",
    lastName: "Doe",
    nic: "123456789V",
    address: "123, Main Street, City",
    phoneNo: "0712345678",
    otValuePerHour: "500",
    salaryPerDay: "3000",
    currentLendAmount: "0",
    joinDate: "",
  };

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
    const file = e.target.files[0];
    if (file) {
      setPayload((prevPayload) => ({
        ...prevPayload,
        employeeImage: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const newEmployeeId = await newEmployee(payload);
      window.location.href = `/employee/dependatnt/${newEmployeeId}`;
    } catch (error) {
      console.error("Error creating employee:", error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          Employee Details Submission
        </Typography>
        <Grid container component="form" onSubmit={handleSubmit} spacing={2}>
          {Object.entries(payload).map(([key, value]) => (
            ["status", "createdDate", "createdBy", "modifiedBy", "modifiedDate", "employeeImage"].includes(key) ? null : (
              <Grid item key={key} xs={12} md={6}>
                <FormControl fullWidth>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
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
                    placeholder={placeholders[key] || ""}
                    error={!!errors[key]}
                    helperText={errors[key]}
                  />
                </FormControl>
              </Grid>
            )
          ))}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Employee Image
              </Typography>
              <Box
                sx={{
                  border: "1px dashed grey",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 60,
                  cursor: "pointer",
                  textAlign: "center",
                  p: 2,
                }}
                onClick={() => document.getElementById("employeeImageInput").click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Click to upload PNG (Max 5MB)
                  </Typography>
                )}
              </Box>
              <input
                id="employeeImageInput"
                type="file"
                accept="image/png"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" size="large">
              Create
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateEmployee;
