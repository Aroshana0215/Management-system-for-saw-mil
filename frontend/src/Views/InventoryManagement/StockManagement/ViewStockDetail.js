import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { getInventoryDetailsById } from "../../../services/InventoryManagementService/StockManagementService";
import { getCategoryById } from "../../../services/PriceCardService";
import { getLdRelatedTimberById } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ForestIcon from "@mui/icons-material/Forest";

const ViewStockDetail = () => {
  const { stockId } = useParams();
  const [categoryData, setCategoryData] = useState({});
  const [cData, setcData] = useState({});
  const [timberData, setTimberData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInventoryDetailsById(stockId);
        setCategoryData(data);
        const cData = await getCategoryById(data.categoryId_fk);
        setcData(cData);
        const timberData = await getLdRelatedTimberById(data.timberId_fk);
        setTimberData(timberData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [stockId]);

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
              Stock Information
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} p={2}>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            sx={{
              bgcolor: "background.default",
              boxShadow: 1,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <InventoryIcon color="primary" fontSize="large" />
              <Typography variant="h6" color="primary">
                Stock Details
              </Typography>
            </Box>
            <Box>
              <Typography>Section Number</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {categoryData.sectionNumber}
              </Typography>
            </Box>
            <Box>
              <Typography>Amount of Pieces</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {categoryData.amountOfPieces}
              </Typography>
            </Box>
            <Box>
              <Typography>Machine Number</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {categoryData.MachineNo}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} p={2}>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            sx={{
              bgcolor: "background.default",
              boxShadow: 1,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <CategoryIcon color="primary" fontSize="large" />
              <Typography variant="h6" color="primary">
                Category Details
              </Typography>
            </Box>
            <Box>
              <Typography>Timber Type</Typography>
              <Typography variant="h4" color={"primary"}>
                {cData.timberType}
              </Typography>
            </Box>
            <Box>
              <Typography>Area Length</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.areaLength}
              </Typography>
            </Box>
            <Box>
              <Typography>Area Width</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.areaWidth}
              </Typography>
            </Box>
            <Box>
              <Typography>Min Length</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.minlength}
              </Typography>
            </Box>
            <Box>
              <Typography>Max Length</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.maxlength}
              </Typography>
            </Box>
            <Box>
              <Typography>Thickness</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.thickness}
              </Typography>
            </Box>
            <Box>
              <Typography>Unit Price</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {cData.unitPrice}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} p={2}>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            sx={{
              bgcolor: "background.default",
              boxShadow: 1,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <ForestIcon color="primary" fontSize="large" />
              <Typography variant="h6" color="primary">
                Timber Details
              </Typography>
            </Box>
            <Box>
              <Typography>Timber No</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.timberNo}
              </Typography>
            </Box>
            <Box>
              <Typography>Tree Type</Typography>
              <Typography variant="h4" color={"primary"}>
                {timberData.treeType}
              </Typography>
            </Box>
            <Box>
              <Typography>Perimeter</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.perimeter}
              </Typography>
            </Box>
            <Box>
              <Typography>Length</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.length}
              </Typography>
            </Box>
            <Box>
              <Typography>Cubic Amount</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.cubicAmount}
              </Typography>
            </Box>
            <Box>
              <Typography>Other Details</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.otherDetails}
              </Typography>
            </Box>
            <Box>
              <Typography>Unit Price</Typography>
              <Typography variant="h4" fontWeight={"bold"} color={"primary"}>
                {timberData.unitPrice}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewStockDetail;
