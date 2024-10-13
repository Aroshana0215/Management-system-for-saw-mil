import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Table, TableBody, TableCell, TableHead, TableRow, Box } from "@mui/material";
import { getAllbillAdvances } from '../../services/BillAndOrderService/BilllAdvanceService';

const UpdateBill = ({ open, onClose, id }) => {
  const [billData, setBillData] = useState([]);

  useEffect(() => {
    if (id && open) {
      // Fetch bill advances when the dialog is open
      fetchBillData(id);
    }
  }, [id, open]);

  const fetchBillData = async (billId) => {
    try {
      const data = await getAllbillAdvances(); // Assuming this returns an array of bill advances
      setBillData(data); // Set the array of bill advances
    } catch (error) {
      console.error("Error fetching bill data:", error);
    }
  };

  const handleAdd = () => {
    // Handle the action when "Add" button is clicked
    console.log('Add new advance clicked');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Update Bill</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h3>Bill Advances</h3>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add Advance
          </Button>
        </Box>
        {billData && billData.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Advance Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billData.map((bill, index) => (
                <TableRow key={index}>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell>{bill.status}</TableCell>
                  <TableCell>{bill.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBill;
