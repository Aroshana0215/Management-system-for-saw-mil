import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getemployeePaySheetById } from "../../../services/EmployeeManagementService/EmployeePaySheetService";

const ViewPaymentDetails = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const data = await getemployeePaySheetById(paymentId);
        setPaymentDetails(data);
      } catch (error) {
        console.error("Error fetching payment details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!paymentDetails) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Payment details not found.
      </Typography>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Payment Details
          </Typography>
        </Grid>

        {/* Payment Summary Section */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Payment Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Employee Name:</strong> {paymentDetails.employeeName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Employee ID:</strong> {paymentDetails.eid}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>From Date:</strong> {formatDate(paymentDetails.fromDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>To Date:</strong> {formatDate(paymentDetails.toDate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Total Days:</strong> {paymentDetails.totalDay}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Total Half Days:</strong> {paymentDetails.totalHalfDay}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Total OT Hours:</strong> {paymentDetails.totalOt}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Total Advance:</strong> {paymentDetails.totalAdvance}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Reduce Amount:</strong> {paymentDetails.reduceAmount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Actual Payment:</strong> {paymentDetails.actualPayment}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Payment Status:</strong> {paymentDetails.paymentStatus}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Total Payment:</strong> {paymentDetails.totalPayment}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Details Table */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Work Details
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Date", "Is Present", "In Time", "Out Time", "OT Hours", "Advance Per Day"].map(
                      (header) => (
                        <TableCell key={header} align="center">
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentDetails.workDetails && paymentDetails.workDetails.length > 0 ? (
                    paymentDetails.workDetails.map((work, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {formatDate(work.dateTime)}
                        </TableCell>
                        <TableCell align="center">{work.isPresent.toString()}</TableCell>
                        <TableCell align="center">{work.inTime}</TableCell>
                        <TableCell align="center">{work.outTime}</TableCell>
                        <TableCell align="center">{work.otHours}</TableCell>
                        <TableCell align="center">{work.advancePerDay}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No work details found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/employee/payment-list`)}
            sx={{ borderRadius: 2 }}
          >
            Back to Payments
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewPaymentDetails;
