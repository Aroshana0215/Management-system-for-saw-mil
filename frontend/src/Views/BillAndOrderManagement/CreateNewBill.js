import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
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
} from "../../services/InventoryManagementService/StockSummaryManagementService";
import { createOrder } from "../../services/BillAndOrderService/OrderManagmentService";
import { newIncome } from "../../services/AccountManagementService/IncomeManagmentService";
import {
  newAccountSummary,
  updateAccountSummary,
  getActiveAccountSummaryDetails,
} from "../../services/AccountManagementService/AccountSummaryManagmentService";

const CreateNewBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { woodData } = location.state;
  const { user } = useSelector((state) => state.auth);
  const currentDate = new Date();
  const currentDateTime = currentDate.toISOString();

  const [formData, setFormData] = useState({
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
    unloadedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      dateAndTime: currentDateTime,
      status: "A",
      createdBy: user.displayName,
      createdDate: currentDateTime,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("formData:",formData);
      const bill = await newBill(formData);

      if (bill != null) {
        console.log("bill:",bill);
        console.log("woodData:",woodData);
        for (const wood of woodData) {
          const stockUpdateData = {
            status: "D",
          };
          await updateStockSummaryDetails(wood.summaryId, stockUpdateData);

          const stockSumData = {
            totalPieces: Number(wood.totalPieces) - Number(wood.amount),
            changedAmount: wood.amount,
            previousAmount: wood.totalPieces,
            categoryId_fk: wood.categoryId_fk,
            length : wood.requestLength,
            stk_id_fk: "",
            status: "A",
            billId_fk: bill.id,
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: "",
          };
          const newstockSummaryData = await createStockSummary(stockSumData);

          console.log("newstockSummaryData:",newstockSummaryData);

          if (newstockSummaryData != null) {
            const saveOrderData = {
              discountPrice: wood.billPrice || "",
              categoryId_fk: wood.categoryId_fk || "",
              availablePiecesAmount: wood.totalPieces || "",
              neededPiecesAmount: wood.amount || "",
              tobeCut: wood.toBeCut || "",
              status: "A",
              billId_fk: bill.id,
              createdBy: "",
              createdDate: "",
              modifiedBy: "",
              modifiedDate: "",
            };
            console.log("saveOrderData:",saveOrderData);
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

          console.log("data.totalAmount:", data.totalAmount);

          if (data != null) {
            const accountSummaryData = {
              status: "D",
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
              createdBy: "",
              createdDate: "",
              modifiedBy: "",
              modifiedDate: "",
            };

            await newAccountSummary(newAccountSummaryData);
          }
        }
      }
      navigate(`/bill/view/${bill.id}`);
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "timberType", headerName: "Timber Type", width: 150 },
    { field: "length", headerName: "Length", width: 150 },
    { field: "width", headerName: "Width", width: 150 },
    { field: "totalPieces", headerName: "Total Pieces", width: 150 },
    { field: "unitPrice", headerName: "Unit Price", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "toBeCut", headerName: "To Be Cut", width: 150 },
    { field: "billPrice", headerName: "Bill Price", width: 150 },
  ];

  const rows = woodData.map((wood, index) => ({
    id: index + 1,
    ...wood,
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
                        <OutlinedInput
                          size="small"
                          name={key}
                          value={value}
                          onChange={handleChange}
                        />
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
                    <Button type="submit" variant="contained" color="primary">
                      Create Bill
                    </Button>
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
