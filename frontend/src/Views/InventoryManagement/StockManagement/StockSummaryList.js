import React, { useState, useEffect } from 'react';
import { getAllSummaryDetails } from "../../../services/InventoryManagementService/StockSummaryManagementService"; 
import { Button, Grid, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const StockSummaryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "totalPieces", headerName: "Total Pieces", width: 120 },
    { field: "changedAmount", headerName: "Changed Amount", width: 150 },
    { field: "previousAmount", headerName: "Previous Amount", width: 160 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "billId_fk", headerName: "Bill ID FK", width: 120 },
    { field: "stk_id_fk", headerName: "Stock ID FK", width: 120 },
    { field: "categoryId_fk", headerName: "Category ID FK", width: 150 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSummaryDetails();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h5" color="primary">
              Stock Summary
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
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StockSummaryList;
