import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";

const GetWantsWood = () => {
  const [payloadBulk, setPayloadBulk] = useState([
    { categoryId: "", length: "", amount: "" },
  ]);

  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const values = [...payloadBulk];
    values[index][event.target.name] = event.target.value;
    setPayloadBulk(values);
  };

  const addRow = () => {
    setPayloadBulk([...payloadBulk, { categoryId: "", length: "", amount: "" }]);
  };

  const removeRow = (index) => {
    const values = [...payloadBulk];
    values.splice(index, 1);
    setPayloadBulk(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/bill/show-remain-wood', { state: { payloadBulk } });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          sx={{
            bgcolor: "background.default",
            borderRadius: 2,
          }}
          p={2}
        >
          <Grid item xs={12} padding={1}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h6" color="primary" align="center">
                Create Bill
              </Typography>
            </Stack>
          </Grid>
          {payloadBulk.map((row, index) => (
            <Grid container key={index} sx={{ marginBottom: 2 }}>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" color="textSecondary">
                    Row {index + 1}
                  </Typography>
                  <IconButton color="error" onClick={() => removeRow(index)}>
                    <HighlightOffIcon />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} p={1}>
                <FormControl fullWidth>
                  <FormLabel>Category ID</FormLabel>
                  <OutlinedInput
                    size="small"
                    name="categoryId"
                    value={row.categoryId}
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} p={1}>
                <FormControl fullWidth>
                  <FormLabel>Length</FormLabel>
                  <OutlinedInput
                    size="small"
                    name="length"
                    value={row.length}
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} p={1}>
                <FormControl fullWidth>
                  <FormLabel>Amount</FormLabel>
                  <OutlinedInput
                    size="small"
                    name="amount"
                    value={row.amount}
                    onChange={(event) => handleInputChange(index, event)}
                    fullWidth
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))}
          <IconButton variant="contained" color="primary" onClick={addRow}>
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
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
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default GetWantsWood;
