import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Button,
  FormControl,
  OutlinedInput,
  FormLabel,
} from "@mui/material";
import { getbillDetailsById } from "../../services/BillAndOrderService/BilllManagemntService";
import { getorderIdByBillId } from "../../services/BillAndOrderService/OrderManagmentService";
import { updateorder } from "../../services/BillAndOrderService/OrderManagmentService";
import { getActiveStockSummaryDetails, createStockSummary, updateStockSummaryDetails } from "../../services/InventoryManagementService/StockSummaryManagementService";
import { getCategoryById } from "../../services/PriceCardService";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const ViewBillDetails = () => {
  const { billId } = useParams();
  const [categories, setCategories] = useState([]);
  console.log("categories:",categories);
  // eslint-disable-next-line no-unused-vars
  const [totalTimberValue, setTotalTimberValue] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [totalCubicValue, setTotalCubicValue] = useState(0);

  const [complete, setComplete] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [woodLength, setWoodLength] = useState(0);
  const [tobeCompleteAmount, setTobeCompleteAmount] = useState(0);
  const [toBeCompleteOrder, setToBeCompleteOrder ]= useState(0);

  const { user } = useSelector((state) => state.auth);
  const currentDate = new Date();
  const currentDateTime = currentDate.toISOString();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    dateAndTime: "",
    cusName: "",
    cusAddress: "",
    cusNIC: "",
    cusPhoneNumber: "",
    totalAmount: "",
    advance: "",
    remainningAmount: "",
    PromizeDate: "",
    description: "",
    billStatus: "",
    totalIncome: "",
    incomeAsPercentage: "",
    unloadedDate: "",
    status: "",
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  });
  const [isLoadDataEditable, setIsLoadDataEditable] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loadData, setLoadData] = useState({
    dateAndTime: { editable: false, bpMD: 3 },
    cusName: { editable: false, bpMD: 3 },
    cusNIC: { editable: false, bpMD: 3 },
    cusPhoneNumber: { editable: false, bpMD: 3 },
    cusPhoneNumber: { editable: false, bpMD: 3 },
    totalAmount: { editable: false, bpMD: 3 },
    advance: { editable: false, bpMD: 3 },
    remainningAmount: { editable: false, bpMD: 3 },
    PromizeDate: { editable: false, bpMD: 3 },
    billStatus: { editable: false, bpMD: 3 },
    status: { editable: false, bpMD: 3 },
    createdBy: { editable: false, bpMD: 3 },
    modifiedBy: { editable: false, bpMD: 3 },
    cusAddress: { editable: false, bpMD: 6 },
    description: { editable: false, bpMD: 6 },
  });
  const columns = [
    { field: "categoryId_fk", headerName: "Category ID", width: 120 },
    { field: "timberType", headerName: "Timber Type", width: 120 },
    { field: "timberNature", headerName: "Nature", width: 150 },
    {
      field: "dimensions",
      headerName: "Dimensions",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.areaLength} x ${row.areaWidth}`;
      },
    },
    { field: "woodLength", headerName: "Length", width: 150 },
    {
      field: "availablePiecesAmount",
      headerName: "Available Amount",
      width: 120,
    },
    {
      field: "neededPiecesAmount",
      headerName: "Needed Amount",
      width: 120,
    },
    { field: "unitPrice", headerName: "Unit Price", width: 120 },
    { field: "discountPrice", headerName: "Discount Price", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.isComplete == false && (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setComplete(true);
                setWoodLength(params.row.woodLength);
                setCategoryId(params.row.categoryId_fk);
                setTobeCompleteAmount(params.row.neededPiecesAmount);
                setToBeCompleteOrder(params.row.id);
              }}
            >
              Complete
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getbillDetailsById(billId);
        setCategoryData(data);
        const loadData = await getorderIdByBillId(billId);
        processLoadData(loadData);
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error
      }
    };

    fetchData();
  }, [billId]);


  useEffect(() => {
    const completeTimberStock = async () => {
      try {
        const activeData = await getActiveStockSummaryDetails(categoryId, woodLength);
        if (activeData != null) {
          // Check if total pieces in stock are sufficient
          if (Number(activeData.totalPieces) - Number(tobeCompleteAmount) < 0) {
            toast.error("Insufficient stock to complete the wood order!!");
          } 
          else {
            // Check if to-be-cut amount is sufficient
            if (Number(activeData.toBeCutAmount) - Number(tobeCompleteAmount) < 0) {
              toast.error("Order amount cannot go negative after processing!!");
            } 
            else {
              // Update the stock summary details to mark it as completed
              const stockUpdateData = {
                status: "D",  // D for completed
                modifiedBy: user.displayName,
                modifiedDate: currentDateTime
              };
              await updateStockSummaryDetails(activeData.id, stockUpdateData);

              const catogoryDatat = await getCategoryById(activeData.categoryId_fk);
              if(catogoryDatat == null){
                toast.error("Invalid category:!!");
              }

              // Create new stock summary with updated details
              const stockSumData = {
                totalPieces: Number(activeData.totalPieces) - Number(tobeCompleteAmount),
                changedAmount: tobeCompleteAmount,
                previousAmount: activeData.totalPieces,
                categoryId_fk: activeData.categoryId_fk,
                maxlength : catogoryDatat.minlength,
                minlength : catogoryDatat.minlength,
                timberNature : catogoryDatat.timberNature,
                timberType : catogoryDatat.timberType,
                areaLength : catogoryDatat.areaLength,
                areaWidth : catogoryDatat.areaWidth,
                length: activeData.length,
                toBeCutAmount: Number(activeData.toBeCutAmount) - Number(tobeCompleteAmount),
                stk_id_fk: "completedOrder",
                status: "A",
                billId_fk: "completedOrder",
                createdBy: user.displayName,
                createdDate: currentDateTime
              };
  
              const newStockSummaryData = await createStockSummary(stockSumData);
  
              // If the new stock summary was created successfully, update the order
              if (newStockSummaryData) {
                const orderUpdateData = {
                  tobeCut: 0,
                  isComplete: true,
                  modifiedBy: user.displayName,
                  modifiedDate: currentDateTime
                };
                await updateorder(toBeCompleteOrder, orderUpdateData);
                toast.success("Order updated successfully!!");
  
                // Navigate to the bill view page
                navigate(`/bill/view/${billId}`);
              }
            }
          }
        } else {
          console.error("No active stock data for the given category:", categoryId);
        }
      } catch (error) {
        console.error("Error fetching category data:", error.message);
        // Handle error appropriately
      }
    };
  
    completeTimberStock();
  }, [complete, tobeCompleteAmount, woodLength, categoryId]);
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    //TODO: handle update load
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };


  async function processLoadData(loadData) {
    if (Array.isArray(loadData)) {
      const updatedCategories = await Promise.all(
        loadData.map(async item => {
          const categoryDetails = await getCategoryById(item.categoryId_fk);
          return {
            ...item, // Destructure the original item
            timberType: categoryDetails.timberType,
            timberNature: categoryDetails.timberNature,
            areaLength: categoryDetails.areaLength,
            areaWidth: categoryDetails.areaWidth,
            unitPrice: categoryDetails.unitPrice,
            categoryId_fk: item.categoryId_fk,
          };
        })
      );
      setCategories(updatedCategories);
    } else {
      throw new Error("Invalid data format received from API");
    }
  }
  console.log("🚀 ~ ViewBillDetails ~ loadData.billStatus:", categoryData)
  console.log(
    "🚀 ~ ViewBillDetails ~ loadData.billStatus:",
    categories.map((item) => ({
      categoryId: item.categoryId_fk,
      length: item.areaLength,
      amount: item.neededPiecesAmount,
    }))
  );
  const onClickUpdate = (event) => {
    event.preventDefault();
    navigate(`/bill/update/wood`, {
      state: {
        payloadBulkFromUpdate: categories.map((item) => ({
          categoryId: item.categoryId_fk,
          length: item.areaLength,
          amount: item.neededPiecesAmount,
        })),
        currentCategoriesData: categories,
        currentLoadData: loadData,
      },
    });
  };


  return (
    <>
      <Grid container>
        <Grid item xs={12} p={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography variant="h4" color="primary" align="center">
              Bill & Order details
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} padding={2}>
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
                  Bill details
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
                  <FormLabel>
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </FormLabel>
                  {!isLoadDataEditable || !item.editable ? (
                    <Typography color={"primary"} variant="h6">
                      {categoryData[key]}
                    </Typography>
                  ) : (
                    <OutlinedInput
                      size="small"
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
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                {/* TODO: change title */}
                <Typography variant="h6" color="primary" align="center">
                  Order details
                </Typography>
                <Button
                  startIcon={<EditIcon />} // Changed icon to indicate an update
                  onClick={onClickUpdate}
                  variant="outlined"
                  justifyContent="flex-end"
                  disabled={categoryData.billStatus !== "ORDER"}
                >
                  Update Timber
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} padding={1}>
              <DataGrid
                rows={categories}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 8,
                    },
                  },
                }}
                pageSizeOptions={[8]}
                disableRowSelectionOnClick
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewBillDetails;
