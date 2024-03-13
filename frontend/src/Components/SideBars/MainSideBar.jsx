import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
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

  const handleClick = () => {
    setOpenInventory(!openInventory);
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "xsm",
        bgcolor: Theme.palette.primary.mainBgS1,
      }}
    >
      <Box component={Link} to={"/"} paddingX={2}>
        <img alt="Logo" src={sawMillLogo} width={60} />
      </Box>
      <List dense>
        <ListItem
          sx={{
            borderLeft: isSelected("/price")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
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
                fontWeight: isSelected("/price") ? "bold" : "normal",
                color: isSelected("/price") ? primaryColor : secondaryColor,
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/bill")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
          <ListItemButton component={Link} to={"/bill"}>
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
                fontWeight: isSelected("/bill") ? "bold" : "normal",
                color: isSelected("/bill") ? primaryColor : secondaryColor,
              }}
              primary="Bill and Order"
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/employee")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
          <ListItemButton>
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
                fontWeight: isSelected("/employee") ? "bold" : "normal",
                color: isSelected("/employee") ? primaryColor : secondaryColor,
              }}
              primary="Employee Management"
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/Inventory")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon
              sx={{
                color: isSelected("/Inventory") ? primaryColor : secondaryColor,
              }}
            >
              <Inventory2OutlinedIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ marginLeft: "-18px" }}
              primaryTypographyProps={{
                fontWeight:
                  isSelected("/load") || isSelected("/stock")
                    ? "bold"
                    : "normal",
                color:
                  isSelected("/load") || isSelected("/stock")
                    ? primaryColor
                    : secondaryColor,
              }}
              primary="Inventory Management"
            />
            {openInventory ? (
              <ExpandLess
                sx={{
                  color:
                    isSelected("/load") || isSelected("/stock")
                      ? primaryColor
                      : secondaryColor,
                }}
              />
            ) : (
              <ExpandMore
                sx={{
                  color:
                    isSelected("/load") || isSelected("/stock")
                      ? primaryColor
                      : secondaryColor,
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={openInventory} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            <ListItemButton sx={{ pl: 3 }} component={Link} to={"/load"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Load Management"
                primaryTypographyProps={{
                  color: isSelected("/load") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
            <ListItemButton sx={{ pl: 3 }} component={Link} to={"/stock"}>
              <ListItemIcon></ListItemIcon>
              <ListItemText
                primary="Stock Management"
                primaryTypographyProps={{
                  color: isSelected("/stock") ? primaryColor : secondaryColor,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItem
          sx={{
            borderLeft: isSelected("/Machine")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
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
                fontWeight: isSelected("/Machine") ? "bold" : "normal",
                color: isSelected("/Machine") ? primaryColor : secondaryColor,
              }}
              primary="Machine management"
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/Account")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
          <ListItemButton>
            <ListItemIcon
              sx={{
                color: isSelected("/Account") ? primaryColor : secondaryColor,
              }}
            >
              <AccountBalanceOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ marginLeft: "-18px" }}
              primaryTypographyProps={{
                fontWeight: isSelected("/Account") ? "bold" : "normal",
                color: isSelected("/Account") ? primaryColor : secondaryColor,
              }}
              primary="Finance management"
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/User")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
          <ListItemButton>
            <ListItemIcon
              sx={{
                color: isSelected("/User") ? primaryColor : secondaryColor,
              }}
            >
              <ManageAccountsOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              sx={{ marginLeft: "-18px" }}
              primaryTypographyProps={{
                fontWeight: isSelected("/User") ? "bold" : "normal",
                color: isSelected("/User") ? primaryColor : secondaryColor,
              }}
              primary="User management"
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          sx={{
            borderLeft: isSelected("/Report")
              ? ` solid 2px ${primaryColor}`
              : ` solid 2px ${mainBgS1}`,
          }}
        >
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
                fontWeight: isSelected("/Report") ? "bold" : "normal",
                color: isSelected("/Report") ? primaryColor : secondaryColor,
              }}
              primary="Report and Summary"
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
