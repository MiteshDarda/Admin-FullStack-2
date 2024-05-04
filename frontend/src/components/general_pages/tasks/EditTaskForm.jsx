import {
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { buttonBlue } from "../../../utils/colors/colors";
import { useEffect, useState } from "react";
import assignUser from "../../../api/tasks/assignUser";
import Logout from "../../../utils/logout";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmDelete from "../../reusable/modal/confirmDelete";
import deleteUserFromTask from "../../../api/tasks/deleteUserFromTask";
import { usersThatCanBeAssignedTask } from "../../../utils/designation/designation";
import AutoComplete from "../../reusable/AutoComplete";
import formatDesignation from "../../../utils/formatDesignation";

const columns = [
  { id: "id", label: "Id" },
  { id: "currency", label: "Currency" },
  { id: "price", label: "Price" },
  {
    id: "assignedRole",
    label: "Designation",
  },
  {
    id: "assignedToEmail",
    label: "Email",
  },
];

const designations = usersThatCanBeAssignedTask;

const currencies = [
  {
    value: "$",
    label: "$",
  },
  {
    value: "₹",
    label: "₹",
  },
];
const estimateWidth = (label) => {
  // Assuming an average character width of 9px
  const charWidth = 9;
  return label.length * charWidth;
};

const EditTaskForm = (props) => {
  const [currency, setCurrency] = useState("₹");
  const [price, setPrice] = useState(0);
  const [designation, setDesignation] = useState("video_editor");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");

  const location = useLocation();
  const path = location.pathname.split("/");
  const user = useSelector((state) => state.users);
  const [setAlertMessage, setSeverity] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setRows(props.rows);
  }, [props]);

  const addRow = (id) => {
    setRows((prevRow) => {
      return [
        ...prevRow,
        {
          id,
          currency,
          price,
          assignedRole: designation,
          assignedToEmail: email,
        },
      ];
    });
  };

  const deleteAssignedUser = async () => {
    console.log(userToDelete);
    try {
      const response = await deleteUserFromTask(user.token, userToDelete);
      if (response.status === 200) {
        setAlertMessage("User removed from task successfully.");
        setRows((prev) => {
          return prev.filter((user) => {
            return user.id !== userToDelete;
          });
        });
      } else if (response.status === 401) {
        Logout(navigate);
      } else {
        setSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (e) {
      setSeverity("warning");
      setAlertMessage("Unexpected Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    if (email.trim() === "") {
      setError(true);
      return;
    } else {
      try {
        setLoading(true);
        const response = await assignUser(
          user.token,
          path[2],
          currency,
          price,
          designation,
          email,
        );
        if (response.status === 201) {
          addRow(response.data.id);
          setPrice(0);
          // setEmail("");
          setAlertMessage("User Assigned Successfully.");
        } else if (response.status === 401) Logout(navigate);
        else {
          setSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (e) {
        setSeverity("warning");
        setAlertMessage("Unexpected error occured");
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Paper elevation={3} sx={{ p: 4, mb: 4, width: "100%" }}>
        <Grid container spacing={2}>
          <form onSubmit={handleSubmit}>
            <Grid item xs={12} sx={{ display: "flex", gap: 4 }}>
              {/* Currency */}
              <Grid>
                <TextField
                  label="Currency"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                  }}
                  sx={{ width: 1.25 * estimateWidth("Currency") }}
                  select
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* price */}
              <Grid>
                <TextField
                  label="Price"
                  type="number"
                  sx={{ width: 150 }}
                  inputProps={{
                    min: 0,
                    max: 10000000,
                    onKeyDown: (e) => {
                      if (e.key === "e" || e.key === "E") {
                        e.preventDefault();
                      }
                    },
                  }}
                  value={price}
                  onChange={(e) => {
                    if (
                      e.target.value.includes("e") ||
                      e.target.value.includes("E")
                    ) {
                      console.log("e");
                    }
                    setPrice(e.target.value);
                  }}
                />
              </Grid>

              {/* Designation  */}
              <Grid>
                <TextField
                  select
                  onChange={(e) => {
                    setDesignation(e.target.value);
                  }}
                  label="Designation"
                  value={designation}
                  sx={{ width: 1.5 * estimateWidth("Designation") }}
                >
                  {designations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid>
                <AutoComplete setEmail={setEmail} />
              </Grid>

              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  disabled={loading}
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: buttonBlue,
                    "&:hover": { bgcolor: buttonBlue },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={32} sx={{ color: "white" }} />
                  ) : (
                    <AddIcon sx={{ fontSize: "32px", color: "white" }} />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          </form>

          <Grid item xs={12} sx={{ marginTop: "1rem" }}>
            <Paper
              elevation={4}
              sx={{ width: "100%", overflow: "auto", borderRadius: "20px" }}
            >
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          sx={{ fontWeight: 600, backgroundColor: "#f3f4f6" }}
                          key={column.id}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                      <TableCell
                        sx={{ fontWeight: 600, backgroundColor: "#f3f4f6" }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => {
                      return (
                        <TableRow hover role="checkbox" key={i}>
                          {columns.map((column) => {
                            let value = row[column.id];
                            if (column.id === "assignedRole") {
                              value = formatDesignation(value);
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setConfirmDelete(true);
                                setUserToDelete(row.id);
                              }}
                            >
                              <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <ConfirmDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        content={"Are you sure you want to remove this user from the task?"}
        delete={deleteAssignedUser}
      />
    </>
  );
};

export default EditTaskForm;
