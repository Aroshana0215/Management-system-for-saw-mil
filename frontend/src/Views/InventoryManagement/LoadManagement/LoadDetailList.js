import React, { useState, useEffect } from 'react';
import { getAllLoadDetails } from '../../../services/InventoryManagementService/LoadDetailsService'; // Import the API function
import { Stack, Typography, Grid, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";

const LoadDetailList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "loadID", headerName: "ID", width: 90 },
    { field: "sellerName", headerName: "Seller Name", width: 150 },
    { field: "permitNumber", headerName: "Permit Number", width: 150 },
    { field: "lorryNumber", headerName: "Lorry Number", width: 150 },
    { field: "driver", headerName: "Driver", width: 120 },
    { field: "otherDetails", headerName: "Other Details", width: 150 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: ({ row }) => {
        return (
          <Link to={`/load/timber/view/${row.id}`}>
            <Button variant="contained" size="small">
              View
            </Button>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllLoadDetails();
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
              Load Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/load/add"}
            >
              New Load
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

export default LoadDetailList;
