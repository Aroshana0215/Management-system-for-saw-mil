import React, { useState, useEffect } from 'react';
import { getPaysheetDetailsByEmployee } from '../../../services/EmployeeManagementService/EmployeePaySheetService';
import { Button, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";

const EPaymentList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eid } = useParams();
  const columns = [
    { field: "paySheetID", headerName: "ID", width: 90 },
    {
      field: "fromDate",
      headerName: "From Date",
      width: 150,
      renderCell: ({ row }) => formatDateOfBirth(row.fromDate),
    },
    {
      field: "toDate",
      headerName: "To Date",
      width: 150,
      renderCell: ({ row }) => formatDateOfBirth(row.toDate),
    },
    { field: "totalDay", headerName: "Total Days", width: 120 },
    { field: "totalOt", headerName: "Total Ot", width: 120 },
    { field: "reduceAmount", headerName: "Reduce Amount", width: 150 },
    { field: "paymentStatus", headerName: "Payment Status", width: 150 },
    // { field: "eid", headerName: "EID", width: 120 },
    { field: "employeeName", headerName: "Employee Name", width: 120 },
    { field: "totalPayment", headerName: "Total Payment", width: 150 },
    { field: "totalAdvance", headerName: "Total Advance", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    // { field: 'createdDate', headerName: 'Created Date', width: 150, valueGetter: (params) => formatDateOfBirth(params.value) },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
    // { field: 'modifiedDate', headerName: 'Modified Date', width: 150, valueGetter: (params) => formatDateOfBirth(params.value) },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPaysheetDetailsByEmployee(eid);
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
  }, [eid]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  const formatDateOfBirth = (dateObject) => {
    const date = new Date(dateObject.seconds * 1000);
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
              Employee Payment Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<CreditScoreIcon />}
              component={Link}
              to={`/employee/payment/add/${eid}`}
            >
              Process Payment
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

export default EPaymentList;
