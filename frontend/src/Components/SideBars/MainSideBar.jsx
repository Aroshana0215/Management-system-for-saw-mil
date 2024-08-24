import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Theme from "../../Theme/Theme";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

export default function MainSideBar() {
  const location = useLocation();

  const isSelected = (path) => {
    return location.pathname.includes(path);
  };
  const primaryColor = Theme.palette.primary.main;
  const secondaryColor = "text.secondary";
  const [openInventory, setOpenInventory] = React.useState(true);
  const [openEmployee, setOpenEmployee] = React.useState(true);
  const [openFinance, setOpenFinance] = React.useState(true);
  const [openReport, setOpenReport] = React.useState(true);

  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };
  const handleFinanceClick = () => {
    setOpenFinance(!openFinance);
  };
  const handleEmployeeClick = () => {
    setOpenEmployee(!openEmployee);
  };
  const handleReportClick = () => {
    setOpenReport(!openReport);
  };
  return (
    <Box
      sx={{
        bgcolor: "background.default",
      }}
    >
      <List dense sx={{ paddingX: 2 }}>
        <ListItemButton
          component={Link}
          to={"/price"}
          selected={isSelected("/price")}
        >
          <ListItemIcon
            sx={{
              color: isSelected("/price") ? primaryColor : secondaryColor,
            }}
          >
            <PriceChangeOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Timber Prices"
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color: isSelected("/price") ? primaryColor : secondaryColor,
            }}
          />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to={"/bill"}
          selected={isSelected("/bill")}
        >
          <ListItemIcon
            sx={{
              color: isSelected("/bill") ? primaryColor : secondaryColor,
            }}
          >
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color: isSelected("/bill") ? primaryColor : secondaryColor,
            }}
            primary="Bill and Order"
          />
        </ListItemButton>


        <ListItemButton
          onClick={handleEmployeeClick}
          selected={isSelected("/employee") || isSelected("/employee/daily")}
        >
          <ListItemIcon
            sx={{
              color:
                isSelected("/employee") || isSelected("/employee/daily")
                  ? primaryColor
                  : secondaryColor,
            }}
          >
            <BadgeIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color:
                isSelected("/employee") || isSelected("/employee/daily")
                  ? primaryColor
                  : secondaryColor,
            }}
            primary="Emplyee"
          />
        </ListItemButton>
        <Collapse in={openEmployee} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            <ListItemButton component={Link} to={"/employee"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Employee Details"
                primaryTypographyProps={{
                  color: isSelected("/employee") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
            <ListItemButton component={Link} to={"/employee/daily"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Daily Records"
                primaryTypographyProps={{
                  color: isSelected("/employee/daily") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          onClick={handleInventoryClick}
          selected={isSelected("/load") || isSelected("/activeStock")}
        >
          <ListItemIcon
            sx={{
              color:
                isSelected("/load") || isSelected("/activeStock")
                  ? primaryColor
                  : secondaryColor,
            }}
          >
            <Inventory2OutlinedIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color:
                isSelected("/load") || isSelected("/activeStock")
                  ? primaryColor
                  : secondaryColor,
            }}
            primary="Inventory"
          />
        </ListItemButton>
        <Collapse in={openInventory} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            <ListItemButton component={Link} to={"/load"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Load"
                primaryTypographyProps={{
                  color: isSelected("/load") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
            <ListItemButton component={Link} to={"/activeStock"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Stock"
                primaryTypographyProps={{
                  color: isSelected("/activeStock") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton selected={isSelected("/Machine")}>
          <ListItemIcon
            sx={{
              color: isSelected("/Machine") ? primaryColor : secondaryColor,
            }}
          >
            <PrecisionManufacturingOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color: isSelected("/Machine") ? primaryColor : secondaryColor,
            }}
            primary="Machine"
          />
        </ListItemButton>
        <ListItemButton
          onClick={handleFinanceClick}
          selected={isSelected("/income") || isSelected("/exp")}
        >
          <ListItemIcon
            sx={{
              color:
                isSelected("/income") || isSelected("/exp")
                  ? primaryColor
                  : secondaryColor,
            }}
          >
            <AccountBalanceOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color:
                isSelected("/income") || isSelected("/exp")
                  ? primaryColor
                  : secondaryColor,
            }}
            primary="Finance"
          />
        </ListItemButton>
        <Collapse in={openFinance} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            <ListItemButton component={Link} to={"/income"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Income"
                primaryTypographyProps={{
                  color: isSelected("/income") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
            <ListItemButton component={Link} to={"/exp"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Expenses"
                primaryTypographyProps={{
                  color: isSelected("/exp") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>



        <ListItemButton
          onClick={handleReportClick}
          selected={isSelected("/income") || isSelected("/exp")}
        >
          <ListItemIcon
            sx={{
              color:
                isSelected("/income") || isSelected("/exp")
                  ? primaryColor
                  : secondaryColor,
            }}
          >
            <AccountBalanceOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color:
                isSelected("/stockSummary") || isSelected("/exp")
                  ? primaryColor
                  : secondaryColor,
            }}
            primary="Report and Summary"
          />
        </ListItemButton>
        <Collapse in={openReport} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            <ListItemButton component={Link} to={"/stockSummary"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="stock summary"
                primaryTypographyProps={{
                  color: isSelected("/stockSummary") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
            <ListItemButton component={Link} to={"/exp"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Expenses"
                primaryTypographyProps={{
                  color: isSelected("/exp") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}
