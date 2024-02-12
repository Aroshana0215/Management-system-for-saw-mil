import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { NewInventory } from "../../../services/InventoryManagementService/StockManagementService"; 
import { createStockSummary, getActiveStockSummaryDetails, updateStockSummaryDetails } from "../../../services/InventoryManagementService/StockSummaryManagementService"; 

const CreateNewStock = () => {
  const [formData, setFormData] = useState({

    categoryId_fk : "",
    timberId_fk : "",
    sectionNumber : "",
    amountOfPieces : "",
    MachineNo : "",
    status: "A",
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
      const stockData = await NewInventory(formData);

    

      if (stockData != null){
        
       const resultData  = await getActiveStockSummaryDetails(stockData.categoryId_fk);
        if(resultData == null){
          console.log("in");
          const stockSumData = {
            totalPieces: stockData.amountOfPieces,
            changedAmount: stockData.amountOfPieces,
            previousAmount: "0",
            categoryId_fk: stockData.categoryId_fk,
            stk_id_fk: stockData.timberId_fk,
            status: "A",
            billId_fk:"",
            createdBy:"",
            createdDate:"",
            modifiedBy:"",
            modifiedDate:"",
          };
          const stockSummarykData = await createStockSummary(stockSumData);
        }else{
          const stockUpdateData = {
            totalPieces: resultData.totalPieces,
            changedAmount: resultData.changedAmount,
            previousAmount: resultData.previousAmount,
            categoryId_fk: resultData.categoryId_fk,
            stk_id_fk: resultData.stk_id_fk,
            status: "D",
            billId_fk:"",
            createdBy:"",
            createdDate:"",
            modifiedBy:"",
            modifiedDate:"",
          };
          console.log("in:",resultData.id);
          console.log("in:",resultData.stockUpdateData);
          const updatedkData = await updateStockSummaryDetails(resultData.id, stockUpdateData);

          const stockSumData = {
            totalPieces: Number(resultData.totalPieces) + Number(stockData.amountOfPieces),
            changedAmount: stockData.amountOfPieces,
            previousAmount: resultData.totalPieces,
            categoryId_fk: resultData.categoryId_fk,
            stk_id_fk:  resultData.stk_id_fk,
            status: "A",
            billId_fk:"",
            createdBy:"",
            createdDate:"",
            modifiedBy:"",
            modifiedDate:"",
          };
          const newstockSummaryData = await createStockSummary(stockSumData);
          
        }


      }

      window.location.href = "/stock";
    } catch (error) {
      console.error("Error creating category:", error.message);
      // Handle error
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
            Create Load Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <TextField
                key={key}
                fullWidth
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
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
              Create Stock
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

export default CreateNewStock;
