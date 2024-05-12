import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const VerifiedIcons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List>
      <ListItem key={"Dashboard"} disablePadding sx={{ display: "block" }}>
        <Tooltip title={"Dashboard"}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() => navigate("/")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: `${location.pathname.split("/")[1] === "" ? "#218aff" : "black"}`,
              }}
            >
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Dashboard"}
              sx={{
                opacity: open ? 1 : 0,
                color: `${location.pathname.split("/")[1] === "" ? "#218aff" : "black"}`,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>

      <ListItem key={"Receipts"} disablePadding sx={{ display: "block" }}>
        <Tooltip title={"Receipts"}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() => navigate("/receipts")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: `${location.pathname.split("/")[1] === "receipts" ? "#218aff" : "black"}`,
              }}
            >
              <ReceiptLongOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Receipts"}
              sx={{
                opacity: open ? 1 : 0,
                color: `${location.pathname.split("/")[1] === "receipts" ? "#218aff" : "black"}`,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>

      <ListItem key={"Tasks"} disablePadding sx={{ display: "block" }}>
        <Tooltip title={"Tasks"}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() => navigate("/tasks")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: `${location.pathname.split("/")[1] === "tasks" ? "#218aff" : "black"}`,
              }}
            >
              <FormatListNumberedOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Tasks"}
              sx={{
                opacity: open ? 1 : 0,
                color: `${location.pathname.split("/")[1] === "tasks" ? "#218aff" : "black"}`,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>

      <ListItem key={"Leadership"} disablePadding sx={{ display: "block" }}>
        <Tooltip title={"Leadership"}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() => navigate("/leadership")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: `${location.pathname.split("/")[1] === "leadership" ? "#218aff" : "black"}`,
              }}
            >
              <SignalCellularAltOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Leadership"}
              sx={{
                opacity: open ? 1 : 0,
                color: `${location.pathname.split("/")[1] === "leadership" ? "#218aff" : "black"}`,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>

      <ListItem key={"Payout"} disablePadding sx={{ display: "block" }}>
        <Tooltip title={"Payout"}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
            onClick={() => navigate("/chat")}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: `${location.pathname.split("/")[1] === "chat" ? "#218aff" : "black"}`,
              }}
            >
              <ChatIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Chat"}
              sx={{
                opacity: open ? 1 : 0,
                color: `${location.pathname.split("/")[1] === "chat" ? "#218aff" : "black"}`,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>
    </List>
  );
};
export default VerifiedIcons;
