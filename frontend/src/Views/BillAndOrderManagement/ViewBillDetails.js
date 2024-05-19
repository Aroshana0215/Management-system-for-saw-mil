import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Button,
  FormControl,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import { getbillDetailsById } from "../../services/BillAndOrderService/BilllManagemntService";
import { getorderIdByBillId } from "../../services/BillAndOrderService/OrderManagmentService";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

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
  const [isLoadDataEditable, setIsLoadDataEditable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loadData, setLoadData] = useState({
    dateAndTime: { editable: false, bpMD: 4 },
    cusName: { editable: false, bpMD: 4 },
    cusAddress: { editable: false, bpMD: 4 },
    cusNIC: { editable: false, bpMD: 4 },
  });
  const columns = [
    {
      field: "availablePiecesAmount",
      headerName: "Available Pieces Amount",
      width: 180,
    },
    {
      field: "neededPiecesAmount",
      headerName: "Needed Pieces Amount",
      width: 180,
    },
    {
      field: "remainPiecesAmount",
      headerName: "Remain Pieces Amount",
      width: 180,
    },
    { field: "discountPrice", headerName: "Discount Price", width: 150 },
    { field: "bill_id_fk", headerName: "Bill ID FK", width: 120 },
    { field: "catergoryId_fk", headerName: "Category ID FK", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "createdBy", headerName: "Created By", width: 120 },
    { field: "modifiedBy", headerName: "Modified By", width: 130 },
  ];

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    //TODO: handle update load
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h4" color="primary" align="center">
              Bill & Order details
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} padding={2}>
          <Grid
            container
            component={"form"}
            onSubmit={handleSubmit}
            padding={2}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Grid item xs={12} padding={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6" color="primary" align="center">
                  Bill details
                </Typography>
                <Button
                  startIcon={isLoadDataEditable ? <CancelIcon /> : <EditIcon />}
                  variant="outlined"
                  onClick={() => {
                    setIsLoadDataEditable(!isLoadDataEditable);
                  }}
                >
                  {isLoadDataEditable ? "Cancel" : "Edit"}
                </Button>
              </Stack>
            </Grid>
            {Object.entries(loadData).map(([key, item]) => (
              <Grid item key={key} xs={12} md={item.bpMD} padding={2}>
                <FormControl fullWidth>
                  <FormLabel>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </FormLabel>
                  {!isLoadDataEditable || !item.editable ? (
                    <Typography color={"primary"} variant="h6">
                      {categoryData[key]}
                    </Typography>
                  ) : (
                    <OutlinedInput
                      size="small"
                      name={key}
                      value={categoryData[key]}
                      onChange={handleChange}
                    />
                  )}
                  {/* <FormHelperText/> */}
                </FormControl>
              </Grid>
            ))}
            {isLoadDataEditable && (
              <Grid item xs={12} padding={1}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            padding={2}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              marginY: 2,
            }}
          >
            <Grid item xs={12} padding={1}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                {/* TODO: change title */}
                <Typography variant="h6" color="primary" align="center">
                  Order details
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} padding={1}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7}>Total Value</TableCell>
                      <TableCell>{totalTimberValue}</TableCell>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell>{totalCubicValue}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} padding={1}>
              <DataGrid
                rows={categories}
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
        </Grid>
      </Grid>
    </>
  );
};

export default ViewBillDetails;
