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

const DailyDetailList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [generalQuery, setGeneralQuery] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "dateTime",
      headerName: "Date",
      width: 150,
      renderCell: ({ row }) => formatDate(row.dateTime),
    },
    { field: "isPresent", headerName: "IsPresent", width: 120 },
    { field: "inTime", headerName: "In Time", width: 120 },
    { field: "outTime", headerName: "Out Time", width: 120 },
    { field: "otHours", headerName: "Ot Hours", width: 120 },
    {
      field: "advancePerDay",
      headerName: "Advance (RS:)",
      width: 150,
      renderCell: ({ row }) => {
        return `${row.advancePerDay}.00`;
      },
    },
    { field: "empID", headerName: "EID", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 150,
      renderCell: ({ row }) => formatDate(row.createdDate),
    },
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
        console.log("Fetched data:", data);
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

    setFilteredDetails(filteredData);
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

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().slice(0, 10);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} p={2}>
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

        <Grid item xs={12} p={2}>
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
