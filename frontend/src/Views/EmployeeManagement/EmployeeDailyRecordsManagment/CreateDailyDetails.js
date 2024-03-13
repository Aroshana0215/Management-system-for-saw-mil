import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button, RadioGroup, Radio, FormControl, FormControlLabel} from "@mui/material";
import { Link } from "react-router-dom";
import { newDailyDetail } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService"; 
import { newExpense } from "../../../services/AccountManagementService/ExpenseManagmentService";
import {newAccountSummary, updateAccountSummary , getActiveAccountSummaryDetails } from "../../../services/AccountManagementService/AccountSummaryManagmentService";


const CreateDailyDetails = () => {
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isPresent, setIsPresent] = useState(false); // Change to boolean
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [otHours, setOtHours] = useState("");
  const [advancePerDay, setAdvancePerDay] = useState("");
  const [eid_fk, setEid_fk] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
        // Combine date and time into a single value
  const combinedDateTime = new Date(selectedDateTime);
  const currentDate = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
}); 

    const formData = {
      dateTime: combinedDateTime,
      isPresent,
      inTime,
      outTime,
      otHours,
      advancePerDay,
      eid_fk,
      status: "A",
      createdBy,
      createdDate : currentDate,
      modifiedBy,
      modifiedDate,
    };

    try {
      const dailyDetailId = await newDailyDetail(formData);
      console.log("New category ID:", dailyDetailId);

      if(dailyDetailId != null){

        const saveExpData = {
          date: combinedDateTime , 
          type:  "EmployeEXP",
          des: "EmployeEXP",
          amount : advancePerDay,
          status: "A",
          createdBy:"",
          createdDate:"",
          modifiedBy:"",
          modifiedDate:"",
        };
      
        const expenseId = await newExpense(saveExpData);

        if(expenseId != null){         
          const data = await getActiveAccountSummaryDetails();
            const accountSummaryData = {
              status: "D",
            };

            const updatedAccountSummary = await updateAccountSummary(data.id, accountSummaryData)

          const newAccountSummaryData = {
            totalAmount: Number(data.totalAmount) - Number(advancePerDay),
            changedAmount: advancePerDay,
            previousAmount: data.totalAmount,
            expId_fk: expenseId,
            incId_fk: "",
            status: "A",
            createdBy:"",
            createdDate:"",
            modifiedBy:"",
            modifiedDate:"",
          };

          const AccountSummaryId = await newAccountSummary(newAccountSummaryData)
      

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
            Create Daily Record
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
          <TextField
              label="Date"
              type="date"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ mt: 2 }}
            />
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Is Present?</Typography>
              <RadioGroup row aria-label="isPresent" name="isPresent" value={isPresent.toString()} onChange={(e) => setIsPresent(e.target.value === "true")}>
                <FormControlLabel value="true" control={<Radio />} label="Present" />
                <FormControlLabel value="false" control={<Radio />} label="Absent" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="In Time"
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Out Time"
              type="time"
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="OT Hours"
              value={otHours}
              onChange={(e) => setOtHours(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Advance Per Day"
              value={advancePerDay}
              onChange={(e) => setAdvancePerDay(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="EID FK"
              value={eid_fk}
              onChange={(e) => setEid_fk(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Created By"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Modified By"
              value={modifiedBy}
              onChange={(e) => setModifiedBy(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Modified Date"
              value={modifiedDate}
              onChange={(e) => setModifiedDate(e.target.value)}
              fullWidth
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

export default CreateDailyDetails;
