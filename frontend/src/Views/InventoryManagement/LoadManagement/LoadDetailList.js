import React, { useState, useEffect } from 'react';
import { getAllLoadDetails } from '../../../services/InventoryManagementService/LoadDetailsService'; // Import the API function
import { Stack, Typography } from "@mui/material";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Theme from "../../../Theme/Theme";

const LoadDetailList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllLoadDetails();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="h4" color="primary">
              Load Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/load/add"}
            >
              New Load
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "background.default",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  bgcolor: Theme.palette.primary.mainBgS1,
                }}
              >
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Seller Name</TableCell>
                  <TableCell>Permit Number</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Lorry Number</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Other Details</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Modified By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.sellerName}</TableCell>
                    <TableCell>{category.permitNumber}</TableCell>
                    <TableCell>{category.region}</TableCell>
                    <TableCell>{category.lorryNumber}</TableCell>
                    <TableCell>{category.driver}</TableCell>
                    <TableCell>{category.otherDetails}</TableCell>
                    <TableCell>{category.status}</TableCell>
                    <TableCell>{category.createdBy}</TableCell>
                    <TableCell>{category.modifiedBy}</TableCell>
                    <TableCell>
                      <Link>
                        <Button
                          variant="contained"
                          component={Link}
                          size="small"
                          to={`/load/timber/view/${category.id}`}
                        >
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default LoadDetailList;
