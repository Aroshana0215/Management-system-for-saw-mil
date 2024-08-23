import React, { useState, useEffect } from 'react';
import { getAllInventoryDetails } from '../../../services/InventoryManagementService/StockManagementService'; // Import the API function
import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";

const StockList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "inventoryId", headerName: "ID", width: 150 },
    { field: "categoryId_fk", headerName: "Category ID FK", width: 150 },
    { field: "length", headerName: "Timber Length", width: 150 },
    { field: "sectionNumber", headerName: "Section No", width: 120 },
    { field: "timberId_fk", headerName: "Timber ID FK", width: 150 },
    { field: "amountOfPieces", headerName: "Amount of Pieces", width: 160 },
    { field: "MachineNo", headerName: "Machine No", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    {
      field: "view",
      headerName: "View",
      width: 120,
      renderCell: ({ row }) => (
        <Link to={`/stock/view/${row.id}`}>
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
        const data = await getAllInventoryDetails();
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
              Stock Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/stock/add"}
            >
              New Stock
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

export default StockList;
