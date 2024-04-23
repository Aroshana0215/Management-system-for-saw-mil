import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { newBill, getbillDetailsById } from "../../services/BillAndOrderService/BilllManagemntService"; 
import { useParams } from "react-router-dom";
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
  const { orderData } = useParams();
  const decodedwoodData = JSON.parse(decodeURIComponent(orderData));
  const currentDate = new Date();
  const currentDateTime = currentDate.toISOString();

  const [formData, setFormData] = useState({
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
      const billId = await newBill(formData);

      if (billId != null) {
        const stockUpdateData = {
          totalPieces: decodedwoodData.totalPieces,
          changedAmount: decodedwoodData.changedAmount,
          previousAmount: decodedwoodData.previousAmount,
          categoryId_fk: decodedwoodData.categoryId_fk,
          stk_id_fk: decodedwoodData.stk_id_fk,
          status: "D",
          billId_fk: "",
          createdBy: "",
          createdDate: "",
          modifiedBy: "",
          modifiedDate: "",
        };
        await updateStockSummaryDetails(
          decodedwoodData.summaryId,
          stockUpdateData
        );

        const stockSumData = {
          totalPieces:
            Number(decodedwoodData.totalPieces) -
            Number(decodedwoodData.requirePices),
          changedAmount: decodedwoodData.requirePices,
          previousAmount: decodedwoodData.totalPieces,
          categoryId_fk: decodedwoodData.categoryId_fk,
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

      window.location.href = `/bill/view/${billId}`;
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };

  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
        p={2}
      >
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Create a new bill
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                label={
                  key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")
                }
                variant="outlined"
                name={key}
                value={value}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            ))}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Load
            </Button>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Typography
            component={Link}
            to={"/load"}
            variant="body2"
            sx={{ textAlign: "center", textDecoration: "none" }}
          >
            Go to Price Page
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateNewBill;
