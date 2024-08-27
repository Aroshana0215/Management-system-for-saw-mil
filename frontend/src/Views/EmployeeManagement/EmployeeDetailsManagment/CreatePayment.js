import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getEmployeeWorkedDetail } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService";
import { newPaySheet } from "../../../services/EmployeeManagementService/EmployeePaySheetService";
import {
  getemployeeDetailsById,
  updateemployeeDetails,
} from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CreatePayment = () => {
  const { eid } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [empData, setEmpData] = useState({
    name: "",
    empID: "",
    nic: "",
    address: "",
    otValuePerHour: "",
    salaryPerDay: "",
    currentLendAmount: "",
  });
  const [workDetail, setWorkDetail] = useState([]);

  const [totalPayment, setTotalPayment] = useState("");
  const [totalAdvance, setTotalAdvance] = useState("");
  const [totalDay, setTotalDay] = useState("");
  const [totalOt, setTotalOt] = useState("");
  const [totalOtAmount, setTotalOtAmount] = useState("");
  const [reduceAmount, setReduceAmount] = useState("");
  const [actualPayment, setActualPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [previous, setPrevious] = useState("");

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);

  useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const data = await getemployeeDetailsById(eid);
        setEmpData(data);
        setPrevious(data.currentLendAmount);
      } catch (error) {
        console.error("Error fetching employee data:", error.message);
      }
    };

    fetchEmpData();
  }, [eid]);

  useEffect(() => {
    const calculateActualPayment = () => {
     let total = parseFloat(totalPayment) - parseFloat(reduceAmount || 0);
     total = total - parseFloat(totalAdvance || 0);
      setActualPayment(total.toFixed(2));

      setTotalOtAmount(totalOt * empData.otValuePerHour);
    };

    calculateActualPayment();
  }, [reduceAmount, totalPayment, totalOt]);

  const handleDateChange = async (date) => {
    setToDate(date);
    if (date) {
      const formatedFromDate = new Date(fromDate);
      formatedFromDate.setHours(0, 0, 0, 0);

      const formatedToDate = new Date(date);
      formatedToDate.setHours(23, 59, 59, 999);

      try {
        const data = await getEmployeeWorkedDetail({ fromDate: formatedFromDate, toDate: formatedToDate, eid });
        setWorkDetail(data);
        calculateTotals(data);
      } catch (error) {
        console.error("Error getting work details:", error.message);
      }
    }
  };

  const calculateTotals = (data) => {
    let totOt = 0.0;
    let totDays = 0.0;
    let totAdvance = 0.0;

    data.forEach((workDetailItem) => {
      if (workDetailItem.isPresent) {
        totOt += parseFloat(workDetailItem.otHours || 0);
        totDays += 1;
        totAdvance += parseFloat(workDetailItem.advancePerDay || 0);
      }
    });

    setTotalAdvance(totAdvance.toFixed(2));
    setTotalDay(totDays);
    setTotalOt(totOt.toFixed(2));

    const totalPay = parseFloat(empData.salaryPerDay) * totDays + parseFloat(empData.otValuePerHour) * totOt;
    setTotalPayment(totalPay.toFixed(2));
  };

  const clearDateFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      totalPayment,
      totalAdvance,
      totalDay,
      totalOt,
      fromDate,
      toDate,
      currentDate: formattedDate,
      eid_fk: empData.id,
      eid: empData.empID,
      employeeName: empData.name,
      paymentStatus,
      reduceAmount,
      actualPayment,
      status: "A",
      createdBy: user.displayName,
      createdDate: formattedDate,
    };

    try {
      const paysheetId = await newPaySheet(formData);
      if (paysheetId && empData.currentLendAmount > 0 && reduceAmount > 0) {
        const updatedEmployeeData = {
          currentLendAmount: parseFloat(previous) - parseFloat(reduceAmount),
        };
        await updateemployeeDetails(eid, updatedEmployeeData);
      }
      window.location.href = `/employee/payment/${eid}`;
    } catch (error) {
      console.error("Error creating pay sheet details:", error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2} p={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Pay sheet
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              bgcolor: "background.default",
              borderRadius: 1,
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <form>
              <Stack direction="row" spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </LocalizationProvider>
                <Button variant="outlined" onClick={clearDateFilters}>
                  Clear
                </Button>
              </Stack>
            </form>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Employee", "Date", "Is Present", "In Time", "Out Time", "OT Hours", "Advance Per Day"].map((header) => (
                    <TableCell key={header} align="center">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {workDetail.map((work, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{work.eid_name}</TableCell>
                    <TableCell align="center">{formatDate(work.dateTime)}</TableCell>
                    <TableCell align="center">{work.isPresent.toString()}</TableCell>
                    <TableCell align="center">{work.inTime}</TableCell>
                    <TableCell align="center">{work.outTime}</TableCell>
                    <TableCell align="center">{work.otHours}</TableCell>
                    <TableCell align="center">{work.advancePerDay}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Payment"
                  type="number"
                  value={totalPayment}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid> 
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total OT amount"
                  type="number"
                  value={totalOtAmount}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>        
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Days"
                  type="number"
                  value={totalDay}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total OT"
                  type="number"
                  value={totalOt}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Actual Payment"
                  type="number"
                  value={actualPayment}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Advance"
                  type="number"
                  value={totalAdvance}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Reduce Amount"
                  type="number"
                  value={reduceAmount}
                  onChange={(e) => setReduceAmount(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatePayment;
