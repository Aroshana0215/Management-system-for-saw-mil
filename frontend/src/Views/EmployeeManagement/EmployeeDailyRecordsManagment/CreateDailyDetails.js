import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { newDailyDetail } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService";
import { newExpense } from "../../../services/AccountManagementService/ExpenseManagmentService";
import {
  newAccountSummary,
  updateAccountSummary,
  getActiveAccountSummaryDetails,
} from "../../../services/AccountManagementService/AccountSummaryManagmentService";
import { getAllemployeeDetails, getemployeeDetailsById } from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { useSelector } from "react-redux";

const CreateDailyDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [details, setDetails] = useState([]);
  const [commonDate, setCommonDate] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesList = await getAllemployeeDetails();
        setEmployees(employeesList);
        setDetails(
          employeesList.map((employee) => ({
            employeeId: employee.id,
            selectedDateTime: commonDate,
            isPresent: false,
            inTime: "",
            outTime: "",
            otHours: "",
            advancePerDay: "",
          }))
        );
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };
    fetchEmployees();
  }, [commonDate]);

  useEffect(() => {
    setCommonDate(new Date().toISOString().split("T")[0]);
  }, []);

  const calculateOTHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "";

    const inDateTime = new Date(`1970-01-01T${inTime}`);
    const outDateTime = new Date(`1970-01-01T${outTime}`);
    const totalWorkingMinutes = (outDateTime - inDateTime) / (1000 * 60);
    const standardWorkingMinutes = 9 * 60;
    const otMinutes = totalWorkingMinutes > standardWorkingMinutes ? totalWorkingMinutes - standardWorkingMinutes : 0;

    const otHours = Math.floor(otMinutes / 60);
    const otMinutesPart = Math.round(otMinutes % 60);

    return `${otHours}.${otMinutesPart.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, field) => (event) => {
    const value = field === "isPresent" ? event.target.checked : event.target.value;
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;

    if (field === "inTime" || field === "outTime") {
      updatedDetails[index].otHours = calculateOTHours(updatedDetails[index].inTime, updatedDetails[index].outTime);
    }
    setDetails(updatedDetails);
  };

  const handleCommonDateChange = (event) => {
    const newDate = event.target.value;
    setCommonDate(newDate);
    setDetails(details.map((detail) => ({ ...detail, selectedDateTime: newDate })));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const detail of details) {
        if (!detail.isPresent) continue;

        const employee = await getemployeeDetailsById(detail.employeeId);
        const combinedDateTime = new Date(detail.selectedDateTime);
        const currentDate = new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short",
        });

        const formData = {
          dateTime: combinedDateTime,
          isPresent: detail.isPresent,
          inTime: detail.inTime,
          outTime: detail.outTime,
          otHours: detail.otHours,
          advancePerDay: detail.advancePerDay,
          eid_fk: detail.employeeId,
          eid_name: employee.name,
          status: "A",
          createdDate: currentDate,
        };

        const dailyDetailId = await newDailyDetail(formData);

        if (dailyDetailId) {
          const saveExpData = {
            date: combinedDateTime,
            type: "Employee",
            des: "Employee daily Advance",
            amount: detail.advancePerDay,
            status: "A",
            createdBy: user.displayName,
            createdDate: currentDate,
          };

          const expenseId = await newExpense(saveExpData);

          if (expenseId) {
            const data = await getActiveAccountSummaryDetails();
            const accountSummaryData = {
              status: "D",
            };

            if (data) {
              await updateAccountSummary(data.id, accountSummaryData);

              const newAccountSummaryData = {
                totalAmount: Number(data.totalAmount) - Number(detail.advancePerDay),
                changedAmount: detail.advancePerDay,
                previousAmount: data.totalAmount,
                expId_fk: expenseId,
                status: "A",
                createdDate: currentDate,
              };

              await newAccountSummary(newAccountSummaryData);
            } else {
              const newAccountSummaryData = {
                totalAmount: Number(detail.advancePerDay),
                changedAmount: Number(detail.advancePerDay),
                previousAmount: 0,
                expId_fk: "",
                status: "A",
                createdDate: currentDate,
              };

              await newAccountSummary(newAccountSummaryData);
            }
          }
        }
      }
      window.location.href = "/employee/daily";
    } catch (error) {
      console.error("Error creating Daily Details:", error.message);
    }
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="stretch">
      <Grid item xs={12}>
        <Grid container component="form" onSubmit={handleSubmit} padding={2} sx={{ bgcolor: "background.default", borderRadius: 2 }}>
          <Grid item xs={12} padding={1}>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
              <Typography variant="h6" color="primary" align="center">Create Daily Record</Typography>
            </Stack>
          </Grid>
          <Grid container direction="column" alignItems="center" spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField
                label="Common Date"
                type="date"
                value={commonDate}
                onChange={handleCommonDateChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ mb: 2 }}
                size="small"
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee Name</TableCell>
                      <TableCell>In Time</TableCell>
                      <TableCell>Out Time</TableCell>
                      <TableCell>OT Hours</TableCell>
                      <TableCell>Advance Per Day</TableCell>
                      <TableCell>Present</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee, index) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            type="time"
                            value={details[index].inTime}
                            onChange={handleChange(index, "inTime")}
                            disabled={!details[index].isPresent}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            type="time"
                            value={details[index].outTime}
                            onChange={handleChange(index, "outTime")}
                            disabled={!details[index].isPresent}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={details[index].otHours}
                            onChange={handleChange(index, "otHours")}
                            disabled
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            value={details[index].advancePerDay}
                            onChange={handleChange(index, "advancePerDay")}
                            disabled={!details[index].isPresent}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={<Switch checked={details[index].isPresent} onChange={handleChange(index, "isPresent")} />}
                            label={details[index].isPresent ? "Present" : "Absent"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Create</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CreateDailyDetails;
