import React, { useState, useEffect } from 'react';
import { getAllLoadDetails } from '../../../services/InventoryManagementService/LoadDetailsService'; // Import the API function
import {
  Stack,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Seller Name
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Permit Number
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Region
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Lorry Number
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Driver
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Other Details
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Created By
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Modified By
                  </TableCell>
                  <TableCell sx={{ color: "primary.main", fontSize: "12px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableBody
              // sx={{
              //   "& > :not(:last-child)": {
              //     borderBottom: `6px solid #fff`,
              //   },
              // }}
              >
                {categories.map((category, index) => (
                  <>
                    <TableRow key={index}>
                      {" "}
                      <TableCell
                        colSpan={11}
                        sx={{
                          bgcolor: Theme.palette.primary.mainBgS1,
                          borderRadius: 2,
                          border: 0,
                        }}
                      ></TableCell>
                    </TableRow>
                    <TableRow key={index}>
                      <TableCell sx={{ color: "primary.main", border: 0 }}>
                        {category.id}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.sellerName}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.permitNumber}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.region}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.lorryNumber}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.driver}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.otherDetails}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.status}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.createdBy}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
                        {category.modifiedBy}
                      </TableCell>
                      <TableCell sx={{ border: 0 }}>
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
                  </>
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
