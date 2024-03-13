import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { newDependant } from "../../../services/EmployeeManagementService/EmployeeDependentService"; // Import the createCategory function

const EmpDependatnt = () => {

 const { eid } = useParams(); // Get categoryId from URL params

  const [name, setname] = useState("");
  const [nic, setnic] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [relationship, setrelationship] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [status, setStatus] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const combinedDateTime = new Date(dateOfBirth);
    const formData = {
         name,
         nic,
         phoneNumber,
         relationship,
         eid_fk : eid,
         dateOfBirth : combinedDateTime, 
         status,
         createdBy,
         createdDate,
         modifiedBy,
         modifiedDate,
    };

    try {
      const newDependantId = await newDependant(formData);
      console.log("New category ID:", newDependantId);

      window.location.href = `/employee`;
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
              label="phoneNumber"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Ot Value Per Day"
              variant="outlined"
              value={relationship}
              onChange={(e) => setrelationship(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="dateOfBirth"
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

export default EmpDependatnt;
