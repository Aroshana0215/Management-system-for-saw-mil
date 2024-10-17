import React, { useState, useEffect } from 'react';
import { getAllemployeeDailyDetails } from '../../../services/EmployeeManagementService/EmployeeDailyDetailService';
import { Stack, Typography, InputAdornment } from "@mui/material";
import { Grid, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DailyDetailList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [generalQuery, setGeneralQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const columns = [
    {
      field: "dateTime",
      headerName: "Date",
      width: 150,
      renderCell: ({ row }) => formatDate(new Date(row.dateTime.seconds * 1000)),
    },
    { field: "isPresent", headerName: "Is Present", width: 120 },
    { field: "inTime", headerName: "In Time", width: 120 },
    { field: "outTime", headerName: "Out Time", width: 120 },
    { field: "otHours", headerName: "OT Hours", width: 120 },
    {
      field: "advancePerDay",
      headerName: "Advance (RS:)",
      width: 150,
      renderCell: ({ row }) => `${row.advancePerDay}.00`,
    },
    { field: "eid_name", headerName: "Employee Name", width: 100 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: ({ row }) => (
        <Link to={`/employee/daily/${row.id}`}>
          <Button sx={{ marginX: 1 }} variant="contained" size="small">
            Update
          </Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDailyDetails();
        if (Array.isArray(data)) {
          setDetails(data);
          setFilteredDetails(data);
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

  const handleSearch = () => {
    let filteredData = details;

    if (generalQuery) {
      const lowercasedGeneralQuery = generalQuery.toLowerCase();
      filteredData = filteredData.filter((detail) =>
        Object.values(detail).some((value) =>
          String(value).toLowerCase().includes(lowercasedGeneralQuery)
        )
      );
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

  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // Apply the timezone offset
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
  };

  useEffect(() => {
    handleSearch();
  }, [generalQuery, fromDate, toDate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearDateFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} p={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Daily Employee Details
            </Typography>
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

        <Grid item xs={12} p={1}>
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
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      size="small"
                    />
                  )}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      size="small"
                    />
                  )}
                />
              <Button variant="outlined" onClick={clearDateFilters}>
                Clear
              </Button>
            </Stack>
            <TextField
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search All Fields"
              variant="outlined"
              value={generalQuery}
              onChange={(e) => setGeneralQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} p={1}>
          <DataGrid
            sx={{
              bgcolor: "background.default",
            }}
            rows={filteredDetails}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DailyDetailList;
