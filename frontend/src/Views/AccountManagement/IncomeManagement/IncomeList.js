import React, { useState, useEffect } from 'react';
import { getAllincome } from '../../../services/AccountManagementService/IncomeManagmentService'; // Import the API function
import { Stack, Typography } from "@mui/material";
import { Grid, Button } from "@mui/material";

import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";

const IncomeList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    // { field: 'date', headerName: 'Date', width: 150 },
    { field: "type", headerName: "Income Type", width: 150 },
    { field: "des", headerName: "Description", width: 180 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "BilId", headerName: "Bill Details", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: ({ row }) => (
        // TODO : change the path
        <Link to={`/load/timber/view/${row.id}`}>
          <Button variant="contained" size="small">
            View
          </Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllincome();
        console.log("Fetched data:", data); // Log fetched data to inspect its format
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
              Income Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/income/add"}
            >
              New Income
            </Button>
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

export default IncomeList;
