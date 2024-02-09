import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { getLoadDetailsById } from "../../../services/InventoryManagementService/LoadDetailsService";
import { getLdRelatedTimberByLoadId } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";
import { Link } from "react-router-dom";

const UpdateCategory = () => {
  const { loadId } = useParams();
  const [categories, setCategories] = useState([]);
  const [totalTimberValue, setTotalTimberValue] = useState(0);
  const [totalCubicValue, setTotalCubicValue] = useState(0);
  const [categoryData, setCategoryData] = useState({
    sellerName: "",
    permitNumber: "",
    lorryNumber: "",
    driver: "",
    otherDetails: "",
    status: "",
    createdBy: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLoadDetailsById(loadId);
        setCategoryData(data);
        const loadData = await getLdRelatedTimberByLoadId(loadId);
        if (Array.isArray(loadData)) {
          setCategories(loadData);
          // Calculate total timber value
          const totalValue = loadData.reduce((acc, curr) => acc + parseFloat(curr.totalTimerValue || 0), 0);
          setTotalTimberValue(totalValue.toFixed(2));
          const totalCValue = loadData.reduce((acc, curr) => acc + parseFloat(curr.cubicAmount || 0), 0);
          setTotalCubicValue(totalCValue.toFixed(2));
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [loadId]);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Load Details and related Timber details
          </Typography>
        </Grid>
        <Grid item xs={12}>
        <form>
            <TextField
              fullWidth
              label="Seller Name"
              variant="outlined"
              value={categoryData.sellerName}
              onChange={(e) => setCategoryData({ ...categoryData, sellerName: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Permit Number"
              variant="outlined"
              value={categoryData.permitNumber}
              onChange={(e) => setCategoryData({ ...categoryData, permitNumber: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Lorry Number"
              variant="outlined"
              value={categoryData.lorryNumber}
              onChange={(e) => setCategoryData({ ...categoryData, lorryNumber: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Driver"
              variant="outlined"
              value={categoryData.driver}
              onChange={(e) => setCategoryData({ ...categoryData, driver: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Other Details"
              variant="outlined"
              value={categoryData.otherDetails}
              onChange={(e) => setCategoryData({ ...categoryData, otherDetails: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Status"
              variant="outlined"
              value={categoryData.status}
              onChange={(e) => setCategoryData({ ...categoryData, status: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Created By"
              variant="outlined"
              value={categoryData.createdBy}
              onChange={(e) => setCategoryData({ ...categoryData, createdBy: e.target.value })}
              sx={{ mt: 2 }}
            />


          </form>
        </Grid>
        <Grid item xs={12}>
          <Link to={`/load/timber/add/${loadId}`}>
            <button>Add Timber</button>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
              <TableRow>
                  <TableCell>Timber No</TableCell>
                  <TableCell>Tree Type</TableCell>
                  <TableCell>Perimeter</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>Cubic Amount</TableCell>
                  <TableCell>Other Details</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total Timer Value</TableCell>
                  <TableCell>Total Cutting Value</TableCell>
                  <TableCell>Out Come Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Modified By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category.timberNo}</TableCell>
                    <TableCell>{category.treeType}</TableCell>
                    <TableCell>{category.perimeter}</TableCell>
                    <TableCell>{category.length}</TableCell>
                    <TableCell>{category.cubicAmount}</TableCell>
                    <TableCell>{category.otherDetails}</TableCell>
                    <TableCell>{category.unitPrice}</TableCell>
                    <TableCell>{category.totalTimerValue}</TableCell>
                    <TableCell>{category.totalCuttingValue}</TableCell>
                    <TableCell>{category.outComeValue}</TableCell>
                    <TableCell>{category.status}</TableCell>
                    <TableCell>{category.createdBy}</TableCell>
                    <TableCell>{category.modifiedBy}</TableCell>
                    <Link to={"/load"}>
                      <button>Wood Pieces</button>
                    </Link>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={7}><strong>Total Value:</strong></TableCell>
                  <TableCell><strong>{totalTimberValue}</strong></TableCell>      
                  <TableCell colSpan={5}></TableCell>
                  <TableCell><strong>{totalCubicValue}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateCategory;
