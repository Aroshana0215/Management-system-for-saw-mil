import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Button,
  Typography,
  Paper
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import CalculateIcon from "@mui/icons-material/Calculate";

import { getcubicValueByLengthCur } from "../../services/CubicManagementService/CubicValue";

const CubicCalculate = () => {
  const [rows, setRows] = useState([
    { circumference: "", length: "", cubic: "" },
  ]);

  const handleRowChange = async (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const circumference = Number(updatedRows[index].circumference);
    const length = Number(updatedRows[index].length);

    // Fetch cubic when LENGTH is selected and circumference exists
    if (field === "length" && length && circumference) {
      try {
        const result = await getcubicValueByLengthCur(length, circumference);

        if (result) {
          const feet = result.feet ?? 0;
          const inches = result.inches ?? 0;
          updatedRows[index].cubic = `${feet}.${inches}`;
        } else {
          updatedRows[index].cubic = "0.0";
        }
      } catch (error) {
        updatedRows[index].cubic = "N/A";
        console.error("Error fetching cubic:", error.message);
      }
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { circumference: "", length: "", cubic: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleCalculateAll = () => {
    console.log("Final rows:", rows);
    alert("Calculated! Check console.");
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cubic Calculator
      </Typography>

      {rows.map((row, index) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          key={index}
          sx={{
            my: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fafafa",
            border: "1px solid #eee"
          }}
        >
          {/* Circumference Input (FIRST FIELD) */}
          <Grid item xs={3}>
            <TextField
              type="number"
              fullWidth
              label="Circumference"
              value={row.circumference}
              onChange={(e) =>
                handleRowChange(index, "circumference", e.target.value)
              }
            />
          </Grid>

          {/* Length Dropdown (SECOND FIELD) */}
          <Grid item xs={3}>
            <TextField
              select
              fullWidth
              label="Length (1-40)"
              value={row.length}
              onChange={(e) =>
                handleRowChange(index, "length", e.target.value)
              }
            >
              {[...Array(40)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Cubic Value */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Cubic Value (ft.in)"
              value={row.cubic}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Delete Row */}
          <Grid item xs={1}>
            <IconButton
              color="error"
              onClick={() => removeRow(index)}
              disabled={rows.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Add Row */}
      <Box textAlign="left" sx={{ mt: 2 }}>
        <IconButton color="primary" onClick={addRow}>
          <AddCircleIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Calculate Button */}
      <Box textAlign="right" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<CalculateIcon />}
          onClick={handleCalculateAll}
        >
          Calculate
        </Button>
      </Box>
    </Paper>
  );
};

export default CubicCalculate;
