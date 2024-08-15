import React, { useState, useEffect } from 'react';
import { getAllActiveStockDetails } from "../../../services/InventoryManagementService/StockSummaryManagementService"; 
import { getCategoryById, getAllCategories, getCategoryIdBytimberType } from "../../../services/PriceCardService";
import { getInventoryDetailsById } from "../../../services/InventoryManagementService/StockManagementService";
import { getbillDetailsById } from "../../../services/BillAndOrderService/BilllManagemntService"; 
import { Grid, Stack, Typography, Button,  TextField, MenuItem,InputAdornment } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loading from "../../../Components/Progress/Loading";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";

const ActiveStockList = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timberTypeQuery, setTimberTypeQuery] = useState("");
  const [timberNatuerQuery, setTimberNatuerQuery] = useState("");
  const [dimensionsQuery, setDimensionsQuery] = useState("");
  const [categoryIdQuery, setCategoryIdQuery] = useState("");
  const [generalQuery, setGeneralQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState([]);
  const [dimensionOptions, setDimensionOptions] = useState([]);

  const columns = [
    { field: "categoryId", headerName: "Category ID", width: 150 },
    {
      field: "lengthRange",
      headerName: "Length Range",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.minlength} - ${row.maxlength}`;
      },
    },
    { field: "timberType", headerName: "Type", width: 120 },
    { field: "timberNature", headerName: "Nature", width: 150 },
    {
      field: "dimensions",
      headerName: "Dimensions",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.areaLength} x ${row.areaWidth}`;
      },
    },
    { field: "length", headerName: "Length", width: 150 },
    {
      field: "totalPieces",
      headerName: "Total Pieces",
      width: 120,
      renderCell: ({ value }) => {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </div>
        );
      },
    },
    { field: "createdBy", headerName: "Created By", width: 120 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        let summaryData = await getAllActiveStockDetails();
        console.log("summaryData:",summaryData);

        if (Array.isArray(summaryData) && summaryData.length > 0) {
          for (let index = 0; index < summaryData.length; index++) {
            if (summaryData[index].categoryId_fk) {
              console.log("summaryData[index].categoryId_fk:",summaryData[index].categoryId_fk);
              const categoryData = await getCategoryById(summaryData[index].categoryId_fk);
              console.log("categoryData:",categoryData);
              summaryData[index].categoryId = categoryData?.categoryId || '';
              summaryData[index].areaLength = categoryData?.areaLength || '';
              summaryData[index].areaWidth = categoryData?.areaWidth || '';
              summaryData[index].minlength = categoryData?.minlength || '';
              summaryData[index].maxlength = categoryData?.maxlength || '';
              summaryData[index].timberNature = categoryData?.timberNature || '';
              summaryData[index].timberType = categoryData?.timberType || '';
            }
            if (summaryData[index].billId_fk) {
              const billData = await getbillDetailsById(summaryData[index].billId_fk);
              summaryData[index].billID = billData?.billID || ''; 
            }
            if (summaryData[index].stk_id_fk) {
              const stockData = await getInventoryDetailsById(summaryData[index].stk_id_fk);
              summaryData[index].stockData = stockData; // Add stock data
            }
          }
        }

        if (Array.isArray(summaryData)) {
          setSummaryData(summaryData);
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


  const updateDimensionOptions = (nature) => {
    if (nature === "Planks") {
      setDimensionOptions([
        "0.3 x 5",
        "0.6 x 5",
        "0.9 x 5",
        "0 x 0"
      ]);
    } else if (nature === "Lumber&beam") {
      setDimensionOptions([
        "2 x 2",
        "2 x 4",
        "2 x 5",
        "2 x 6",
        "3 x 2",
        "3 x 4"
      ]);
    } else {
      setDimensionOptions([]);
    }
  };


  const handleSearch = () => {
    let filteredData = summaryData;

    if (timberTypeQuery) {
      const lowercasedTimberTypeQuery = timberTypeQuery.toLowerCase();
      filteredData = filteredData.filter((category) =>
        category.timberType.toLowerCase().includes(lowercasedTimberTypeQuery)
      );
    }


    if (timberNatuerQuery) {
      const lowercasedTimberNatuerQuery = timberNatuerQuery.toLowerCase();
      console.log("timberNatuerQuery:", timberNatuerQuery);
      updateDimensionOptions(timberNatuerQuery);
      filteredData = filteredData.filter((category) =>
        category.timberNature.toLowerCase().includes(lowercasedTimberNatuerQuery)
      );
    }


    if (dimensionsQuery) {
      const lowercasedDimensionsQuery = dimensionsQuery.toLowerCase();
      console.log("lowercasedDimensionsQuery:", lowercasedDimensionsQuery);

      const [queryLength, queryWidth] = lowercasedDimensionsQuery.split('x').map(part => part.trim());

      filteredData = filteredData.filter((category) =>
      category.areaLength.toString().toLowerCase().includes(queryLength) &&
      category.areaWidth.toString().toLowerCase().includes(queryWidth)
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

    setFilteredCategories(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(timberTypeQuery){
          console.log("In categoryIdQuery:", categoryIdQuery);
          let filteredCategoryData = await getCategoryIdBytimberType(timberTypeQuery);
          setFilteredCategoryId(filteredCategoryData);
        }else{
          let filteredCategoryData = await getAllCategories();
          if(filteredCategoryData){
            setFilteredCategoryId(filteredCategoryData);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [timberTypeQuery, filteredCategories]);

  useEffect(() => {
    handleSearch();
  }, [generalQuery, timberTypeQuery, timberNatuerQuery, dimensionsQuery]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Stock Summary
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/stock"}
              sx={{ padding: "5px 15px", height: "45px", marginLeft: "auto"  }}
            >
              New
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} p={2}>
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
                        <Stack direction="row" spacing={2}>
            <TextField
              select
              size="small"
              value={timberTypeQuery}
              onChange={(e) => setTimberTypeQuery(e.target.value)}
              label="Timber Type"
              sx={{
                minWidth: "180px",
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Sapu">Sapu</MenuItem>
              <MenuItem value="Grandis">Grandis</MenuItem>
              <MenuItem value="Thekka">Thekka</MenuItem>
              <MenuItem value="Micro">Micro</MenuItem>
              <MenuItem value="Amba">Amba</MenuItem>
              <MenuItem value="Kos">Kos</MenuItem>
              <MenuItem value="Maara">Maara</MenuItem>
              <MenuItem value="LunuMidella">LunuMidella</MenuItem>
            </TextField>

            <TextField
                select
                size="small"
                value={timberNatuerQuery}
                onChange={(e) => {
                  setTimberNatuerQuery(e.target.value);
                  updateDimensionOptions(e.target.value);
                }}
                label="Timber Nature"
                sx={{
                  minWidth: "180px",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Lumber&beam">Lumber&beam</MenuItem>
                <MenuItem value="Planks">Planks</MenuItem>
                <MenuItem value="Dust">Dust</MenuItem>
              </TextField>

            <TextField
              select
              size="small"
              value={dimensionsQuery}
              onChange={(e) => setDimensionsQuery(e.target.value)}
              label="Dimensions"
              sx={{
                minWidth: "180px",
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="2 x 2">2 x 2</MenuItem>
              <MenuItem value="2 x 4">2 x 4</MenuItem>
              <MenuItem value="2 x 5">2 x 5</MenuItem>
              <MenuItem value="2 x 6">2 x 6</MenuItem>
              <MenuItem value="3 x 2">3 x 2</MenuItem>
              <MenuItem value="3 x 4">3 x 4</MenuItem>
              
              <MenuItem value="0.3 x 5">0.3 x 5</MenuItem>
              <MenuItem value="0.6 x 5">0.6 x 5</MenuItem>
              <MenuItem value="0.9 x 5">0.9 x 5</MenuItem>

              <MenuItem value="0 x 0">0 x 0</MenuItem>
            </TextField>
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
            rows={filteredCategories.length === 0 ? summaryData : filteredCategories}
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

export default ActiveStockList;
