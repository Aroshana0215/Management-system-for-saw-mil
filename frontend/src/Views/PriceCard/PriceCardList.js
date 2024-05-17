import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/PriceCardService'; // Import the API function
import { Grid } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../Components/Progress/Loading";
import ErrorAlert from "../../Components/Alert/ErrorAlert";

const PriceCardList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "timberType", headerName: "Timber Type", width: 120 },
    { field: "areaLength", headerName: "Length", width: 100 },
    { field: "areaWidth", headerName: "Width", width: 100 },
    { field: "minlength", headerName: "Min Length", width: 120 },
    { field: "maxlength", headerName: "Max Length", width: 120 },
    { field: "thickness", headerName: "Thickness", width: 120 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategories();
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
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Price Details
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

export default PriceCardList;
