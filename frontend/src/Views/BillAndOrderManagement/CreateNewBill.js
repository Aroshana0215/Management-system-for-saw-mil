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
      const billId = await newBill(formData);

      if (billId != null) {
        for (const wood of woodData) {
          const stockUpdateData = {
            totalPieces: wood.totalPieces,
            changedAmount: wood.changedAmount,
            previousAmount: wood.previousAmount,
            categoryId_fk: wood.categoryId_fk,
            stk_id_fk: wood.stk_id_fk,
            status: "D",
            billId_fk: "",
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: "",
          };
          await updateStockSummaryDetails(wood.summaryId, stockUpdateData);

          const stockSumData = {
            totalPieces: Number(wood.totalPieces) - Number(wood.requirePices),
            changedAmount: wood.requirePices,
            previousAmount: wood.totalPieces,
            categoryId_fk: wood.categoryId_fk,
            stk_id_fk: "",
            status: "A",
            billId_fk: billId,
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: "",
          };
          const newstockSummaryData = await createStockSummary(stockSumData);

          console.log("Category updated successfully");

          if (newstockSummaryData != null) {
            const data = await getbillDetailsById(billId);

            const saveOrderData = {
              discountPrice: data.discountPrice || "",
              categoryId_fk: data.categoryId_fk || "",
              availablePiecesAmount: data.availablePiecesAmount || "",
              remainPiecesAmount: data.remainPiecesAmount || "",
              neededPiecesAmount: data.neededPiecesAmount || "",
              status: "A",
              billId_fk: billId,
              createdBy: "",
              createdDate: "",
              modifiedBy: "",
              modifiedDate: "",
            };

            await createOrder(saveOrderData);
          }
        }

        const saveIncomeData = {
          date: currentDateTime,
          type: "Bill",
          des: "Nothing",
          amount: formData.totalAmount,
          BilId: billId || "",
          status: "A",
          createdBy: "",
          createdDate: "",
          modifiedBy: "",
          modifiedDate: "",
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
      navigate(`/bill/view/${billId}`);
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
