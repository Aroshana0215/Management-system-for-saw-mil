import React, { useState, useEffect } from 'react';
import { getAllemployeeDetails } from '../../../services/EmployeeManagementService/EmployeeDetailService';
import { Stack, Typography, InputAdornment, TextField, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";

const EmployeeList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generalQuery, setGeneralQuery] = useState("");
  
  const columns = [
    { field: "empID", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "phoneNo", headerName: "Phone No", width: 120 },
    {
      field: "currentLendAmount",
      headerName: "Lend (RS:)",
      width: 130,
      renderCell: ({ row }) => `${row.currentLendAmount}.00`,
    },
    {
      field: "otValuePerHour",
      headerName: "OT (RS:)",
      width: 130,
      renderCell: ({ row }) => `${row.otValuePerHour}.00`,
    },
    {
      field: "salaryPerDay",
      headerName: "Salary (RS:)",
      width: 130,
      renderCell: ({ row }) => `${row.salaryPerDay}.00`,
    },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      renderCell: ({ row }) => (
        <>
          <Link to={`/employee/payment/${row.id}`}>
            <Button sx={{ marginX: 1 }} variant="contained" size="small">Payment</Button>
          </Link>
          <Link to={`/employee/dependatnt/${row.id}`}>
            <Button sx={{ marginX: 1 }} variant="contained" size="small">View</Button>
          </Link>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDetails();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setCategories(data);
          setFilteredCategories(data);
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
    const lowercasedGeneralQuery = generalQuery.toLowerCase();
    const filteredData = categories.filter(category =>
      Object.values(category).some(value =>
        String(value).toLowerCase().includes(lowercasedGeneralQuery)
      )
    );
    setFilteredCategories(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [generalQuery]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
              Employee Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/employee/add"}
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
            sx={{ bgcolor: "background.default" }}
            rows={filteredCategories}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8 },
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

export default EmployeeList;
