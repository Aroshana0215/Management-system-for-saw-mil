import React, { useState, useEffect } from 'react';
import { getAllbillDetails } from '../../services/BillAndOrderService/BilllManagemntService'; // Import the API function
import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../Components/Progress/Loading";
import ErrorAlert from "../../Components/Alert/ErrorAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const BillDetailList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    { field: "billID", headerName: "ID", width: 140 },
    { field: "cusName", headerName: "Customer Name", width: 140 },
    { field: "cusAddress", headerName: "Customer Address", width: 240 },
    { field: "totalAmount", headerName: "Total", width: 140 },
    { field: "advance", headerName: "Advance", width: 140 },
    { field: "remainningAmount", headerName: "Remaining Amount", width: 140 },
    { field: "billStatus", headerName: "Bill Status", width: 140 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Link to={`/bill/view/${params.row.id}`}>
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
        const data = await getAllbillDetails();
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
              Bill & Order Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/bill/wants/wood"}
            >
              ADD
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

export default BillDetailList;
