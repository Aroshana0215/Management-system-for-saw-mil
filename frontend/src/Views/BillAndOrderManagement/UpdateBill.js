import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useParams } from "react-router-dom";

const UpdateBill = ({ open, onClose, id }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Bill</DialogTitle>
      <DialogContent>
        {/* Content for updating the bill, can be a form or other components */}
        <p>Updating Bill ID: {id}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBill;