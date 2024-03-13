import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { newEmployee } from "../../../services/EmployeeManagementService/EmployeeDetailService"; // Import the createCategory function

const CreateEmployee = () => {
  const [name, setname] = useState("");
  const [nic, setnic] = useState("");
  const [address, setaddress] = useState("");
  const [otValuePerHour, setotValuePerHour] = useState("");
  const [salaryPerDay, setsalaryPerDay] = useState("");
  const [currentLendAmount, setcurrentLendAmount] = useState("");
  const [joinDate, setjoinDate] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const combinedDateTime = new Date(joinDate);
    const combinedBirthDateTime = new Date(dateOfBirth);
    const formData = {
         name,
         nic,
         address,
         otValuePerHour,
         salaryPerDay,
         currentLendAmount, 
         joinDate : combinedDateTime,
         dateOfBirth : combinedBirthDateTime,
         status,
         createdBy,
         createdDate,
         modifiedBy,
         modifiedDate,
    };

    try {
      const newEmployeeId = await newEmployee(formData);
      console.log("New category ID:", newEmployeeId);

      window.location.href = `/employee/dependatnt/${newEmployeeId}`;
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
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setname(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="NIC"
              variant="outlined"
              value={nic}
              onChange={(e) => setnic(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              value={address}
              onChange={(e) => setaddress(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Ot Value Per Day"
              variant="outlined"
              value={otValuePerHour}
              onChange={(e) => setotValuePerHour(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Salary Per Day"
              variant="outlined"
              value={salaryPerDay}
              onChange={(e) => setsalaryPerDay(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="currentLendAmount"
              variant="outlined"
              value={currentLendAmount}
              onChange={(e) => setcurrentLendAmount(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="joinDate"
              type="datetime-local"
              value={joinDate}
              onChange={(e) => setjoinDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="date of birth"
              type="datetime-local"
              value={dateOfBirth}
              onChange={(e) => setdateOfBirth(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
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

export default CreateEmployee;
