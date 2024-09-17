import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  newBill,
  getbillDetailsById,
} from "../../services/BillAndOrderService/BilllManagemntService";
import {
  createStockSummary,
  updateStockSummaryDetails,
  getStockSummaryById
} from "../../services/InventoryManagementService/StockSummaryManagementService";
import { createOrder } from "../../services/BillAndOrderService/OrderManagmentService";
import { newIncome } from "../../services/AccountManagementService/IncomeManagmentService";
import {
  newAccountSummary,
  updateAccountSummary,
  getActiveAccountSummaryDetails,
} from "../../services/AccountManagementService/AccountSummaryManagmentService";
import { getCategoryById } from "../../services/PriceCardService";

const CreateNewBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { woodData } = location.state;
  console.log("woodData:",woodData);
  const { user } = useSelector((state) => state.auth);
  const currentDate = new Date();
  const currentDateTime = currentDate.toISOString();

  // Calculate total amount and remaining amount from wood data
  const calculateTotals = (advance) => {
    const totalAmount = woodData.reduce(
      (sum, wood) => sum + Number(wood.amount) * Number(wood.billPrice),
      0
    );
    const remainningAmount = totalAmount - Number(advance || 0);
    return { totalAmount, remainningAmount };
  };

  const [formData, setFormData] = useState({
    cusName: "",
    cusAddress: "",
    cusNIC: "",
    cusPhoneNumber: "",
    totalAmount: 0,
    advance: 0,
    remainningAmount: 0,
    PromizeDate: "",
    description: "",
    billStatus: "", // Default empty, to be updated with dropdown value
  });

  // Update totalAmount and remainningAmount when woodData or advance changes
  useEffect(() => {
    const { totalAmount, remainningAmount } = calculateTotals(formData.advance);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount,
      remainningAmount,
    }));
  }, [woodData, formData.advance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedData = {
        ...formData, // Spreading formData
        dateAndTime: currentDateTime,
        status: "A",
        createdBy: user.displayName,
        createdDate: currentDateTime
      };
      console.log("woodData:",woodData);
      const bill = await newBill(formattedData);

      if (bill != null) {
        for (const wood of woodData) {

      console.log("wood.tobeCut:",wood.toBeCut);
      
          const data = await getStockSummaryById(wood.summaryId);

          console.log("data:",data);

          if (data == null) {
            console.error("No data for the given stock summaryId:", wood.summaryId);
          }

          const stockUpdateData = {
            status: "D",
            modifiedBy: user.displayName,
            modifiedDate: currentDateTime
          };
          await updateStockSummaryDetails(data.id, stockUpdateData);

          let toBeCutAmount = 0;
          let totalPieces = 0;
          
          if(wood.toBeCut > 0){
            toBeCutAmount = Number(data.toBeCutAmount) + Number(wood.toBeCut)
          }else{
            totalPieces = Number(wood.totalPieces) - Number(wood.amount)
          }

          const catogoryDatat = await getCategoryById(data.categoryId_fk);
          if(catogoryDatat == null){
            console.error("Invalid category:", data.categoryId_fk);
          }
        
          const stockSumData = {
            totalPieces: totalPieces,
            changedAmount: wood.amount,
            previousAmount: wood.totalPieces,
            categoryId_fk: wood.categoryId_fk,
            maxlength : catogoryDatat.minlength,
            minlength : catogoryDatat.minlength,
            timberNature : catogoryDatat.timberNature,
            timberType : catogoryDatat.timberType,
            areaLength : catogoryDatat.areaLength,
            areaWidth : catogoryDatat.areaWidth,
            length: String(wood.requestLength),
            toBeCutAmount : toBeCutAmount,
            stk_id_fk: "",
            status: "A",
            billId_fk: bill.id,
            createdBy: user.displayName,
            createdDate: currentDateTime,
          };
          const newstockSummaryData = await createStockSummary(stockSumData);

          let complete = false;

          if( wood.toBeCut == 0){
            complete = true;
          }else{
            complete = false;
          }

          if (newstockSummaryData != null) {
            const saveOrderData = {
              discountPrice: wood.billPrice || 0,
              categoryId_fk: wood.categoryId_fk || 0,
              availablePiecesAmount: wood.totalPieces || 0,
              neededPiecesAmount: wood.amount || 0,
              tobeCut: wood.toBeCut,
              woodLength: wood.requestLength,
              isComplete : complete,
              status: "A",
              billId_fk: bill.id,
              createdBy: user.displayName,
              createdDate: currentDateTime
            };
            await createOrder(saveOrderData);
          }
        }

        const saveIncomeData = {
          date: currentDateTime,
          type: "Bill",
          des: "Nothing",
          amount: formData.totalAmount,
          BilId: bill.billID || "",
          status: "A",
          createdBy: user.displayName,
          createdDate: currentDateTime,
        };

        const incomeId = await newIncome(saveIncomeData);

        if (incomeId != null) {
          const data = await getActiveAccountSummaryDetails();

          if (data != null) {
            const accountSummaryData = {
              status: "D",
              modifiedBy: user.displayName,
              modifiedDate: currentDateTime
            };

            await updateAccountSummary(data.id, accountSummaryData);

            const newAccountSummaryData = {
              totalAmount:
                Number(data.totalAmount) + Number(formData.totalAmount),
              changedAmount: formData.totalAmount,
              previousAmount: data.totalAmount,
              expId_fk: "",
              incId_fk: incomeId,
              status: "A",
              createdBy: user.displayName,
              createdDate: currentDateTime,
            };

            await newAccountSummary(newAccountSummaryData);
          }
        }
      }
      navigate(`/bill/view/${bill.id}`);
    } catch (error) {
      console.error("Error creating bill:", error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "Timber Type",
      headerName: "Timber Type",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.timberType} - ${row.length} x ${row.width}`;
      },
    },
    { field: "requestLength", headerName: "Length", width: 150 },
    { field: "totalPieces", headerName: "Total Pieces", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "toBeCut", headerName: "To Be Cut", width: 150 },
    { field: "billPrice", headerName: "Bill Price", width: 150 },
    { field: "total", headerName: "Total", width: 150 },
  ];

  const rows = woodData.map((wood, index) => ({
    id: index + 1,
    ...wood,
    total: Number(wood.amount) * Number(wood.billPrice),
  }));

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Grid
            container
            padding={2}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Grid item xs={12} padding={1}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6" color="primary" align="center">
                  Create a new bill
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container>
                  <Grid item xs={12} p={1}>
                    <Typography variant="h6">Customer Data</Typography>
                  </Grid>
                  {Object.entries(formData).map(([key, value]) => (
                    <Grid key={key} item xs={12} md={4} p={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </FormLabel>
                        {key === "billStatus" ? (
                          <FormControl fullWidth sx={{ minWidth: 120 }}>
                            <InputLabel>Bill Status</InputLabel>
                            <Select
                              name={key}
                              value={value}
                              onChange={handleChange}
                              size="small"
                              sx={{
                                height: 40, // Adjust height to match OutlinedInput (same as other fields)
                                width : 250,
                              }}
                            >
                              <MenuItem value="ORDER">ORDER</MenuItem>
                              <MenuItem value="COMPLETE">COMPLETE</MenuItem>
                              <MenuItem value="PENDING">PENDING</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          <OutlinedInput
                            size="small"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            readOnly={key === "totalAmount" || key === "remainningAmount"} // Make fields read-only
                            sx={{ height: 40 }} // Ensure height consistency for text input fields
                          />
                        )}


                      </FormControl>
                    </Grid>
                  ))}
                  <Grid item xs={12} p={1}>
                    <Typography variant="h6">Wood Data</Typography>
                  </Grid>
                  <Grid item xs={12} p={1}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                    />
                  </Grid>
                  <Grid item xs={12} p={1}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate("/bill")}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateNewBill;
