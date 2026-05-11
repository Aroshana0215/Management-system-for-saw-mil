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
  Chip,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  getEmployeeWorkedDetailNotpaid,
  updateDailyDetailsAsPaid,
} from "../../../services/EmployeeManagementService/EmployeeDailyDetailService";
import {
  newPaySheet,
  getLatestToDateByEmployee,
} from "../../../services/EmployeeManagementService/EmployeePaySheetService";
import {
  getemployeeDetailsById,
  updateemployeeDetails,
} from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { newExpense } from "../../../services/AccountManagementService/ExpenseManagmentService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#007aff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  item: {
    width: "33%",
    marginBottom: 10,
    paddingRight: 8,
  },
  label: {
    fontSize: 8,
    color: "#666",
  },
  value: {
    fontSize: 10,
    marginTop: 2,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
  },
  tableCell: {
    width: "12.5%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    fontSize: 7,
    textAlign: "center",
  },
  noDataCell: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    fontSize: 8,
    textAlign: "center",
  },
});

const CreatePayment = () => {
  const { eid } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [empData, setEmpData] = useState({
    name: "",
    empID: "",
    nic: "",
    address: "",
    holidayRate: "",
    otValuePerHour: "",
    salaryPerDay: "",
    salaryPerMonth: "",
    currentLendAmount: "",
    isMonthPayEmp: false,
  });

  const getSafeFileName = () => {
  const employeeName =
    empData?.firstName || empData?.name || empData?.empID;

  const safeEmployeeName = String(employeeName)
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "");

  return `tempPay-${safeEmployeeName}_${formatFileDate(
    fromDate
  )}-${formatFileDate(toDate)}.pdf`;
};

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
  const [reduceAmount, setReduceAmount] = useState("0");
  const [actualPayment, setActualPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [previous, setPrevious] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [paymentStatusError, setPaymentStatusError] = useState("");

  const [workingHolidayAmount, setWorkingHolidayAmount] = useState("0");
  const [holidayTotal, setHolidayTotal] = useState("0.00");

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);

  const hasDaySalary = (emp) => {
    const value = emp?.salaryPerDay;
    return value !== null && value !== undefined && String(value).trim() !== "";
  };

  const hasMonthSalary = (emp) => {
    const value = emp?.salaryPerMonth;
    return value !== null && value !== undefined && String(value).trim() !== "";
  };

  const getSalaryMode = (emp) => {
    if (hasDaySalary(emp)) return "DAY";
    if (hasMonthSalary(emp)) return "MONTH";
    return "NONE";
  };

  const getWorkType = (work) => {
    if (!work?.isPresent) return "-";
    if (!work?.inTime || !work?.outTime) return "-";

    const inMins = work.inTime.split(":").reduce((h, m) => h * 60 + +m);
    const outMins = work.outTime.split(":").reduce((h, m) => h * 60 + +m);

    if (!Number.isFinite(inMins) || !Number.isFinite(outMins)) return "-";
    if (outMins <= inMins) return "-";

    const workedHours = (outMins - inMins) / 60;

    return workedHours < 9 ? "Half Day" : "Full Day";
  };

  const showHolidayFields =
    !hasDaySalary(empData) ||
    empData?.salaryPerDay == null ||
    empData?.salaryPerDay <= 0 ||
    empData?.salaryPerDay == undefined ||
    String(empData?.salaryPerDay).trim() === "";

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
    if (!showHolidayFields) {
      setWorkingHolidayAmount("0");
      setHolidayTotal("0.00");
      return;
    }

    const amount = parseFloat(workingHolidayAmount || 0);
    const rate = parseFloat(empData?.holidayRate || 0);
    const total = amount * rate;

    setHolidayTotal((Number.isFinite(total) ? total : 0).toFixed(2));
  }, [workingHolidayAmount, empData?.holidayRate, showHolidayFields]);

  useEffect(() => {
    const calculateActualPayment = () => {
      const payment =
        parseFloat(totalHalfDaySal || 0) +
        parseFloat(totalFullDaySal || 0) +
        parseFloat(totalOtAmount || 0);

      setTotalPayment(payment.toFixed(2));

      const total =
        payment -
        (parseFloat(reduceAmount || 0) + parseFloat(totalAdvance || 0)) +
        parseFloat(holidayTotal || 0);

      setActualPayment(total.toFixed(2));
    };

    calculateActualPayment();
  }, [
    reduceAmount,
    totalAdvance,
    totalOtAmount,
    totalFullDaySal,
    totalHalfDaySal,
    toDate,
    holidayTotal,
  ]);

  const calculateTotals = (data) => {
    const salaryMode = getSalaryMode(empData);

    let totOt = 0.0;
    let totDays = 0.0;
    let totHalfDays = 0.0;
    let totAdvance = 0.0;

    data.forEach((item) => {
      if (item.isPresent) {
        let [hours, minutes] = (item.otHours || "0").split(".").map(Number);
        const ot = (hours || 0) + (minutes || 0) / 60;
        totOt += ot;

        const inMins = item.inTime.split(":").reduce((h, m) => h * 60 + +m);
        const outMins = item.outTime.split(":").reduce((h, m) => h * 60 + +m);

        const workedHours = (outMins - inMins) / 60;

        if (workedHours < 9) {
          totHalfDays++;
        } else {
          totDays++;
        }
      }

      totAdvance += parseFloat(item.advancePerDay || 0);
    });

    setTotalAdvance(totAdvance.toFixed(2));
    setTotalHalfDay(totHalfDays.toFixed(2));
    setTotalDay(totDays.toFixed(2));

    setTotalOt(totOt.toFixed(2));
    setOtPerHour(empData.otValuePerHour);
    setTotalOtAmount(
      (totOt * parseFloat(empData.otValuePerHour || 0)).toFixed(2)
    );

    if (salaryMode === "MONTH") {
      const monthly = parseFloat(empData.salaryPerMonth || 0);

      setSalaryPerDay("");
      setSalaryPerHalfDay("");
      setTotalHalfDaySal("0.00");
      setTotalFullDaySal(monthly.toFixed(2));
      return;
    }

    const daySalary = parseFloat(empData.salaryPerDay || 0);
    setSalaryPerDay(daySalary.toFixed(2));

    const fullDayPay = daySalary * totDays;
    const halfDayPay = (daySalary / 2) * totHalfDays;

    setTotalFullDaySal(fullDayPay.toFixed(2));
    setTotalHalfDaySal(halfDayPay.toFixed(2));
    setSalaryPerHalfDay((daySalary / 2).toFixed(2));
  };

  const handleDateChange = async (date) => {
    setToDate(date);

    if (date) {
      const formatedFromDate = new Date(fromDate);
      formatedFromDate.setHours(0, 0, 0, 0);

      const formatedToDate = new Date(date);
      formatedToDate.setHours(23, 59, 59, 999);

      try {
        const data = await getEmployeeWorkedDetailNotpaid({
          fromDate: formatedFromDate,
          toDate: formatedToDate,
          eid,
        });

        setWorkDetail(data || []);
        calculateTotals(data || []);
      } catch (error) {
        console.error("Error getting work details:", error.message);
      }
    }
  };

  const clearDateFilters = () => {
    setFromDate(null);
    setToDate(null);
    setWorkDetail([]);

    setTotalPayment("");
    setTotalFullDaySal("");
    setSalaryPerHalfDay("");
    setOtPerHour("");
    setTotalHalfDaySal("");
    setTotalAdvance("");
    setSalaryPerDay("");
    setTotalDay("");
    setTotalHalfDay("");
    setTotalOt("");
    setTotalOtAmount("");
    setReduceAmount("0");
    setActualPayment("");
  };

  const validateBeforeSubmit = () => {
    if (!paymentStatus || String(paymentStatus).trim() === "") {
      setPaymentStatusError("Payment Status is required");
      toast.error("Please select Payment Status");
      return false;
    }

    setPaymentStatusError("");

    if (showHolidayFields && parseFloat(workingHolidayAmount || 0) < 0) {
      toast.error("Working Holiday Amount cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateBeforeSubmit()) return;

    setLoading(true);

    if (parseFloat(totalPayment) <= 0) {
      toast.error("Total Payment must be greater than 0.");
      setLoading(false);
      return;
    }

    if (!toDate) {
      toast.error("Please select a valid 'To Date' before submitting.");
      setLoading(false);
      return;
    }

    const formData = {
      totalPayment,
      totalAdvance,
      totalDay,
      totalHalfDay,
      totalOt,
      fromDate,
      toDate,
      currentDate: formattedDate,
      eid_fk: empData.id,
      eid: empData.empID,
      employeeName: empData.firstName,
      holidayRate: empData.holidayRate,
      workingHolidayAmount: showHolidayFields ? workingHolidayAmount : "0",
      holidayTotal: showHolidayFields ? holidayTotal : "0.00",
      paymentStatus,
      reduceAmount,
      actualPayment,
      status: "A",
      createdBy: user?.displayName || user?.email || user?.uid || "System",
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

      if (paysheetId) {
        const stringResulty = await updateDailyDetailsAsPaid(formData);

        if (stringResulty) {
          const expData = {
            date: formattedDate,
            type: "Salaray",
            des: "Employee Salaray",
            amount: actualPayment,
            status: "A",
            createdBy: user?.displayName || user?.email || user?.uid || "System",
            createdDate: formattedDate,
          };

          const ExpensesId = await newExpense(expData);
          console.log("New Expenses ID:", ExpensesId);

          if (ExpensesId) {
            toast.success(`${stringResulty}`);

            setTimeout(() => {
              setLoading(false);
              window.location.href = `/employee/payment/${eid}`;
            }, 1000);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error occurred during payment submission.");
      console.error("Error creating pay sheet details:", error.message);
    }
  };

  useEffect(() => {
    const fetchLatestToDate = async () => {
      try {
        if (eid) {
          const latestToDate = await getLatestToDateByEmployee(eid);

          let newFromDate = latestToDate
            ? new Date(latestToDate.seconds * 1000)
            : new Date();

          if (latestToDate) {
            newFromDate.setDate(newFromDate.getDate() + 1);
          }

          setFromDate(newFromDate);
        }
      } catch (error) {
        console.error("Error fetching latest toDate:", error.message);
      }
    };

    fetchLatestToDate();
  }, [eid]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    if (dateValue?.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileDate = (dateValue) => {
    if (!dateValue) return "N-A";

    const parsedDate = dateValue?.seconds
      ? new Date(dateValue.seconds * 1000)
      : new Date(dateValue);

    return parsedDate.toISOString().split("T")[0];
  };

  const canExportPdf = !!toDate && workDetail && workDetail.length > 0;

  const MyDocument = () => {
    const summaryData = [
      { label: "Employee Name", value: empData?.firstName || empData?.name },
      { label: "Employee ID", value: empData?.empID },
      { label: "From Date", value: formatDate(fromDate) },
      { label: "To Date", value: formatDate(toDate) },
      { label: "Salary Mode", value: salaryMode },
      { label: "Total Working Days", value: totalDay },
      { label: "Total Half Days", value: totalHalfDay },
      { label: "Salary Per Day", value: salaryPerDay },
      { label: "Salary Per Half Day", value: salaryPerHalfDay },
      { label: "Full Day Salary", value: totalFullDaySal },
      { label: "Half Day Salary", value: totalHalfDaySal },
      { label: "Total OT Hours", value: totalOt },
      { label: "Rate Per OT Hour", value: otPerHour },
      { label: "OT Amount", value: totalOtAmount },
      { label: "Total Advance", value: totalAdvance },
      { label: "Reduce Amount", value: reduceAmount },
      // { label: "Working Holiday Amount", value: workingHolidayAmount },
      // { label: "Holiday Total", value: holidayTotal },
      { label: "Total Payment", value: totalPayment },
      { label: "Actual Payment", value: actualPayment },
      { label: "Payment Status", value: paymentStatus || "-" },
    ];

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <Text style={pdfStyles.title}>Pay Sheet Details</Text>

          <Text style={pdfStyles.sectionTitle}>Payment Summary</Text>

          <View style={pdfStyles.grid}>
            {summaryData.map((item, index) => (
              <View key={index} style={pdfStyles.item}>
                <Text style={pdfStyles.label}>{item.label}</Text>
                <Text style={pdfStyles.value}>
                  {item.value || item.value === 0 ? String(item.value) : "-"}
                </Text>
              </View>
            ))}
          </View>

          <Text style={pdfStyles.sectionTitle}>Employee Work Details</Text>

          <View style={pdfStyles.table}>
            <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
              <Text style={pdfStyles.tableCell}>Employee</Text>
              <Text style={pdfStyles.tableCell}>Date</Text>
              <Text style={pdfStyles.tableCell}>Present</Text>
              <Text style={pdfStyles.tableCell}>Type</Text>
              <Text style={pdfStyles.tableCell}>In Time</Text>
              <Text style={pdfStyles.tableCell}>Out Time</Text>
              <Text style={pdfStyles.tableCell}>OT Hours</Text>
              <Text style={pdfStyles.tableCell}>Advance</Text>
            </View>

            {workDetail && workDetail.length > 0 ? (
              workDetail.map((work, index) => (
                <View key={index} style={pdfStyles.tableRow}>
                  <Text style={pdfStyles.tableCell}>
                    {work.eid_name || "-"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {formatDate(work.dateTime)}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.isPresent ? "Present" : "Absent"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.isPresent ? getWorkType(work) : "-"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.inTime || "-"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.outTime || "-"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.otHours || work.otHours === 0
                      ? String(work.otHours)
                      : "-"}
                  </Text>

                  <Text style={pdfStyles.tableCell}>
                    {work.advancePerDay || work.advancePerDay === 0
                      ? String(work.advancePerDay)
                      : "-"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={pdfStyles.tableRow}>
                <Text style={pdfStyles.noDataCell}>
                  No work details found.
                </Text>
              </View>
            )}
          </View>
        </Page>
      </Document>
    );
  };

  const salaryMode = getSalaryMode(empData);

  return (
    <Container>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Pay Sheet
          </Typography>
        </Grid>

        {/* Date Filters */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              rowGap={2}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
                rowGap={2}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(date) => {
                      setFromDate(date);
                      setToDate(null);
                      setWorkDetail([]);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />

                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                    shouldDisableDate={(date) => fromDate && date < fromDate}
                  />
                </LocalizationProvider>

                <Button variant="outlined" onClick={clearDateFilters}>
                  Clear
                </Button>
              </Stack>

              {canExportPdf ? (
                <PDFDownloadLink
                  document={<MyDocument />}
                  fileName={getSafeFileName()}
                  style={{ textDecoration: "none" }}
                >
                  {({ loading }) => (
                    <Button variant="contained" disabled={loading}>
                      {loading ? "Loading PDF..." : "Export to PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button variant="contained" disabled>
                  Export to PDF
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Expand/Collapse Work Detail Table */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="h6" color="primary">
                Employee Work Details
              </Typography>

              <IconButton>
                {isExpanded ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Stack>

            <Collapse in={isExpanded}>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Employee</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Is Present</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">In Time</TableCell>
                    <TableCell align="center">Out Time</TableCell>
                    <TableCell align="center">OT Hours</TableCell>
                    <TableCell align="center">Advance Per Day</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {workDetail && workDetail.length > 0 ? (
                    workDetail.map((work, index) => {
                      const type = getWorkType(work);
                      const isFull = type === "Full Day";

                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {work.eid_name}
                          </TableCell>

                          <TableCell align="center">
                            {formatDate(work.dateTime)}
                          </TableCell>

                          <TableCell align="center">
                            <Chip
                              label={work.isPresent ? "Present" : "Absent"}
                              color={work.isPresent ? "success" : "error"}
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell align="center">
                            {work.isPresent ? (
                              <Chip
                                label={type}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontWeight: "bold",
                                  borderColor: isFull ? "#66BB6A" : "#FFB74D",
                                  color: isFull ? "#1B5E20" : "#E65100",
                                  backgroundColor: isFull
                                    ? "#C8E6C9"
                                    : "#FFE0B2",
                                }}
                              />
                            ) : (
                              "-"
                            )}
                          </TableCell>

                          <TableCell align="center">{work.inTime}</TableCell>

                          <TableCell align="center">{work.outTime}</TableCell>

                          <TableCell align="center">{work.otHours}</TableCell>

                          <TableCell align="center">
                            {work.advancePerDay}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No work details found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Collapse>
          </Paper>
        </Grid>

        {/* Final Form Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🧾 Payment Summary
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    📅 Attendance & Salary Info
                  </Typography>
                </Grid>

                {salaryMode === "DAY" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Total Working Days"
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
                        label="Full Day Salary"
                        type="number"
                        value={totalFullDaySal}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Half Working Days"
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
                        label="Half Day Salary"
                        type="number"
                        value={totalHalfDaySal}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {salaryMode === "MONTH" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Salary Per Month"
                        type="number"
                        value={String(empData?.salaryPerMonth ?? "")}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Monthly Salary (Full)"
                        type="number"
                        value={totalFullDaySal}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {showHolidayFields && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        🏖️ Working Holidays
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Working Holiday Amount"
                        type="number"
                        value={workingHolidayAmount}
                        onChange={(e) =>
                          setWorkingHolidayAmount(e.target.value)
                        }
                        fullWidth
                        helperText="Default is 0"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={`Holiday Total (Rate: ${
                          empData?.holidayRate || 0
                        })`}
                        type="number"
                        value={holidayTotal}
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    ⏱️ Overtime Calculation
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Total OT Hours"
                    type="number"
                    value={totalOt}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Rate per OT Hour"
                    type="number"
                    value={otPerHour}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="OT Amount"
                    type="number"
                    value={totalOtAmount}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    💸 Advance & Deductions
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Advance Taken"
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
                    helperText="Loan or deduction amount to subtract"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    ✅ Final Payment
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Payment (Before Deduction)"
                    type="number"
                    value={totalPayment}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Actual Payment to Employee"
                    type="number"
                    value={actualPayment}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    InputLabelProps={{
                      style: { fontWeight: "bold", color: "#2e7d32" },
                    }}
                    sx={{ bgcolor: "#f1f8e9" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!paymentStatusError}>
                    <InputLabel>Payment Status</InputLabel>

                    <Select
                      value={paymentStatus}
                      onChange={(e) => {
                        setPaymentStatus(e.target.value);

                        if (e.target.value) {
                          setPaymentStatusError("");
                        }
                      }}
                      label="Payment Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>

                    {paymentStatusError && (
                      <FormHelperText>{paymentStatusError}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={loading}
                    fullWidth
                    size="large"
                  >
                    {loading ? <CircularProgress size={24} /> : "Submit Payment"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatePayment;