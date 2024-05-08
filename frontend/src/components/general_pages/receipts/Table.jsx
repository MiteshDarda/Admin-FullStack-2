import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IconButton, Menu, MenuItem } from "@mui/material";
import FilterForm from "./FilterForm";
import { buttonBlue } from "../../../utils/colors/colors";
import Asynchronous from "../../reusable/AutoComplete";
import { useRouteLoaderData } from "react-router-dom";
import Designation from "../../../utils/designation/designation";
import MonthPickerModal from "./MonthPickerModal";
import getReceipts from "../../../api/receipts/getReceipts";
import CircularProgress from "@mui/material/CircularProgress";
import { formatDate } from "../../../utils/getTime";
import Invoice from "./Invoice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getBankDetails } from "../../../api/users/bankDetails";
import MonthlyTaskModal from "./MonthlyTaskModal";

const columns = [
  { id: "taskId", label: "Task Id" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  {
    id: "amount",
    label: "Amount",
  },
  {
    id: "completedOn",
    label: "Completed On",
  },
  {
    id: "download",
    label: "",
  },
];

// Get the current month and year
function getCurrentMonthDates() {
  // Get the current date
  let currentDate = new Date();

  // Calculate the first day of the current month
  let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Calculate the last day of the current month
  let lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // Format the dates as strings in the desired format
  const firstDateString = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, "0")}-${String(firstDay.getDate()).padStart(2, "0")}T12:20:23.000Z`;
  const lastDateString = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}T12:20:23.000Z`;

  // Concatenate the dates with a space in between
  return `${firstDateString} ${lastDateString}`;
}

const currentMonthYear =getCurrentMonthDates();

export default function StickyHeadTable(props) {
  const loaderData = useRouteLoaderData("root");
  const [month, setMonth] = useState(currentMonthYear);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState(loaderData.decodedToken.email);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const response = await getBankDetails(loaderData.token);
    if (response?.status === 200) {
      const userData = response.data;
      userData.name = localStorage.getItem("name");
      userData.email = localStorage.getItem("email");
      setPeople([userData]);
    }
  };

  const getUserReceipts = async () => {
    try {
      setLoading(true);
      const response = await getReceipts(
        loaderData.token,
        email,
        searchQuery,
        month.split(" ")[0],
        month.split(" ")[1],
      );
      if (response.status === 201) {
        setRows(response.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserReceipts();
  }, [month, email]);

  useEffect(() => {
    if (searchQuery === "") getUserReceipts();
  }, [searchQuery]);

  const openn = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    getUserReceipts();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setMonth(currentMonthYear);
    getUserReceipts();
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="bg-white items-center flex p-[12px] justify-end gap-3 rounded-t-[8px] border-2">
          <div className="mr-auto">
            {loaderData.decodedToken.designation === Designation.SUPER_ADMIN ||
            loaderData.decodedToken.designation === Designation.ADMIN ? (
              <Asynchronous setEmail={setEmail} setPeople={setPeople} />
            ) : (
              <></>
            )}
          </div>
          <IconButton
            // disabled={loading}
            onClick={handleRefresh}
            sx={{
              color: "green",
              "&:focus": {
                outline: "none",
                border: "none",
              },
              "&:hover": {
                backgroundColor: "green",
                color: "white", // Adjust the color as needed
              },
            }}
          >
            <RefreshIcon
              sx={{
                color: "inherit",
                "&:hover": {
                  color: "inherit", // Adjust the color as needed
                },
              }}
            />
          </IconButton>
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            sx={{ paddingRight: 0 }}
            type="text"
            className="h-[42px] p-2 rounded-md border-2 border-gray-400 bg-gray-50 align-middle"
            endAdornment={
              <InputAdornment position="start">
                <IconButton
                  // disabled={loading}
                  type="submit"
                  sx={{
                    color: buttonBlue,
                    "&:focus": {
                      outline: "none",
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: buttonBlue,
                      color: "white", // Adjust the color as needed
                    },
                  }}
                >
                  <SearchIcon
                    sx={{
                      color: "inherit",
                      "&:hover": {
                        color: "inherit", // Adjust the color as needed
                      },
                    }}
                  />
                </IconButton>
              </InputAdornment>
            }
            placeholder="search"
          ></Input>

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
            sx={{ color: "#006eff", marginLeft: ".5rem" }}
          >
            <FilterAltIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            sx={{ margin: 0, padding: 0 }}
            anchorEl={anchorEl}
            open={openn}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem disableRipple disableTouchRipple sx={{ margin: 0 }}>
              <FilterForm setMonth={setMonth} />
            </MenuItem>
          </Menu>
        </div>
      </form>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => {
                return (
                  <TableRow hover role="checkbox" key={i}>
                    {columns.map((column) => {
                      let value;
                      if (column.id === "taskId") value = row.tasks.id;
                      else if (column.id === "name") value = row.user.name;
                      else if (column.id === "email") value = row.user.email;
                      else if (column.id === "amount")
                        value = row.userTask.price;
                      else if (column.id === "completedOn")
                        value = formatDate(row.userTask.completedOn);
                      else value = "HELLO";
                      // const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "download" ? (
                            <PDFDownloadLink
                              document={<Invoice data={[row]} />}
                              fileName="invoice.pdf"
                            >
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  console.log("clicked");
                                }}
                              >
                                <DownloadForOfflineIcon
                                  sx={{ color: "#006eff", cursor: "pointer" }}
                                />
                                <span
                                  style={{
                                    marginLeft: "5px",
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                >
                                  Download
                                </span>
                              </motion.div>
                            </PDFDownloadLink>
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {loading ? (
          <div className="p-1 flex justify-center ">
            <CircularProgress />
          </div>
        ) : (
          <></>
        )}
      </Paper>
      <MonthPickerModal
        state={props.state}
        setState={props.setState}
        month={month}
        setMonth={setMonth}
        data={rows}
        loading={loading}
        people={people}
        email={email}
      />
      <MonthlyTaskModal
        state={props.monthlyTask}
        setState={props.setMonthlyTask}
        month={month}
        setMonth={setMonth}
        data={rows}
        loading={loading}
      />
    </>
  );
}
