import React, { useState, useEffect } from 'react';
import { getAllexpense } from '../../../services/AccountManagementService/ExpenseManagmentService'; // Import the API function
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

const ExpList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllexpense();
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
              Expense Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineOutlinedIcon />}
              component={Link}
              to={"/exp/add"}
            >
              New Income
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
                  {/* <TableCell>Date</TableCell> */}
                  <TableCell>Expense Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
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
                    {/* <TableCell>{category.date}</TableCell> */}
                    <TableCell>{category.type}</TableCell>
                    <TableCell>{category.des}</TableCell>
                    <TableCell>{category.amount}</TableCell>
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

export default ExpList;
