import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  Avatar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getemployeeDetailsById } from "../../../services/EmployeeManagementService/EmployeeDetailService";
import CircleIcon from "@mui/icons-material/Circle";

const ViewEmpDetails = () => {
  const { eid } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const empDetails = await getemployeeDetailsById(eid);
        setEmployee(empDetails);
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
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" color="primary">
            Employee Details
          </Typography>
        </Grid>

        {/* Employee Details Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: "center", p: 3 }}>
            <Avatar
              src={employee.employeeImage}
              alt={`${employee.firstName} ${employee.lastName}`}
              sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="subtitle1" sx={{ display: "flex", alignItems: "center", justifyContent: "center", color: employee.status === "A" ? "green" : "red" }}>
              {employee.status === "A" ? "Active" : "Inactive"}
              <CircleIcon sx={{ fontSize: 10, ml: 1, color: employee.status === "A" ? "green" : "red" }} />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>NIC:</strong> {employee.nic}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Phone No:</strong> {employee.phoneNo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Address:</strong> {employee.address}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Salary Per Day:</strong> {employee.salaryPerDay}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>OT Value Per Hour:</strong> {employee.otValuePerHour}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Join Date:</strong> {new Date(employee.joinDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Created By:</strong> {employee.createdBy}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Created Date:</strong> {new Date(employee.createdDate).toLocaleDateString()}</Typography>
                </Grid>
                {employee.modifiedBy && (
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Modified By:</strong> {employee.modifiedBy}</Typography>
                  </Grid>
                )}
                {employee.modifiedDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Modified Date:</strong> {new Date(employee.modifiedDate).toLocaleDateString()}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} display="flex" justifyContent="center">
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
