import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getemployeeDetailsById } from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { getDependentsByEid } from "../../../services/EmployeeManagementService/EmployeeDependentService";

const ViewEmpDetails = () => {
  const { eid } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const empDetails = await getemployeeDetailsById(eid);
        setEmployee(empDetails);
        const empDependents = await getDependentsByEid(eid);
        setDependents(empDependents);
      } catch (error) {
        console.error("Error fetching employee details:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [eid]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!employee) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Unable to load employee details. Please try again later.
      </Typography>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Employee Details
          </Typography>
        </Grid>

        {/* Employee Details Card */}
        <Grid item xs={12} md={8} mx="auto">
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Name:</strong> {employee.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>NIC:</strong> {employee.nic}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Phone No:</strong> {employee.phoneNo}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Address:</strong> {employee.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Salary Per Day:</strong> {employee.salaryPerDay}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>OT Value Per Hour:</strong>{" "}
                    {employee.otValuePerHour}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Join Date:</strong>{" "}
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Dependents Table */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Dependents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>NIC</strong></TableCell>
                  <TableCell><strong>Phone Number</strong></TableCell>
                  <TableCell><strong>Relationship</strong></TableCell>
                  <TableCell><strong>Date of Birth</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dependents.length > 0 ? (
                  dependents.map((dependent) => (
                    <TableRow key={dependent.id}>
                      <TableCell>{dependent.name}</TableCell>
                      <TableCell>{dependent.nic}</TableCell>
                      <TableCell>{dependent.phoneNumber}</TableCell>
                      <TableCell>{dependent.relationship}</TableCell>
                      <TableCell>
                        {new Date(dependent.dateOfBirth).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No dependents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/employee")}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewEmpDetails;
