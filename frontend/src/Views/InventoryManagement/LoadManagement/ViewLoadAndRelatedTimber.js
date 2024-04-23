import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  OutlinedInput,
  Stack,
  Button,
} from "@mui/material";
import { getLoadDetailsById } from "../../../services/InventoryManagementService/LoadDetailsService";
import { getLdRelatedTimberByLoadId } from "../../../services/InventoryManagementService/LoadRelatedTimberDetailService";
import { Link } from "react-router-dom";
import Theme from "../../../Theme/Theme";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

const UpdateCategory = () => {
  const { loadId } = useParams();
  const [categories, setCategories] = useState([]);
  const [totalTimberValue, setTotalTimberValue] = useState(0);
  const [totalCubicValue, setTotalCubicValue] = useState(0);
  const [categoryData, setCategoryData] = useState({
    sellerName: "",
    permitNumber: "",
    region: "",
    lorryNumber: "",
    driver: "",
    unloadedDate: "",
    status: "",
    createdBy: "",
    otherDetails: "",
  });
  const [isLoadDataEditable, setIsLoadDataEditable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loadData, setLoadData] = useState({
    sellerName: { editable: false, bpMD: 6 },
    permitNumber: { editable: false, bpMD: 6 },
    region: { editable: false, bpMD: 6 },
    lorryNumber: { editable: false, bpMD: 6 },
    driver: { editable: false, bpMD: 6 },
    unloadedDate: { editable: false, bpMD: 6 },
    status: { editable: false, bpMD: 6 },
    createdBy: { editable: false, bpMD: 6 },
    otherDetails: { editable: true, bpMD: 12 },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLoadDetailsById(loadId);
        setCategoryData(data);
        const loadData = await getLdRelatedTimberByLoadId(loadId);
        if (Array.isArray(loadData)) {
          setCategories(loadData);
          // Calculate total timber value
          const totalValue = loadData.reduce(
            (acc, curr) => acc + parseFloat(curr.totalTimerValue || 0),
            0
          );
          setTotalTimberValue(totalValue.toFixed(2));
          const totalCValue = loadData.reduce(
            (acc, curr) => acc + parseFloat(curr.cubicAmount || 0),
            0
          );
          setTotalCubicValue(totalCValue.toFixed(2));
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [loadId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //TODO: handle update load
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} padding={1}>
          <Typography variant="h4" color="primary" align="center">
            Load Details and related Timber details
          </Typography>
        </Grid>
        <Grid item xs={12} padding={1}>
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
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6" color="primary" align="center">
                  Load Details
                </Typography>
                <Button
                  startIcon={isLoadDataEditable ? <CancelIcon /> : <EditIcon />}
                  variant="outlined"
                  onClick={() => {
                    setIsLoadDataEditable(!isLoadDataEditable);
                  }}
                >
                  {isLoadDataEditable ? "Cancel" : "Edit"}
                </Button>
              </Stack>
            </Grid>
            {Object.entries(loadData).map(([key, item]) => (
              <Grid item key={key} xs={12} md={item.bpMD} padding={2}>
                <FormControl fullWidth>
                  <Typography>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </Typography>
                  {!isLoadDataEditable || !item.editable ? (
                    <Typography color={"primary"}>
                      {categoryData[key]}
                    </Typography>
                  ) : (
                    <OutlinedInput
                      name={key}
                      value={categoryData[key]}
                      onChange={handleChange}
                    />
                  )}
                  {/* <FormHelperText/> */}
                </FormControl>
              </Grid>
            ))}
            {isLoadDataEditable && (
              <Grid item xs={12} padding={1}>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            padding={2}
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              marginY: 2,
            }}
          >
            <Grid item xs={12} padding={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6" color="primary" align="center">
                  Load Details
                </Typography>
                <Button
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  component={Link}
                  variant="outlined"
                  to={`/load/timber/add/${loadId}`}
                >
                  Add Timber
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} padding={1}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Timber No
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Tree Type
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Perimeter
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Length
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Cubic Amount
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Other Details
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Unit Price
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Total Timer Value
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Total Cutting Value
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Out Come Value
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Created By
                      </TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontSize: "12px" }}
                      >
                        Modified By
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category, index) => (
                      <>
                        <TableRow key={index}>
                          {" "}
                          <TableCell
                            colSpan={14}
                            sx={{
                              bgcolor: Theme.palette.primary.mainBgS1,
                              borderRadius: 2,
                              border: 0,
                            }}
                          ></TableCell>
                        </TableRow>
                        <TableRow key={index}>
                          <TableCell sx={{ border: 0 }}>
                            {category.timberNo}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.treeType}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.perimeter}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.length}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.cubicAmount}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.otherDetails}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.unitPrice}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.totalTimerValue}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.totalCuttingValue}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.outComeValue}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.status}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.createdBy}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            {category.modifiedBy}
                          </TableCell>
                          <TableCell sx={{ border: 0 }}>
                            <Button
                              variant="contained"
                              component={Link}
                              size="small"
                              to={"/load"}
                            >
                              Wood Pieces
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow>
                      <TableCell colSpan={7}>
                        <strong>Total Value:</strong>
                      </TableCell>
                      <TableCell>
                        <strong>{totalTimberValue}</strong>
                      </TableCell>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell>
                        <strong>{totalCubicValue}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateCategory;
