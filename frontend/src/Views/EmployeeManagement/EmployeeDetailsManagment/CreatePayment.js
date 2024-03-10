import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { getEmployeeWorkedDetail } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService"; 
import { newPaySheet } from "../../../services/EmployeeManagementService/EmployeePaySheetService"; 
import { getemployeeDetailsById, updateemployeeDetails } from "../../../services/EmployeeManagementService/EmployeeDetailService"; 
import { useParams } from "react-router-dom";



const CreatePayment = () => {
  const [totalPayment, setTotalPayment] = useState("");
  const [totalAdvance, setTotalAdvance] = useState("");
  const [totalDay, setTotalDay] = useState("");
  const [totalOt, setTotalOt] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [reduceAmount, setReduceAmount] = useState("");
  const [actualPayment, setActualPayment] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [previous , setPrevios] = useState("");
  const [workDetail, setWorkDetail] = useState([]);
  const [empData, setEmpData] = useState({
    name: "",
    nic: "",
    address:"",
    otValuePerHour:"",
    salaryPerDay:"",
    currentLendAmount:"",
  });

  const { eid } = useParams(); // Get categoryId from URL params

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDate = new Date();
    const formatedFromDate = new Date(fromDate);
    const formatedToDate = new Date(toDate);
    const formData = {
        totalPayment, 
        totalAdvance,
        totalDay,
        totalOt,
        fromDate : formatedFromDate,
        toDate : formatedToDate,
        currentDate: currentDate.toISOString(),
        // dateRangeLendAmount : ,
        eid_fk : eid,
        paymentStatus,
        reduceAmount, 
        actualPayment,  
        status : "A",
        createdBy,
        createdDate,
        modifiedBy,
        modifiedDate,
    };
    

    try {
      const paysheetId = await newPaySheet(formData);
      if(paysheetId != null){

        if(empData.currentLendAmount > 0.00){
          if(reduceAmount > 0.00){

            const employeeData = {
              currentLendAmount: parseFloat(previous) - parseFloat(reduceAmount)
            };

            const paysheetId = await updateemployeeDetails(eid, employeeData);
          }
        }

      }
      console.log("New category ID:", paysheetId);

      // window.location.href = `/employee/payment/${eid}`;
    } catch (error) {
      console.error("Error creating pay sheet details:", error.message);
      // Handle error
    }
  };


  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return ""; // Handle case where timestamp is undefined or has no seconds property
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };



    const calculateTotalPayment = () => {
        try {
            let totPayment = 0.00;
            let empSalaryTotDate = 0.00;
            let valueForTotalOt = 0.00;

                empSalaryTotDate = parseFloat(empData.salaryPerDay) * totalDay;
                valueForTotalOt = totalOt * parseFloat(empData.otValuePerHour);
                totPayment = parseFloat(empSalaryTotDate) + parseFloat(valueForTotalOt);
            

            console.log('In:',empData.salaryPerDay);
            setTotalPayment(totPayment.toFixed(2));
        } catch (error) {
            console.log('Error Calculating Total Payment:', error);
        }
    };




  const calculate = (data) => {
    if (data && data.length > 0) { 
        let totOt = 0.00;
        let totDays = 0.00;
        let totAdvance = 0.00;

        
        data.forEach(workDetailItem => {

            if(workDetailItem.isPresent == true){
                if (workDetailItem.otHours != null) {
                    totOt += parseFloat(workDetailItem.otHours); 
                }
                
                if (workDetailItem.isPresent) {
                    totDays++;
                }
                
                if (workDetailItem.advancePerDay != null) {
                    totAdvance += parseFloat(workDetailItem.advancePerDay); 
                }
            }
            
        });

        setTotalAdvance(totAdvance.toFixed(2)); 
        setTotalDay(totDays);
        setTotalOt(totOt.toFixed(2));
        calculateTotalPayment();   

        return true; 
    }

    return false; 
};


useEffect(() => {
  const calcActualAmont = async () => {
    try {
      let totActual = 0.00;

          totActual = parseFloat(totalPayment) - parseFloat(reduceAmount);
      

      console.log('totActual:',totActual);
      setActualPayment(totActual.toFixed(2));
  } catch (error) {
      console.log('Error Calculating Total Actual Payment:', error);
  }
}

  calcActualAmont();
}, [reduceAmount, totalPayment]);


useEffect(() => {
    const fetchEmpData = async () => {
      try {
        const data = await getemployeeDetailsById(eid);
        console.log('fetchEmpData data:', data);
        setEmpData(data);
        setPrevios(data.currentLendAmount);
      } catch (error) {

        console.log('Invalid data format received from API');
      }
    };

    fetchEmpData();
  }, [eid]);



  const handleSearch = async (event) => {
    event.preventDefault();
    const formatedFromDate = new Date(fromDate);
    const formatedToDate = new Date(toDate);
    const formData = {
         fromDate : formatedFromDate,
         toDate : formatedToDate,
         eid : eid
    };   

    try {
      const data = await getEmployeeWorkedDetail(formData);
      if(data != null){
        if (Array.isArray(data)) {
            setWorkDetail(data);
            calculate(data);
          } else {
            throw new Error('Invalid data format received from API');
          }

      }
      console.log("New category ID:", data);
    } catch (error) {
      console.error("Error getting work Details:", error.message);
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
            search Dates
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSearch}>    
          <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ mt: 2 }}
            />
             <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Search
            </Button>
          </form>
        </Grid>
      </Grid>




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
            Pay sheet
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="actualPayment"
              variant="outlined"
              value={actualPayment}
              onChange={(e) => setActualPayment(e.target.value)}
              sx={{ mt: 2 }}
            />
             <TextField
              fullWidth
              label="totalPayment"
              variant="outlined"
              value={totalPayment}
              onChange={(e) => setTotalPayment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="totalAdvance"
              variant="outlined"
              readOnly 
              value={totalAdvance}
              onChange={(e) => setTotalAdvance(e.target.value)}
              InputProps={{ readOnly: true }} 
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Total Days"
              variant="outlined"
              value={totalDay}
              onChange={(e) => setTotalDay(e.target.value)}
              InputProps={{ readOnly: true }} 
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Total Ot"
              variant="outlined"
              value={totalOt}
              onChange={(e) => setTotalOt(e.target.value)}
              InputProps={{ readOnly: true }} 
              sx={{ mt: 2 }}
            />
                        <TextField
              fullWidth
              label="reduceAmount"
              variant="outlined"
              value={reduceAmount}
              onChange={(e) => setReduceAmount(e.target.value)}
              sx={{ mt: 2 }}
            />
                        <TextField
              fullWidth
              label="Previos Lend Amount"
              variant="outlined"
              value={previous}
              onChange={(e) => setPrevios(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="paymentStatus"
              variant="outlined"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
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

      <div style={{ padding: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', borderRadius: '8px' }}>
        <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th >ID</th>
            <th >Date</th>
            <th>IsPresent</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Ot Hours</th>
            <th>Advance Per Day</th>
            <th>EID</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Modified by</th>
            <th>Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {workDetail.map((work, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.id}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(work.dateTime)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.isPresent.toString()}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.inTime}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.outTime}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.otHours}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.advancePerDay}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.eid_fk}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.status}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.createdBy}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(work.createdDate)}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{work.modifiedBy}</td>
              <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDate(work.modifiedDate)}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </Container>
  );
};

export default CreatePayment;
