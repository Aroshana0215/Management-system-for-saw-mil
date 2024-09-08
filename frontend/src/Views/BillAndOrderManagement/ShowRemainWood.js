import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  Stack,
  FormControl,
  FormLabel,
  OutlinedInput,
} from "@mui/material";
import { getCategoryById } from "../../services/PriceCardService";
import { createStockSummary, getActiveStockSummaryDetails } from "../../services/InventoryManagementService/StockSummaryManagementService";
import { useSelector } from "react-redux";

const ShowRemainWood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { payloadBulk } = location.state;
  const [woodData, setWoodData] = useState([]);

  console.log("payloadBulk:",payloadBulk);
  console.log("woodData:",woodData);

  const { user } = useSelector((state) => state.auth);
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
  let day = ('0' + currentDate.getDate()).slice(-2);
  let formattedDate = `${year}-${month}-${day}`;

useEffect(() => {
  const fetchData = async () => {
    const woodDetails = await Promise.all(
      payloadBulk.map(async (payload) => {
        const categoryData = await getCategoryById(payload.categoryId);
        console.log("categoryData:", categoryData);

        if (categoryData) {
          const data = await getActiveStockSummaryDetails(
            categoryData.categoryId,
            payload.length
          );

          let toBeCut = 0;

          if(!data){
            toBeCut = 0 -  payload.amount;
          }else{
            toBeCut = data?.totalPieces > payload.amount
            ? 0
            : payload.amount - (data?.totalPieces || 0);
          }


          return {
            ...payload,
            timberType: categoryData.timberType,
            length: categoryData.areaLength,
            width: categoryData.areaWidth,
            totalPieces: data?.totalPieces || 0,
            unitPrice: categoryData.unitPrice,
            changedAmount: data?.changedAmount || 0,
            categoryId_fk: data?.categoryId_fk || categoryData.categoryId,
            previousAmount: data?.previousAmount || "0",
            stk_id_fk: data?.stk_id_fk ||  null,
            toBeCut: toBeCut,
            summaryId: data?.id || null,
            requestLength: payload.length,
          };
        }
        return null;
      })
    );
    setWoodData(woodDetails.filter((detail) => detail !== null));
  };

  fetchData();
}, [payloadBulk]);

  
  const handleBillPriceChange = (index, event) => {
    const { value } = event.target;
    setWoodData((prevWoodData) => {
      const updatedWoodData = [...prevWoodData];
      updatedWoodData[index].billPrice = value;
      return updatedWoodData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const updatedWoodData = await Promise.all(
      woodData.map(async (payload) => {
        const categoryData = await getCategoryById(payload.categoryId);
        const data = await getActiveStockSummaryDetails(
          categoryData.categoryId,
          payload.requestLength
        );
        console.log("data:", data);
  
        let updatedPayload = { ...payload }; // Create a copy of the payload to avoid direct mutation
  
        if (!data) {
          const stockSumData = {
            totalPieces: "0",
            changedAmount: "0",
            previousAmount: "0",
            categoryId_fk: categoryData.categoryId,
            stk_id_fk: null,
            length: payload.requestLength,
            status: "A",
            billId_fk: "",
            createdBy: user.displayName,
            createdDate: formattedDate,
          };
  
          const stockSummaryData = await createStockSummary(stockSumData);
  
          // Update the copied payload with the new summary ID
          updatedPayload.summaryId = stockSummaryData; // Assuming `createStockSummary` returns an object with an `id`
        }
  
        return updatedPayload; // Return the updated payload to form the new state
      })
    );
  
    // Update the state with the new array of woodData
    setWoodData(updatedWoodData);
  
    // Navigate with the processed woodDetails
    navigate("/bill/add", { state: { woodData: updatedWoodData } });
  };
  
  
  

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
                  Update Category
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                {woodData.map((wood, index) => (
                  <Grid container key={index}>
                    <Grid item xs={12} padding={1}>
                      <Typography variant="h6">Entry {index + 1}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Timber Type</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="timberType"
                          value={wood.timberType}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Area Length</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="length"
                          value={wood.length}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Area Width</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="width"
                          value={wood.width}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Total Pieces</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="totalPieces"
                          value={wood.totalPieces}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Unit Price</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="unitPrice"
                          value={wood.unitPrice}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Amount</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="amount"
                          value={wood.amount}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>To Be Cut</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="toBeCut"
                          value={wood.toBeCut}
                          disabled
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4} padding={1}>
                      <FormControl
                        fullWidth
                        sx={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormLabel>Bill Price</FormLabel>
                        <OutlinedInput
                          size="small"
                          name="billPrice"
                          value={wood.billPrice}
                          onChange={(event) =>
                            handleBillPriceChange(index, event)
                          }
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12} p={1}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ShowRemainWood;