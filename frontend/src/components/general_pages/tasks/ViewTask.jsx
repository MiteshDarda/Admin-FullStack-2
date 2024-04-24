import {
  Grid,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import formatDesignation from "../../../utils/formatDesignation";
import Logout from "../../../utils/logout";
import getTask from "../../../api/tasks/getTask";
import {
  canApprove,
  canChat,
  usersThatCanBeAssignedTask,
} from "../../../utils/designation/designation";
import { buttonBlue } from "../../../utils/colors/colors";
import ApproveModal from "./ApproveModal";
import ConfirmComplete from "../../reusable/modal/confirmComplete";
import setTaskToCompleted from "../../../api/tasks/setTaskToCompleted";

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

const ViewTask = () => {
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [idToApprove, setIdToApprove] = useState("");
  const [roleApproved, setRoleApproved] = useState("");
  const [complete, setIsComplete] = useState(false);
  const [rows, setRows] = useState({});
  const [assigneesRow, setAssigneesRow] = useState([]);
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("Description ");
  const [estimatedTime, setEstimatedTime] = useState(
    new Date().toISOString().split("T")[0],
  );
  const user = useSelector((state) => state.users);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  const [setAlertMessage, setSeverity] = useOutletContext();

  const setProgress = (usersAssigned) => {
    const mapUsers = usersThatCanBeAssignedTask.reduce((acc, user) => {
      acc[user.value] = {
        completed: 0,
        total: 0,
      };
      return acc;
    }, {});

    usersAssigned.map((user) => {
      mapUsers[user.assignedRole].total++;
      mapUsers[user.assignedRole].completed += user.completed;
    });
    setRows(mapUsers);
  };

  const getTaskData = async () => {
    try {
      const response = await getTask(user.token, path[2]);
      if (response.status === 200) {
        if (response.data.task.isCompleted === 1) setIsComplete(true);
        setTitle(response.data.task.title);
        setDescription(response.data.task.description);
        // console.log(response.data.task.estimatedCompletion);
        setEstimatedTime(
          new Date(response.data.task.estimatedCompletion)
            .toISOString()
            .split("T")[0],
        );
        setAssigneesRow(response.data.usersAssigned);
        setProgress(response.data.usersAssigned);
      } else if (response.status === 401) Logout(navigate);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (user.token) getTaskData();
  }, [user]);

  const handleApprove = () => {
    setRows((prevState) => {
      return {
        ...prevState,
        [roleApproved]: {
          ...prevState[roleApproved],
          completed: prevState[roleApproved].completed + 1, // Increment the completed value
        },
      };
    });
    setAssigneesRow((prevState) => {
      return prevState.map((item) => {
        // Check if the item id matches the id to update
        if (item.id === idToApprove) {
          // Update the completed value to true
          return {
            ...item,
            completed: 1,
          };
        } else {
          // Return the item as is if the id doesn't match
          return item;
        }
      });
    });
  };

  const completeTask = async () => {
    try {
      const response = await setTaskToCompleted(user.token, path[2]);
      if (response.status === 200) {
        setAlertMessage("Task Completed.");
        setIsComplete(true);
      } else if (response.status === 401) Logout(navigate);
    } catch (e) {
      setSeverity("warning");
      setAlertMessage("Unexpected Error");
    }
  };

  return (
    <div className="p-[2rem] bg-gray-100 ">
      <h1 className="text-[32px] my-[1rem] font-bold">View Task</h1>
      <Paper elevation={3} sx={{ p: 4, mb: 4, width: "100%" }}>
        <Grid container spacing={2}>
          <>
            {/* Title */}
            <Grid item xs={12}>
              <h1 className="mb-3" >{title}</h1>
              {complete ? (
                <span className="text-green-700 bg-green-200 p-2 rounded-full ">
                  Completed
                </span>
              ) : (
                <span className="text-yellow-700 p-2 bg-amber-100 rounded-full  ">
                  In Progress
                </span>
              )}
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <p className="text-slate-500">{description}</p>
            </Grid>
            {/* Estimated Time */}
            <Grid item xs={12}>
              <p>Estimated Completion: {estimatedTime}</p>
            </Grid>
          </>

          <Grid item xs={12} sx={{ marginTop: "1rem" }}>
            <Paper
              elevation={4}
              sx={{ width: "100%", overflow: "auto", borderRadius: "20px" }}
            >
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "#f3f4f6",
                          width: "30vw",
                        }}
                      >
                        Assigned Role
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 600, backgroundColor: "#f3f4f6" }}
                      >
                        Progress
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(rows).map((row, i) => {
                      const key = row;
                      const assigned = rows[row].total;
                      const completed = rows[row].completed;

                      return (
                        <TableRow hover role="checkbox" key={i}>
                          <TableCell>{formatDesignation(key)}</TableCell>
                          <TableCell>
                            {!assigned ? (
                              <span className="text-slate-500">
                                Not Assigned
                              </span>
                            ) : (
                              <>
                                <LinearProgress
                                  color="success"
                                  variant="determinate"
                                  value={(completed / assigned) * 100}
                                  sx={{
                                    "& .MuiLinearProgress-bar": {
                                      color: "red", // Set the color of the progress bar to red
                                    },
                                  }}
                                />
                                {`(${completed}/${assigned})`}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

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
                    {assigneesRow.map((row, i) => {
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
                            {canChat(
                              user.designation,
                              row.assignedToUserDesignation,
                            ) ? (
                              <IconButton
                                onClick={() => {
                                  navigate(`/chat/${row.assignedToEmail}`);
                                }}
                              >
                                <ForumRoundedIcon />
                              </IconButton>
                            ) : (
                              <></>
                            )}
                            {canApprove(user.designation) ? (
                              <Button
                                variant="contained"
                                disabled={row.completed === 1} // Set disabled to true
                                sx={{
                                  color: "white", // Text color when disabled
                                  backgroundColor: buttonBlue, // Background color when disabled
                                  "&:hover": {
                                    // Styles on hover
                                    backgroundColor: buttonBlue, // Background color on hover
                                  },
                                  "&.Mui-disabled": {
                                    // Styles for the disabled state
                                    color: "white", // Text color when disabled
                                    backgroundColor: "green", // Background color when disabled
                                  },
                                }}
                                onClick={() => {
                                  setIdToApprove(row.id),
                                    setRoleApproved(row.assignedRole);
                                  setApproveModal(true);
                                  // handleApprove(row.id, row.assignedRole);
                                }}
                              >
                                {row.completed ? "Approved" : "Approve"}
                              </Button>
                            ) : (
                              <></>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {canApprove(user.designation) ? (
            <Button
              fullWidth // Make the button full width
              variant="contained"
              disabled={complete}
              sx={{
                marginTop: "2rem",
                padding: "1rem",
                color: "white",
                backgroundColor: buttonBlue,
                "&:hover": {
                  backgroundColor: buttonBlue,
                },
                "&.Mui-disabled": {
                  // Styles for the disabled state
                  color: "white", // Text color when disabled
                  backgroundColor: "green", // Background color when disabled
                },
              }}
              onClick={() => {
                setConfirmComplete(true);
              }}
            >
              {complete ? "Task Already Approved" : " Approve Task Completion"}
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      </Paper>
      <ApproveModal
        open={approveModal}
        setOpen={setApproveModal}
        handleApprove={handleApprove}
        userId={idToApprove}
      />
      <ConfirmComplete
        open={confirmComplete}
        setOpen={setConfirmComplete}
        content={
          "You are about to set this task in a completed state. Once done it can not be reversed. Are you sure you want to proceed?"
        }
        complete={completeTask}
      />
    </div>
  );
};

export default ViewTask;
