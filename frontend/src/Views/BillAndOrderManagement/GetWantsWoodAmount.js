import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button } from "@mui/material";

const GetWantsWood = () => {
  const [formData, setFormData] = useState({
    timberType:"" ,
    areaLength:"" , 
    areaWidth:"",
    thickness:"",
    amount:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // const data = await getCategoryIdBytimberType(formData.timberType, formData.areaLength, formData.areaWidth, formData.thickness);
      // console.log(data);
      // if(data != null){
        const formDataString = encodeURIComponent(JSON.stringify(formData));
        window.location.href = `/bill/process/wood/${formDataString}`;
      // }
      
    } catch (error) {
      console.error("Error creating category:", error.message);
      alert("Error getting Category: " + error.message);
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
            New Bill
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default GetWantsWood;
