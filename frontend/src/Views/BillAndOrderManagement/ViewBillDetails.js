import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { getbillDetailsById } from "../../services/BillAndOrderService/BilllManagemntService";
import { getorderIdByBillId } from "../../services/BillAndOrderService/OrderManagmentService";
import { Link } from "react-router-dom";

const ViewBillDetails = () => {
  const { billId } = useParams();
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [totalTimberValue, setTotalTimberValue] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalCubicValue, setTotalCubicValue] = useState(0);
  const [categoryData, setCategoryData] = useState({
    dateAndTime: "",
    cusName: "",
    cusAddress: "",
    cusNIC: "",
    cusPhoneNumber: "",
    totalAmount: "",
    advance: "",
    remainningAmount: "",
    PromizeDate: "",
    description: "",
    billStatus: "",
    totalIncome: "",
    incomeAsPercentage: "",
    unloadedDate: "",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getbillDetailsById(billId);
        setCategoryData(data);
        const loadData = await getorderIdByBillId(billId);
        if (Array.isArray(loadData)) {
          setCategories(loadData);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [billId]);

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
              label="dateAndTime"
              variant="outlined"
              value={categoryData.dateAndTime}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  dateAndTime: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="cusName"
              variant="outlined"
              value={categoryData.cusName}
              onChange={(e) =>
                setCategoryData({ ...categoryData, cusName: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="cusAddress"
              variant="outlined"
              value={categoryData.cusAddress}
              onChange={(e) =>
                setCategoryData({ ...categoryData, cusAddress: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="cusNIC"
              variant="outlined"
              value={categoryData.cusNIC}
              onChange={(e) =>
                setCategoryData({ ...categoryData, cusNIC: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            {/* <TextField
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
            /> */}
          </form>
        </Grid>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>availablePiecesAmount</TableCell>
                  <TableCell>neededPiecesAmount</TableCell>
                  <TableCell>remainPiecesAmount</TableCell>
                  <TableCell>discountPrice</TableCell>
                  <TableCell>bill_id_fk</TableCell>
                  <TableCell>catergoryId_fk</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Modified By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category.availablePiecesAmount}</TableCell>
                    <TableCell>{category.neededPiecesAmount}</TableCell>
                    <TableCell>{category.remainPiecesAmount}</TableCell>
                    <TableCell>{category.discountPrice}</TableCell>
                    <TableCell>{category.bill_id_fk}</TableCell>
                    <TableCell>{category.catergoryId_fk}</TableCell>
                    <TableCell>{category.status}</TableCell>
                    <TableCell>{category.createdBy}</TableCell>
                    <TableCell>{category.modifiedBy}</TableCell>
                    <Link to={"/load"}>
                      <button>Wood Pieces</button>
                    </Link>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={7}>
                    <strong>Total Value:</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{totalTimberValue}</strong>
                  </TableCell>
                  <TableCell colSpan={5}></TableCell>
                  <TableCell>
                    <strong>{totalCubicValue}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewBillDetails;
