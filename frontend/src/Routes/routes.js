import React, { useEffect } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Landing from "../Views/Main/Landing";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reset } from "../Redux/features/auth/authSlice";
import AuthLayout from "../Layouts/AuthLayout";
import Register from "../Views/Auth/Register";
import Login from "../Views/Auth/Login";
import PriceCardList from "../Views/PriceCard/PriceCardList";
import CreateCategory from "../Views/PriceCard/CreateCategory";
import UpdateCategory from "../Views/PriceCard/UpdateCategory";
import LoadDetailList from "../Views/InventoryManagement/LoadManagement/LoadDetailList";
import CreateNewLoadRec from "../Views/InventoryManagement/LoadManagement/CreateNewLoadRec";
import AddLoadRelatedTimber from "../Views/InventoryManagement/LoadManagement/AddLoadRelatedTimber";
import ViewLoadAndRelatedTimber from "../Views/InventoryManagement/LoadManagement/ViewLoadAndRelatedTimber";
import StockList from "../Views/InventoryManagement/StockManagement/StockList";
import CreateNewStock from "../Views/InventoryManagement/StockManagement/CreateStock";
import ViewStockDetail from "../Views/InventoryManagement/StockManagement/ViewStockDetail";
import BillDetailList from "../Views/BillAndOrderManagement/BillDetailList";
import StockSummaryList from "../Views/InventoryManagement/StockManagement/StockSummaryList";
import GetWantsWood from "../Views/BillAndOrderManagement/GetWantsWoodAmount";
import ShowRemainWood from "../Views/BillAndOrderManagement/ShowRemainWood";
import CreateNewBill from "../Views/BillAndOrderManagement/CreateNewBill";
import ViewBillDetails from "../Views/BillAndOrderManagement/ViewBillDetails";
import StockHistory from "../Views/BillAndOrderManagement/StockHistory";
import EmployeeList from "../Views/EmployeeManagement/EmployeeDetailsManagment/EmployeeList";
import EPaymentList from "../Views/EmployeeManagement/EmployeeDetailsManagment/EmployeePaymentList";
import CreateEmployee from "../Views/EmployeeManagement/EmployeeDetailsManagment/CreateEmployee";
import DailyDetailList from "../Views/EmployeeManagement/EmployeeDailyRecordsManagment/DailyDetailList";
import CreateDailyDetails from "../Views/EmployeeManagement/EmployeeDailyRecordsManagment/CreateDailyDetails";
import EmpDependatnt from "../Views/EmployeeManagement/EmployeeDetailsManagment/CreateEmpDependants";
import CreatePayment from "../Views/EmployeeManagement/EmployeeDetailsManagment/CreatePayment";
import IncomeList from "../Views/AccountManagement/IncomeManagement/IncomeList";
import AddIncome from "../Views/AccountManagement/IncomeManagement/AddIncome";
import ExpList from "../Views/AccountManagement/ExpenseManagemnt/ExpList";
import AddExp from "../Views/AccountManagement/ExpenseManagemnt/AddExp";

const privateRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/price",
        element: <PriceCardList />,
      },
      {
        path: "/price/add",
        element: <CreateCategory />,
      },
      {
        path: "/price/update/:categoryId",
        element: <UpdateCategory />,
      },
      {
        path: "/load",
        element: <LoadDetailList />,
      },
      {
        path: "/load/add",
        element: <CreateNewLoadRec />,
      },
      {
        path: "/load/timber/add/:loadId",
        element: <AddLoadRelatedTimber />,
      },
      {
        path: "/load/timber/view/:loadId",
        element: <ViewLoadAndRelatedTimber />,
      },
      {
        path: "/stock",
        element: <StockList />,
      },
      {
        path: "/stock/add",
        element: <CreateNewStock />,
      },
      {
        path: "/stock/view/:stockId",
        element: <ViewStockDetail />,
      },
      {
        path: "/bill",
        element: <BillDetailList />,
      },
      {
        path: "/stockSummary",
        element: <StockSummaryList />,
      },
      {
        path: "/bill/wants/wood",
        element: <GetWantsWood />,
      },
      {
        path: "/bill/process/wood/:woodData",
        element: <ShowRemainWood />,
      },
      {
        path: "/bill/add/:orderData",
        element: <CreateNewBill />,
      },
      {
        path: "/bill/view/:billId",
        element: <ViewBillDetails />,
      },
      {
        path: "/stock/history",
        element: <StockHistory />,
      },
      {
        path: "/employee",
        element: <EmployeeList />,
      },
      {
        path: "/employee/payment/:eid",
        element: <EPaymentList />,
      },
      {
        path: "/employee/add",
        element: <CreateEmployee />,
      },
      {
        path: "/employee/daily",
        element: <DailyDetailList />,
      },
      {
        path: "/employee/daily/add",
        element: <CreateDailyDetails />,
      },
      {
        path: "/employee/dependatnt/:eid",
        element: <EmpDependatnt />,
      },
      {
        path: "/employee/payment/add/:eid",
        element: <CreatePayment />,
      },
      {
        path: "/income/add",
        element: <AddIncome />,
      },
      {
        path: "/income",
        element: <IncomeList />,
      },
      {
        path: "/exp",
        element: <ExpList />,
      },
      {
        path: "/exp/add",
        element: <AddExp />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
      
    ],
  },
]);
const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/auth/sign-in",
        element: <Login />,
      },
      {
        path: "/auth/sign-up/",
        element: <Register />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

const Router = () => {
  const { user, isError, isSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error("Oops! Login failed, try again");
    }

    dispatch(reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login success");
    }

    dispatch(reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return user ? (
    <RouterProvider router={privateRouter} />
  ) : (
    <RouterProvider router={authRouter} />
  );
};

export default Router;
