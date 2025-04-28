import React, { useState, useEffect } from "react";
import { getAllemployeeDailyDetails } from "../../../services/EmployeeManagementService/EmployeeDailyDetailService";
import { getAllActiveEmployeeDetails } from "../../../services/EmployeeManagementService/EmployeeDetailService";
import { Stack, Typography, InputAdornment, Chip, IconButton, Box, Tooltip, Select, MenuItem } from "@mui/material";
import { Grid, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaidIcon from "@mui/icons-material/Paid";
import CancelIcon from "@mui/icons-material/Cancel";

const DailyDetailList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  };

  const columns = [
    {
      field: "dateTime",
      headerName: "Date",
      width: 120,
      renderCell: ({ row }) => formatDate(new Date(row.dateTime.seconds * 1000)),
    },
    {
      field: "isPresent",
      headerName: "Present",
      width: 110,
      renderCell: ({ row }) => (
        <Chip
          label={row.isPresent ? "Present" : "Absent"}
          color={row.isPresent ? "success" : "error"}
          variant="outlined"
          sx={{ fontWeight: "bold" }}
        />
      ),
    },
    { field: "inTime", headerName: "In Time", width: 120 },
    { field: "outTime", headerName: "Out Time", width: 120 },
    { field: "otHours", headerName: "OT Hours", width: 120 },
    {
      field: "advancePerDay",
      headerName: "Advance (RS:)",
      width: 120,
      renderCell: ({ row }) => `${row.advancePerDay}.00`,
    },
    { field: "eid_name", headerName: "Employee", width: 130 },
    {
      field: "isPaid",
      headerName: "Payment Status",
      width: 150,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: "100%",
            padding: "15px 10px",
          }}
        >
          {row.isPaid ? (
            <>
              <PaidIcon color="success" fontSize="small" />
              <Typography variant="body2" sx={{ color: "green", fontWeight: "bold" }}>
                Paid
              </Typography>
            </>
          ) : (
            <>
              <CancelIcon color="error" fontSize="small" />
              <Typography variant="body2" sx={{ color: "red", fontWeight: "bold" }}>
                Not Paid
              </Typography>
            </>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => (
        <Tooltip title="View Details">
          <IconButton
            component={Link}
            to={`/employee/daily/${row.id}`}
            color="info"
            size="medium"
            sx={{
              borderRadius: "50%",
              backgroundColor: "#E3F2FD",
              "&:hover": { backgroundColor: "#BBDEFB" },
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDailyDetails();
        if (Array.isArray(data)) {
          const sortedData = data
            .sort((a, b) => a.dateTime.seconds - b.dateTime.seconds)
            .map((detail, index) => ({
              ...detail,
              id: detail.id || index,
            }));
          setDetails(sortedData);
          setFilteredDetails(sortedData);
          setLoading(false);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllActiveEmployeeDetails();
        console.log("🚀 ~ fetchEmployees ~ data:", data)
        
        if (Array.isArray(data)) {
          setEmployeeList(data);
        } else {
          throw new Error("Invalid employee data format");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = () => {
    let filteredData = details;

    if (selectedEmployee) {
      filteredData = filteredData.filter((detail) => detail.eid_name === selectedEmployee);
    }

    if (fromDate && toDate) {
      const fromDateFormatted = formatDate(fromDate);
      const toDateFormatted = formatDate(toDate);

      filteredData = filteredData.filter((detail) => {
        const detailDate = formatDate(new Date(detail.dateTime.seconds * 1000));
        return detailDate >= fromDateFormatted && detailDate <= toDateFormatted;
      });
    }

    setFilteredDetails(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedEmployee, fromDate, toDate]);

  const clearDateFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" color="primary">
              Daily Employee Details
            </Typography>
            <IconButton
              sx={{
                width: "45px",
                height: "45px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: 1,
                bgcolor: "background.paper",
                padding: "5px 15px",
              }}
            >
              <CalendarMonthIcon fontSize="medium" color="primary" />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/employee/daily/add"}
              sx={{ padding: "5px 15px", height: "45px" }}
            >
              New
            </Button>
          </Stack>
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
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(date) => setToDate(date)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <Button variant="outlined" onClick={clearDateFilters}>
                Clear
              </Button>
            </Stack>

            {/* 👇 Employee Dropdown Replacing Search Field */}
            <Select
              size="small"
              displayEmpty
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>All Employees</em>
              </MenuItem>
              {employeeList.map((emp) => (
                <MenuItem key={emp.id} value={emp.firstName}>
                  {emp.firstName}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <DataGrid
            sx={{
              bgcolor: "background.default",
              "& .MuiDataGrid-row": {
                transition: "all 0.3s",
              },
              "& .different-date": {
                marginTop: "20px",
              },
            }}
            rows={filteredDetails}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8 },
              },
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
            getRowClassName={(params) => {
              const index = filteredDetails.findIndex((row) => row.id === params.id);
              if (index > 0) {
                const currentDate = formatDate(new Date(filteredDetails[index].dateTime.seconds * 1000));
                const previousDate = formatDate(new Date(filteredDetails[index - 1].dateTime.seconds * 1000));
                if (currentDate !== previousDate) {
                  return "different-date";
                }
              }
              return "";
            }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DailyDetailList;
