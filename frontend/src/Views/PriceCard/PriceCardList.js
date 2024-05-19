import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/PriceCardService'; // Import the API function
import { Stack, Typography, Grid, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../Components/Progress/Loading";
import ErrorAlert from "../../Components/Alert/ErrorAlert";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const PriceCardList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timberTypeQuery, setTimberTypeQuery] = useState('');
  const [generalQuery, setGeneralQuery] = useState('');

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
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
          setFilteredCategories(data);
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

    if (timberTypeQuery) {
      const lowercasedTimberTypeQuery = timberTypeQuery.toLowerCase();
      filteredData = filteredData.filter((category) =>
        category.timberType.toLowerCase().includes(lowercasedTimberTypeQuery)
      );
    }

    if (generalQuery) {
      const lowercasedGeneralQuery = generalQuery.toLowerCase();
      filteredData = filteredData.filter((category) =>
        Object.values(category).some(value =>
          String(value).toLowerCase().includes(lowercasedGeneralQuery)
        )
      );
    }

    setFilteredCategories(filteredData);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Price Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/price/add"}
            >
              New 
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="right"
            justifyContent="flex-start"
          >
            <TextField
              label="Search by Timber Type"
              variant="outlined"
              value={timberTypeQuery}
              onChange={(e) => setTimberTypeQuery(e.target.value)}
              sx={{ maxWidth: '270px', height: '45px', padding: '5px 0' }}
              InputProps={{ sx: { height: '45px' } }}
            />
            <TextField
              label="Search All Fields"
              variant="outlined"
              value={generalQuery}
              onChange={(e) => setGeneralQuery(e.target.value)}
              sx={{ maxWidth: '270px', height: '45px' ,padding: '5px 0'}}
              InputProps={{ sx: { height: '45px' } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ padding: '5px 15px', height: '45px'}}
            >
              Search
            </Button>
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

export default PriceCardList;
