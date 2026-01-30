import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";

import { getcubicValueByLengthCur } from "../../services/CubicManagementService/CubicValue";

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";

// Helper to derive rate from circumference
// circumference (below 23) = 1↑
// circumference (between 24 - 35) = 2↑
// circumference (between 36 - 47) = 3↑
// circumference (between 48 - 59) = 4↑
// circumference (60 and above) = 5↑
const getRate = (circumference) => {
  const c = Number(circumference);
  if (!Number.isFinite(c) || c <= 0) return "";
  if (c <= 23) return "1↑";
  if (c >= 24 && c <= 35) return "2↑";
  if (c >= 36 && c <= 47) return "3↑";
  if (c >= 48 && c <= 59) return "4↑";
  return "5↑";
};

const CubicCalculate = () => {
  const [circumference, setCircumference] = useState("");
  const [length, setLength] = useState("");
  const [cubic, setCubic] = useState("");
  const [rate, setRate] = useState("");
  const [rows, setRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleRowChange = async (field, value) => {
    if (field === "circumference") {
      setCircumference(value);
      setRate(getRate(value));
    }
    if (field === "length") {
      setLength(value);
    }

    // Fetch cubic value when length is changed and circumference exists
    if (field === "length" && value && circumference) {
      try {
        const result = await getcubicValueByLengthCur(value, circumference);
        setCubic(result ? `${result.feet}.${result.inches}` : "0.0");
      } catch (error) {
        console.error("Error fetching cubic:", error?.message || error);
        setCubic("N/A");
      }
    }
  };

  const handleAddRow = () => {
    if (!circumference || !length) {
      alert("Please fill in both Circumference and Length.");
      return;
    }
    const newRow = {
      circumference,
      length,
      cubic,
      rate,
    };
    setRows([...rows, newRow]);

    // Clear the input fields after adding row
    setCircumference("");
    setLength("");
    setCubic("");
    setRate("");
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleEditRow = (index) => {
    const rowToEdit = rows[index];
    setCircumference(rowToEdit.circumference);
    setLength(rowToEdit.length);
    setCubic(rowToEdit.cubic);
    setRate(rowToEdit.rate);
    setEditIndex(index);
  };

  const handleCalculateAll = () => {
    console.log("Final rows:", rows);
    alert("Calculated! Check console.");
  };

  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Cubic Calculation Table</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Circumference</Text>
            <Text style={styles.tableCell}>Length</Text>
            <Text style={styles.tableCell}>Cubic Value</Text>
            <Text style={styles.tableCell}>Rate</Text>
          </View>
          {rows.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{row.circumference}</Text>
              <Text style={styles.tableCell}>{row.length}</Text>
              <Text style={styles.tableCell}>{row.cubic}</Text>
              <Text style={styles.tableCell}>{row.rate}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },
    tableCell: {
      width: "25%",
      padding: 5,
      textAlign: "center",
      borderRightWidth: 1,
      borderRightColor: "#000",
    },
  });

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cubic Calculator
      </Typography>

      {/* Input Row for Adding Data */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <TextField
            type="number"
            fullWidth
            label="Circumference"
            value={circumference}
            onChange={(e) => handleRowChange("circumference", e.target.value)}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            select
            fullWidth
            label="Length (1-40)"
            value={length}
            onChange={(e) => handleRowChange("length", e.target.value)}
          >
            {[...Array(40)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Cubic Value (ft.in)"
            value={cubic}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            fullWidth
            label="Rate"
            value={rate}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={1}>
          <IconButton color="primary" onClick={handleAddRow}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>

      {/* Table with Rows */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Circumference</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Cubic Value</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.circumference}</TableCell>
                <TableCell>{row.length}</TableCell>
                <TableCell>{row.cubic}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditRow(index)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Calculate Button */}
      <Box textAlign="right" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<CalculateIcon />}
          onClick={handleCalculateAll}
        >
          Calculate
        </Button>
        <PDFDownloadLink document={<MyDocument />} fileName="cubic_calculations.pdf">
          {({ loading }) =>
            loading ? (
              <Button variant="contained" sx={{ ml: 2 }}>
                Loading PDF...
              </Button>
            ) : (
              <Button variant="contained" sx={{ ml: 2 }}>
                Export to PDF
              </Button>
            )
          }
        </PDFDownloadLink>
      </Box>
    </Paper>
  );
};

export default CubicCalculate;
