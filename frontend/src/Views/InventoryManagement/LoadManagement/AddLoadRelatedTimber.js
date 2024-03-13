import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { NewLdRelatedTimber } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";

const AddLoadRelatedTimber = () => {
    const { loadId } = useParams();
    const [formData, setFormData] = useState({
        timberNo: "",
        treeType: "",
        perimeter: "",
        length: "",
        cubicAmount: "",
        otherDetails: "",
        unitPrice: "",
        totalTimerValue: "", // Initialize totalTimerValue as empty string
        totalCuttingValue: "",
        outComeValue: "",
        cuttingDate: "",
        timberStatus: "PENDING",
        status: "",
        createdBy: "",
        createdDate: "",
        modifiedBy: "",
        modifiedDate: "",
        permitid_fk: loadId,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };
        // Calculate totalTimerValue
        const totalTimerValue = parseFloat(newFormData.cubicAmount) * parseFloat(newFormData.unitPrice);
        newFormData.totalTimerValue = isNaN(totalTimerValue) ? "" : totalTimerValue.toFixed(2); // Ensure it's a string with 2 decimal places
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const TimberId = await NewLdRelatedTimber(formData);
            console.log("New category ID:", TimberId);
            // Redirect to "/load" after successful submission
            window.location.href = "/load";
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
                        Add Timber
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

export default AddLoadRelatedTimber;
