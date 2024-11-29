import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const CancelBillDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Cancellation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelBillDialog;
