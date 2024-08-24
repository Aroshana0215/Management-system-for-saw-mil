import React, { useState, useEffect } from 'react';
import { getAllbillDetails } from '../../services/BillAndOrderService/BilllManagemntService'; // Import the API function
import { Stack, Typography, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid, Button, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Loading from "../../Components/Progress/Loading";
import ErrorAlert from "../../Components/Alert/ErrorAlert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const BillDetailList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billStatusQuery, setBillStatusQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [generalQuery, setGeneralQuery] = useState("");
  const [createdDate, setCreatedDate] = useState(null);

  const columns = [
    { field: "billID", headerName: "ID", width: 140 },
    { field: "cusName", headerName: "Customer Name", width: 140 },
    { field: "cusAddress", headerName: "Customer Address", width: 240 },
    {
      field: "totalAmount",
      headerName: "Total (RS:)",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.totalAmount}.00`;
      },
    },
    {
      field: "advance",
      headerName: "Advance (RS:)",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.advance}.00`;
      },
    },
    // { field: "remainningAmount", headerName: "Balance", width: 140 },
    {
      field: "billStatus",
      headerName: "Bill Status",
      width: 140,
      renderCell: ({ value }) => {
        let color;
        switch (value) {
          case "ORDER":
            color = "red";
            break;
          case "COMPLETE":
            color = "green";
            break;
          default:
            color = "inherit";
        }
        return <span style={{ color }}>{value}</span>;
      },
    },
    { field: "createdDate", headerName: "Created Date", width: 140 },
    { field: "time", headerName: "Time", width: 140 },

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

  const formatDate = (dateObject) => {
    const date = new Date(dateObject);
    return date.toISOString().slice(0, 10); // Extracting only the date part
  };

  const formatTime = (dateObject) => {
    const date = new Date(dateObject);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Extracting only the time part
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllbillDetails();
        console.log("Fetched data:", data); // Log fetched data to inspect its format
        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            ...item,
            createdDate: formatDate(item.createdDate),
            time: formatTime(item.createdDate),
          }));
          setCategories(formattedData);
          setFilteredCategories(formattedData);
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
    let filteredData = categories;

    if (billStatusQuery) {
      const lowercasedBillStatusQuery = billStatusQuery.toLowerCase();
      filteredData = filteredData.filter((category) =>
        category.billStatus.toLowerCase().includes(lowercasedBillStatusQuery)
      );
    }

    if (generalQuery) {
      const lowercasedGeneralQuery = generalQuery.toLowerCase();
      filteredData = filteredData.filter((category) =>
        Object.values(category).some((value) =>
          String(value).toLowerCase().includes(lowercasedGeneralQuery)
        )
      );
    }

    if (createdDate) {
      filteredData = filteredData.filter((category) => {
        const categoryDate = new Date(
          category.createdDate
        ).toLocaleDateString();
        const selectedDate = createdDate.toLocaleDateString();
        return categoryDate === selectedDate;
      });
    }

    setFilteredCategories(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [generalQuery, billStatusQuery, createdDate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearDateFilter = () => {
    setCreatedDate(null);
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
            <Stack direction="row" spacing={2}>
              <TextField
                select
                size="small"
                value={billStatusQuery}
                onChange={(e) => {
                  setBillStatusQuery(e.target.value);
                }}
                label="BILL Status"
                sx={{
                  minWidth: "180px",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="ORDER">ORDER</MenuItem>
                <MenuItem value="COMPLETE">COMPLETE</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="CANCEL">CANCEL</MenuItem>
              </TextField>

              <DatePicker
                label="Created Date"
                size="small"
                value={createdDate}
                onChange={(newValue) => setCreatedDate(newValue)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <Button variant="outlined" onClick={clearDateFilter}>
                Clear
              </Button>
            </Stack>
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
            rows={filteredCategories}
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
