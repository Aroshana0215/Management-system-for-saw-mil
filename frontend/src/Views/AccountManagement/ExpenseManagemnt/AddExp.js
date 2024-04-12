import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { newExpense } from "../../../services/AccountManagementService/ExpenseManagmentService";
import { getActiveAccountSummaryDetails, newAccountSummary, updateAccountSummary  } from "../../../services/AccountManagementService/AccountSummaryManagmentService";

const AddExp = () => {
    const [formData, setFormData] = useState({
        date: "",
        type: "",
        des: "",
        amount: "",
        status: "A",
        createdBy: "",
        createdDate: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const ExpensesId = await newExpense(formData);
            console.log("New Expenses ID:", ExpensesId);

            if (ExpensesId != null){   
                const data = await getActiveAccountSummaryDetails();
                
      
                if(data != null){
                  const accountSummaryData = {
                    status: "D",
                  };
      
                  const updatedAccountSummary = await updateAccountSummary(data.id, accountSummaryData)
                const newAccountSummaryData = {
                  totalAmount: Number(data.totalAmount) - Number(formData.amount),
                  changedAmount: formData.amount,
                  previousAmount: data.totalAmount,
                  expId_fk:"",
                  incId_fk: ExpensesId,
                  status: "A",
                  createdBy:"",
                  createdDate:"",
                  modifiedBy:"",
                  modifiedDate:"",
                };
                const AccountSummaryId = await newAccountSummary(newAccountSummaryData)
            }
                
              }

            window.location.href = "/exp";
        } catch (error) {
            console.error("Error creating Expenses:", error.message);
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
                        Add Expenses 
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Description"
                            name="des"
                            value={formData.des}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Created By"
                            name="createdBy"
                            value={formData.createdBy}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Created Date"
                            type="date"
                            name="createdDate"
                            value={formData.createdDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Create
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        component={Link}
                        to={"/price"}
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

export default AddExp;
