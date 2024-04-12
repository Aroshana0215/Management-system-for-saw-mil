import React, { useState, useEffect } from 'react';
import { getAllemployeeDetails } from '../../../services/EmployeeManagementService/EmployeeDetailService';
import { Stack,Typography } from "@mui/material";
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
import Theme from "../../../Theme/Theme";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";


const EmployeeList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllemployeeDetails();
        console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setCategories(data);
          setLoading(false);
        } else {
          throw new Error('Invalid data format received from API');
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

  const formatDateOfBirth = (dateObject) => {
    const date = new Date(dateObject.seconds * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

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
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>NIC</TableCell>
                <TableCell>BOD</TableCell>
                <TableCell>Lend Amount</TableCell>
                <TableCell>Ot value</TableCell>
                <TableCell>Salaray</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>created By</TableCell>
                <TableCell>modified By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.address}</TableCell>
                  <TableCell>{category.nic}</TableCell>
                  <TableCell>{formatDateOfBirth(category.dateOfBirth)}</TableCell>
                  <TableCell>{category.currentLendAmount}</TableCell>
                  <TableCell>{category.otValuePerHour}</TableCell>
                  <TableCell>{category.salaryPerDay}</TableCell>
                  <TableCell>{formatDateOfBirth(category.joinDate)}</TableCell>
                  <TableCell>{category.status}</TableCell>
                  <TableCell>{category.createdBy}</TableCell>
                  <TableCell>{category.modifiedBy}</TableCell>
                  <TableCell>
                    <Link>
                      <Button
                        variant="contained"
                        component={Link}
                        size="small"
                        to={`/employee/payment/${category.id}`}
                      >
                        Payment
                      </Button>
                    </Link>
                    </TableCell>
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

export default EmployeeList;
