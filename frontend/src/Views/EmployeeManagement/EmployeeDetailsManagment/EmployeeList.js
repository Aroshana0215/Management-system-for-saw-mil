import React, { useState, useEffect } from 'react';
import { getAllemployeeDetails } from '../../../services/EmployeeManagementService/EmployeeDetailService';
import { Stack,Typography } from "@mui/material";
import { Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";

const EmployeeList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "address", headerName: "Address", width: 180 },
    { field: "nic", headerName: "NIC", width: 120 },
    {
      field: "dateOfBirth",
      headerName: "BOD",
      width: 120,
      renderCell: ({ row }) => formatDateOfBirth(row.dateOfBirth),
    },
    { field: "currentLendAmount", headerName: "Lend Amount", width: 140 },
    { field: "otValuePerHour", headerName: "OT Value", width: 120 },
    { field: "salaryPerDay", headerName: "Salary", width: 120 },
    {
      field: "joinDate",
      headerName: "Join Date",
      width: 150,
      renderCell: ({ row }) => formatDateOfBirth(row.joinDate),
    },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      renderCell: ({ row }) => (
        <>
          <Link to={`/employee/payment/${row.id}`}>
            <Button sx={{ marginX: 1 }} variant="contained" size="small">
              Payment
            </Button>
          </Link>
          {/* TODO : Change the path */}
          <Link to={`/employee/dependatnt/${row.id}`}>
            <Button sx={{ marginX: 1 }} variant="contained" size="small">
              View
            </Button>
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const formatDateOfBirth = (dateObject) => {
    const date = new Date(dateObject.seconds * 1000);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Employee Details
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} p={2}>
          <DataGrid
            sx={{
              bgcolor: "background.default",
            }}
            rows={categories}
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

export default EmployeeList;
