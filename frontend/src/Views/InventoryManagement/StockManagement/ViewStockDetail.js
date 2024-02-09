import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";
import { getInventoryDetailsById} from "../../../services/InventoryManagementService/StockManagementService"; 
import { getCategoryById } from "../../../services/PriceCardService"; 
import { getLdRelatedTimberById } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";

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
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
        p={2}
      >
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            View Stock Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* Category Data Fields */}
          <Typography variant="h6" color="primary">
            Category Data Fields
          </Typography>
          <Typography>
            Section Number: {categoryData.sectionNumber}
          </Typography>
          <Typography>
            Amount of Pieces: {categoryData.amountOfPieces}
          </Typography>
          <Typography>
            Machine Number: {categoryData.MachineNo}
          </Typography>

          {/* C Data Fields */}
          <Typography variant="h6" color="primary">
            C Data Fields
          </Typography>
          <Typography>
            Timber Type: {cData.timberType}
          </Typography>
          <Typography>
            Area Length: {cData.areaLength}
          </Typography>
          <Typography>
            Area Width: {cData.areaWidth}
          </Typography>
          <Typography>
            Minimum Length: {cData.minlength}
          </Typography>
          <Typography>
            Maximum Length: {cData.maxlength}
          </Typography>
          <Typography>
            Thickness: {cData.thickness}
          </Typography>
          <Typography>
            Unit Price: {cData.unitPrice}
          </Typography>

          {/* Timber Data Fields */}
          <Typography variant="h6" color="primary">
            Timber Data Fields
          </Typography>
          <Typography>
            Timber No: {timberData.timberNo}
          </Typography>
          <Typography>
            Tree Type: {timberData.treeType}
          </Typography>
          <Typography>
            Perimeter: {timberData.perimeter}
          </Typography>
          <Typography>
            Length: {timberData.length}
          </Typography>
          <Typography>
            Cubic Amount: {timberData.cubicAmount}
          </Typography>
          <Typography>
            Other Details: {timberData.otherDetails}
          </Typography>
          <Typography>
            Unit Price: {timberData.unitPrice}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewStockDetail;
