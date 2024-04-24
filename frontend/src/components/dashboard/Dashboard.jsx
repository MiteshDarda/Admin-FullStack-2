import { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsNoneSharpIcon from "@mui/icons-material/NotificationsNoneSharp";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Outlet, useNavigate } from "react-router-dom";
import Logout from "../../utils/logout";
import AdminIcons from "./AdminIcons";
import VerifiedIcons from "./GeneralIcons";
import Alert from "@mui/material/Alert";
import { jwtDecode } from "jwt-decode";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import Designation from "../../utils/designation/designation";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const user = useSelector((state) => state.users);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    if (
      decode.designation === Designation.SUPER_ADMIN ||
      decode.designation === Designation.ADMIN ||
      decode.designation === Designation.LEADER  ||
      decode.designation === Designation.MANAGER
    )
      setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (alertMessage !== "") {
      setTimeout(() => {
        setAlertMessage("");
        setSeverity("success");
      }, 5000);
    }
  }, [alertMessage]);

  const openn = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logoutHandler = () => {
    handleClose();
    Logout(navigate);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            eTeam Manage
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ marginLeft: "auto", marginRight: "30px" }}
          >
            {/* <NotificationsNoneSharpIcon /> */}
          </IconButton>
          <IconButton
            id="basic-button"
            aria-controls={openn ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openn ? "true" : undefined}
            onClick={handleClick}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <Avatar sx={{ bgcolor: "black", textTransform: "capitalize" }}>
              {user.name[0]}
            </Avatar>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openn}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
            >
              Bank Details
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/passwordChange");
              }}
            >
              Change Password
            </MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <VerifiedIcons />
        <Divider />
        <Typography
          variant="h7"
          sx={{
            pl: 2,
            textAlign: "left",
            mt: 1,
            color: "gray",
            opacity: open ? 1 : 0,
          }}
        >
          {/* MODERATION */}
        </Typography>
        {isAdmin ? <AdminIcons /> : <></>}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 5,
        }}
        padding={0}
        className="pad-none"
      >
        {alertMessage && (
          <div
            style={{
              position: "fixed",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10000,
            }}
          >
            <Alert variant="filled" severity={severity}>
              {alertMessage}
            </Alert>
          </div>
        )}
        <Outlet context={[setAlertMessage, setSeverity]} />
      </Box>
    </Box>
  );
}
