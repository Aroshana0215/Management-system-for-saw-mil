import React, { useState, useEffect  } from "react";
import { Container, Grid, Typography, TextField, Button, RadioGroup, Radio, FormControl, FormControlLabel} from "@mui/material";
import { Link } from "react-router-dom";
import { newDailyDetail } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService"; 
import { newExpense } from "../../../services/AccountManagementService/ExpenseManagmentService";
import {newAccountSummary, updateAccountSummary , getActiveAccountSummaryDetails } from "../../../services/AccountManagementService/AccountSummaryManagmentService";
import { getAllemployeeDetails ,getemployeeDetailsById} from "../../../services/EmployeeManagementService/EmployeeDetailService";
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
        setDetails(employeesList.map(employee => ({
          employeeId: employee.id,
          selectedDateTime: commonDate, // Initialize with commonDate
          isPresent: false,
          inTime: "",
          outTime: "",
          otHours: "",
          advancePerDay: "",
        })));
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    };

    fetchEmployees();
  }, [commonDate]);

  useEffect(() => {
    // Set commonDate to the current date when the component mounts
    const today = new Date().toISOString().split('T')[0];
    setCommonDate(today);
  }, []);

  const calculateOTHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "";

    const inDateTime = new Date(`1970-01-01T${inTime}`);
    const outDateTime = new Date(`1970-01-01T${outTime}`);

    // Calculate total working hours
    const totalWorkingMinutes = (outDateTime - inDateTime) / (1000 * 60); // Convert ms to minutes
    const totalWorkingHours = totalWorkingMinutes / 60; // Convert minutes to hours

    // Calculate OT hours
    const standardWorkingMinutes = 8 * 60; // 8 hours in minutes
    const otMinutes = totalWorkingMinutes > standardWorkingMinutes ? totalWorkingMinutes - standardWorkingMinutes : 0;

    // Format hours and minutes
    const otHours = Math.floor(otMinutes / 60); // Hours part
    const otMinutesPart = Math.round(otMinutes % 60); // Minutes part

    return `${otHours}.${otMinutesPart.toString().padStart(2, '0')}`; // Format as "hours.minutes"
  };

  const handleChange = (index, field) => (event) => {
    const value = field === "isPresent" ? event.target.value === "true" : event.target.value;
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;

    if (field === "inTime" || field === "outTime") {
      const inTime = updatedDetails[index].inTime;
      const outTime = updatedDetails[index].outTime;
      updatedDetails[index].otHours = calculateOTHours(inTime, outTime);
    }

    setDetails(updatedDetails);
  };

  const handleCommonDateChange = (event) => {
    const newDate = event.target.value;
    setCommonDate(newDate);
    const updatedDetails = details.map(detail => ({
      ...detail,
      selectedDateTime: newDate,
    }));
    setDetails(updatedDetails);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      for (const detail of details) {

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
          // createdBy: user.displayName,
          createdDate: currentDate,
        };

        const dailyDetailId = await newDailyDetail(formData);
        console.log("New daily detail ID:", dailyDetailId);

        if (dailyDetailId) {
          const saveExpData = {
            date: combinedDateTime,
            type: "EmployeEXP",
            des: "EmployeEXP",
            amount: detail.advancePerDay,
            status: "A",
            // createdBy: user.displayName,
            createdDate: currentDate,
          };

          const expenseId = await newExpense(saveExpData);

          if (expenseId) {
            const data = await getActiveAccountSummaryDetails();
            const accountSummaryData = {
              status: "D",
            };
            if(data){
              await updateAccountSummary(data.id, accountSummaryData);

              const newAccountSummaryData = {
                totalAmount: Number(data.totalAmount) - Number(detail.advancePerDay),
                changedAmount: detail.advancePerDay,
                previousAmount: data.totalAmount,
                expId_fk: expenseId,
                incId_fk: "",
                status: "A",
                // createdBy: user.displayName,
                createdDate: currentDate,
              };
  
              await newAccountSummary(newAccountSummaryData);
            }else{

              const newAccountSummaryData = {
                totalAmount: Number(detail.advancePerDay),
                changedAmount: Number(detail.advancePerDay),
                previousAmount: 0,
                expId_fk: "",
                incId_fk: "",
                status: "A",
                // createdBy: user.displayName,
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
      // Handle error
    }
  };

  return (
    <Container>
      <Grid container direction="column" alignItems="center" spacing={2} p={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Create Daily Record
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Common Date"
            type="date"
            value={commonDate}
            onChange={handleCommonDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {employees.map((employee, index) => (
                <Grid item xs={12} key={employee.id}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                     {employee.name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="In Time"
                        type="time"
                        value={details[index].inTime}
                        onChange={handleChange(index, "inTime")}
                        disabled={!details[index].isPresent}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Out Time"
                        type="time"
                        value={details[index].outTime}
                        onChange={handleChange(index, "outTime")}
                        disabled={!details[index].isPresent}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="OT Hours"
                        value={details[index].otHours}
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Advance Per Day"
                        value={details[index].advancePerDay}
                        onChange={handleChange(index, "advancePerDay")}
                        disabled={!details[index].isPresent}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl component="fieldset" fullWidth>
                        <Typography variant="subtitle1"></Typography>
                        <RadioGroup
                          row
                          aria-label="isPresent"
                          name={`isPresent-${employee.id}`}
                          value={details[index].isPresent.toString()}
                          onChange={handleChange(index, "isPresent")}
                        >
                          <FormControlLabel value="true" control={<Radio />} label="Present" />
                          <FormControlLabel value="false" control={<Radio />} label="Absent" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
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

export default CreateDailyDetails;