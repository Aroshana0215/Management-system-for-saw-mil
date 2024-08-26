import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useSelector } from "react-redux";
import { newIncome } from "../../../services/AccountManagementService/IncomeManagmentService";
import {
  getActiveAccountSummaryDetails,
  newAccountSummary,
  updateAccountSummary,
} from "../../../services/AccountManagementService/AccountSummaryManagmentService";

const AddIncome = () => {
  const { user } = useSelector((state) => state.auth);

  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  let day = ("0" + currentDate.getDate()).slice(-2);
  let formattedDate = `${year}-${month}-${day}`;

  const [formData, setFormData] = useState({
    date: "",
    type: "", // Set default value if needed
    des: "",
    amount: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let formattedFormData = {
        ...formData, 
        status: "A",
        createdBy: user.displayName,
        createdDate: formattedDate,
      };
      
      const incomeId = await newIncome(formattedFormData);
      console.log("New income ID:", incomeId);
      if (incomeId != null) {
        const data = await getActiveAccountSummaryDetails();

        if (data != null) {
          const accountSummaryData = {
            status: "D",
          };

          const updatedAccountSummary = await updateAccountSummary(data.id, accountSummaryData);
          const newAccountSummaryData = {
            totalAmount: Number(data.totalAmount) + Number(formData.amount),
            changedAmount: formData.amount,
            previousAmount: data.totalAmount,
            expId_fk: "",
            incId_fk: incomeId,
            status: "A",
            createdBy: user.displayName,
            createdDate: formattedDate,
          };
          const AccountSummaryId = await newAccountSummary(newAccountSummaryData);
          console.log("AccountSummaryId:", AccountSummaryId);
        }
      }

      window.location.href = "/income";
    } catch (error) {
      console.error("Error creating income:", error.message);
    }
  };

  return (
    <Container>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2} p={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" align="center">
            Add Income
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
            {Object.entries(formData).map(([key, value]) => (
              <Grid item key={key} xs={12} padding={1}>
                <FormControl fullWidth>
                  <Typography>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </Typography>
                  {key === "type" ? (
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name={key}
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                      >
                        <MenuItem value="bill">Bill</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      name={key}
                      value={value}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      type={key === "date" ? "date" : "text"}
                      InputLabelProps={{
                        shrink: key === "date",
                      }}
                      sx={{ mt: 2 }}
                    />
                  )}
                </FormControl>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              padding={2}
              sx={{
                display: "flex",
                direction: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddIncome;
