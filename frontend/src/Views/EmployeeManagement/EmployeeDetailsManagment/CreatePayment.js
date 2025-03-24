import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  IconButton,
  Collapse,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip ,
  CircularProgress
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getEmployeeWorkedDetail, updateDailyDetailsAsPaid } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService";
import { newPaySheet , getLatestToDateByEmployee} from "../../../services/EmployeeManagementService/EmployeePaySheetService";
import {
  getemployeeDetailsById,
  updateemployeeDetails,
} from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
  const [totalFullDaySal, setTotalFullDaySal] = useState("");
  const [salaryPerHalfDay, setSalaryPerHalfDay] = useState("");
  const [otPerHour, setOtPerHour] = useState("");
  const [totalHalfDaySal, setTotalHalfDaySal] = useState("");
  const [totalAdvance, setTotalAdvance] = useState("");
  const [salaryPerDay, setSalaryPerDay] = useState("");
  const [totalDay, setTotalDay] = useState("");
  const [totalHalfDay, setTotalHalfDay] = useState("");
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
  const [isExpanded, setIsExpanded] = useState(false); // Expand/Collapse State
  const [loading, setLoading] = useState(false);

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
      setTotalPayment((parseFloat(totalHalfDaySal) + parseFloat(totalFullDaySal) + parseFloat(totalOtAmount)).toFixed(2));
     let total = parseFloat(totalPayment) - parseFloat(reduceAmount || 0);
     total = parseFloat(total) - parseFloat(totalAdvance || 0);
  
      setActualPayment(total.toFixed(2));
    };

    calculateActualPayment();
  }, [reduceAmount, totalAdvance, totalOtAmount , totalFullDaySal , totalHalfDaySal, toDate]);

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
    let totHalfDays = 0.0;
    let totAdvance = 0.0;
  
    console.log("data:", data);
  
    data.forEach((workDetailItem) => {
      if (workDetailItem.isPresent) {
        console.log("otHours:", workDetailItem.otHours);
  
        // Calculate OT hours (converting string like 'HH.mm' to hours and minutes)
        let [hours, minutes] = (workDetailItem.otHours || '0').split('.').map(Number);
        hours = hours || 0;
        minutes = minutes || 0;
  
        // Convert minutes to fraction of an hour
        let totalHours = hours + (minutes / 60);
  
        // Add to totOt
        totOt += totalHours;
  
        // Parse inTime and outTime from HH:mm format to minutes since midnight
        const [inHours, inMinutes] = workDetailItem.inTime.split(':').map(Number);
        const [outHours, outMinutes] = workDetailItem.outTime.split(':').map(Number);
  
        // Convert time to minutes from midnight for easy comparison
        const inTimeMinutes = inHours * 60 + inMinutes;
        const outTimeMinutes = outHours * 60 + outMinutes;
  
        // Calculate total work time in hours
        const workedMinutes = outTimeMinutes - inTimeMinutes;
        const workedHours = workedMinutes / 60;
  
        // Determine day fraction based on worked hours (if less than 9 hours, consider half day)
        if (workedHours < 9) {
          totHalfDays += 1;
        } else {
          totDays += 1;
        }

        
  
        // Add to total advance
        totAdvance += parseFloat(workDetailItem.advancePerDay || 0);
      }
    });
  
    // Update the state with totals
    setTotalAdvance(totAdvance.toFixed(2));
    setTotalHalfDay(totHalfDays.toFixed(2));
    setTotalDay(totDays.toFixed(2));
    setSalaryPerDay(parseFloat(empData.salaryPerDay).toFixed(2));
  
    console.log("empData.salaryPerDay:", empData.salaryPerDay);
    console.log("totDays:", totDays);
    console.log("empData.otValuePerHour:", empData.otValuePerHour);
    console.log("totOt:", totOt);
  
    // Calculate total payment
    const totalPay = parseFloat(empData.salaryPerDay) * totDays ;
    setTotalFullDaySal(totalPay.toFixed(2));

    const totalHafDayPay = parseFloat(empData.salaryPerDay)/2 * totHalfDays ;
    setTotalHalfDaySal(totalHafDayPay.toFixed(2));
    const HalfDayPay = parseFloat(empData.salaryPerDay)/2;
    setSalaryPerHalfDay(HalfDayPay.toFixed(2));

    setTotalOt(totOt.toFixed(2));
    setOtPerHour(empData.otValuePerHour);
    setTotalOtAmount((totOt.toFixed(2) * empData.otValuePerHour).toFixed(2));

  };
  
  

  const clearDateFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    // Validation for totalPayment
    if (parseFloat(totalPayment) <= 0) {
      toast.error("Total OT Amount must be greater than 0.");
      return;
    }

    // Validation for toDate (Empty Check)
    if (!toDate) {
      toast.error("Please select a valid 'To Date' before submitting.");
      return;
    }

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
      employeeName: empData.firstName,
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

      if(paysheetId){
      const stringResulty = updateDailyDetailsAsPaid(formData);
        toast.success(`${stringResulty}`);
        setTimeout(() => {
          setLoading(false);
          window.location.href = `/employee/payment/${eid}`;
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating pay sheet details:", error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  console.log("empData.id",eid);
  useEffect(() => {
    const fetchLatestToDate = async () => {
      try {
        console.log("eid:", eid);
        if (eid) {
          const latestToDate = await getLatestToDateByEmployee(eid);
  
          let newFromDate;
          if (latestToDate) {
            newFromDate = new Date(latestToDate.seconds * 1000);
            console.log("newFromDate :", newFromDate);
            newFromDate.setDate(newFromDate.getDate() + 1);
          }else
          {
            newFromDate = formatDate(fromDate);
          }
  
          console.log("newFromDate (after increment):", newFromDate);
          setFromDate(newFromDate);
        }
      } catch (error) {
        console.error("Error fetching latest toDate:", error.message);
      }
    };
  
    fetchLatestToDate();
  }, [eid]);
  
  

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
                    shouldDisableDate={(date) => fromDate && date < fromDate} // Disable dates before latest date
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} size="small" />}
                    shouldDisableDate={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Normalize today's date
                      return  date > today;
                    }}
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
      {/* Expand/Collapse Work Detail Table */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
          <Typography variant="h6" color="primary">Employee Work Details</Typography>
          <IconButton>{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
        </Stack>

        <Collapse in={isExpanded}>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Employee</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Is Present</TableCell>
                <TableCell align="center">In Time</TableCell>
                <TableCell align="center">Out Time</TableCell>
                <TableCell align="center">OT Hours</TableCell>
                <TableCell align="center">Advance Per Day</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workDetail.map((work, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{work.eid_name}</TableCell>
                  <TableCell align="center">{new Date(work.dateTime.seconds * 1000).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={work.isPresent ? "Present" : "Absent"}
                      color={work.isPresent ? "success" : "error"}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell align="center">{work.inTime}</TableCell>
                  <TableCell align="center">{work.outTime}</TableCell>
                  <TableCell align="center">{work.otHours}</TableCell>
                  <TableCell align="center">{work.advancePerDay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapse>
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
            <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField
                  label="Total Days"
                  type="number"
                  value={totalDay}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Salary Per Day"
                  type="number"
                  value={salaryPerDay}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Payment for days"
                  type="number"
                  value={totalFullDaySal}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid> 
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Total Half Days"
                  type="number"
                  value={totalHalfDay}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                </Grid>   
                <Grid item xs={12} sm={4}>
                <TextField
                  label="Salary Per Half Day"
                  type="number"
                  value={salaryPerHalfDay}
                  InputProps={{ readOnly: true }}
                  fullWidth
                /> 
                </Grid>     
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Total HalfDay Salary"
                  type="number"
                  value={totalHalfDaySal}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Total OT"
                  type="number"
                  value={totalOt}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Ot per Hour"
                  type="number"
                  value={otPerHour}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Total Ot salary"
                  type="number"
                  value={totalOtAmount}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
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
                <TextField
                  label="Actual Payment"
                  type="number"
                  value={actualPayment}
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
              <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? <CircularProgress size={24} /> : "Submit"}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatePayment;