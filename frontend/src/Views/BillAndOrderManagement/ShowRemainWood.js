import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { getActiveStockSummaryDetails, } from "../../services/InventoryManagementService/StockSummaryManagementService"; // Import getCategoryById and updateCategory functions
import {getCategoryIdBytimberType } from "../../services/PriceCardService";
import {createOrder } from "../../services/BillAndOrderService/OrderManagmentService";

const ShowRemainWood = () => {
  const { woodData } = useParams();
  console.log("woodData intial :", woodData);
  const [totalPieces, setTotalPieces] = useState("");
  const [timberType, setTimberType] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [requirePices, setRequirePices] = useState("");
  const [toBeCut, setToBeCut] = useState("");
  const [billPrice, setBillPrice] = useState("");
  const [changedAmount, setChangedAmount] = useState("");
  const [categoryId_fk, setCategoryId_fk] = useState("");
  const [previousAmount, setPreviousAmount] = useState("");
  const [stk_id_fk, setstk_id_fk] = useState("");
  const [summaryId, setSummaryId] = useState("");

  // Fetch category woodData based on categoryId when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedwoodData = JSON.parse(decodeURIComponent(woodData));
        console.log("woodData:", woodData);
    
        // const ctegoryData = await getCategoryIdBytimberType(decodedwoodData.timberType, decodedwoodData.areaLength, decodedwoodData.areaWidth, decodedwoodData.thickness);
        const ctegoryData = await getCategoryIdBytimberType("CAT-1");
        console.log("ctegoryData:", ctegoryData);
        if (ctegoryData.id != null) {
          const data = await getActiveStockSummaryDetails(ctegoryData.id);
          console.log(data);
          if (data) {
            setTimberType(ctegoryData.timberType || "");
            setLength(ctegoryData.areaLength || "");
            setWidth(ctegoryData.areaWidth || "");
            setThickness(ctegoryData.thickness || "");
            setTotalPieces(data.totalPieces || "");
            setUnitPrice(ctegoryData.unitPrice || "");
            setChangedAmount(data.changedAmount || "");
            setCategoryId_fk(data.categoryId_fk || "");
            setPreviousAmount(data.previousAmount || "");
            setstk_id_fk(data.stk_id_fk || "");
            setSummaryId(data.id || "");
            setRequirePices(decodedwoodData.amount || "");


            var totalPieces = parseInt(data.totalPieces);
            var amount = parseInt(decodedwoodData.amount);
            
            if (totalPieces > amount) {
              setToBeCut(0);
            } else {
              setToBeCut(amount - totalPieces);
            }

          }
        }
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [woodData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const orderData = {
        bill_id_fk:  "" ,
        discountPrice: billPrice || "" , 
        categoryId_fk: categoryId_fk || "",
        availablePiecesAmount: totalPieces || "",
        remainPiecesAmount : toBeCut || "",
        neededPiecesAmount : requirePices || "",
        status: "A",
        billId_fk:"",
        createdBy:"",
        createdDate:"",
        modifiedBy:"",
        modifiedDate:"",
      };

      const orderId = await createOrder(orderData);

      if(orderId != null){

      const formData = {
        totalPieces: totalPieces || "" ,
        changedAmount: changedAmount || "" , 
        previousAmount: previousAmount || "",
        categoryId_fk: categoryId_fk || "",
        stk_id_fk: stk_id_fk || "",
        summaryId: summaryId || "",
        requirePices : requirePices || "",
        orderId : orderId || "",
      };

      const formDataString = encodeURIComponent(JSON.stringify(formData));
      window.location.href = `/bill/add/${formDataString}`;

    }

    } catch (error) {
      console.error("Error updating category:", error.message);
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
            Update Category
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Timber Type"
              variant="outlined"
              value={timberType}
              onChange={(e) => setTimberType(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Area Length"
              variant="outlined"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Area Width"
              variant="outlined"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Thickness"
              variant="outlined"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Total pices"
              variant="outlined"
              value={totalPieces}
              onChange={(e) => setTotalPieces(e.target.value)}
              sx={{ mt: 2 }}
            />
             <TextField
              fullWidth
              label="Require pices"
              variant="outlined"
              value={requirePices}
              onChange={(e) => setRequirePices(e.target.value)}
              sx={{ mt: 2 }}
            />
              <TextField
              fullWidth
              label="To be cut"
              variant="outlined"
              value={toBeCut}
              onChange={(e) => setToBeCut(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Unit Price"
              variant="outlined"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              sx={{ mt: 2 }}
            />
              <TextField
              fullWidth
              label="Bill Price"
              onChange={(e) => setBillPrice(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Update
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShowRemainWood;
