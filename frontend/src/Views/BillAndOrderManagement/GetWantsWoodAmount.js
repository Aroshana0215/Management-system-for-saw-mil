import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

const GetWantsWood = () => {
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState({
    timberType: { bpMD: 6 },
    areaLength: { bpMD: 6 },
    areaWidth: { bpMD: 6 },
    thickness: { bpMD: 6 },
    amount: { bpMD: 6 },
  });
  const [payload, setPayload] = useState({
    timberType: "",
    areaLength: "",
    areaWidth: "",
    thickness: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevFormData) => ({
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
      const formDataString = encodeURIComponent(JSON.stringify(payload));
      window.location.href = `/bill/process/wood/${formDataString}`;
      // }
    } catch (error) {
      console.error("Error creating category:", error.message);
      alert("Error getting Category: " + error.message);
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
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
            {Object.entries(formData).map(([key, item]) => (
              <Grid item key={key} xs={12} md={item.bpMD} padding={1}>
                <FormControl
                  fullWidth
                  sx={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormLabel>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </FormLabel>
                  <OutlinedInput
                    size="small"
                    type={key === "dateOfBirth" ? "datetime-local" : null}
                    name={key}
                    value={payload[key]}
                    onChange={handleChange}
                  />
                  {/* <FormHelperText/> */}
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
              <Button type="submit" variant="contained">
                Create Bill
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default GetWantsWood;
