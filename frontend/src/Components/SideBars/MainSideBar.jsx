import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse } from "@mui/material";
import sawMillLogo from "../../assets/images/sawMillLogo.png";
import { Link, useLocation } from "react-router-dom";
import Theme from "../../Theme/Theme";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function MainSideBar() {
  const location = useLocation();

  const isSelected = (path) => {
    return location.pathname.includes(path);
  };
  const primaryColor = Theme.palette.primary.main;
  const mainBgS1 = Theme.palette.primary.mainBgS1;
  const secondaryColor = "text.secondary";
  const [openInventory, setOpenInventory] = React.useState(true);
  const [openFinace, setOpenFinace] = React.useState(true);

  const handleInventoryClick = () => {
    setOpenInventory(!openInventory);
  };
  const handleFinaceClick = () => {
    setOpenFinace(!openFinace);
  };
  return (
    <Box
      sx={{
        bgcolor: "background.default",
      }}
    >
      <List sx={{ paddingX: 2 }}>
        <ListItemButton component={Link} to={"/price"}>
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
        <ListItemButton component={Link} to={"/employee"}>
          <ListItemIcon
            sx={{
              color: isSelected("/employee") ? primaryColor : secondaryColor,
            }}
          >
            <BadgeIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color: isSelected("/employee") ? primaryColor : secondaryColor,
            }}
            primary="Employee"
          />
        </ListItemButton>
        <ListItemButton onClick={handleInventoryClick}>
          <ListItemIcon
            sx={{
              color:
                isSelected("/load") || isSelected("/stock")
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
                isSelected("/load") || isSelected("/stock")
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
            <ListItemButton component={Link} to={"/stock"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Stock"
                primaryTypographyProps={{
                  color: isSelected("/stock") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton>
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
        <ListItemButton onClick={handleFinaceClick}>
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
        <Collapse in={openFinace} timeout="auto" unmountOnExit>
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
        <ListItemButton>
          <ListItemIcon
            sx={{
              color: isSelected("/Report") ? primaryColor : secondaryColor,
            }}
          >
            <AssessmentOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            sx={{ marginLeft: "-18px" }}
            primaryTypographyProps={{
              color: isSelected("/Report") ? primaryColor : secondaryColor,
            }}
            primary="Report and Summary"
          />
        </ListItemButton>
      </List>
    </Box>
  );
}
