import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { buttonBlue } from "../../../utils/colors/colors";
import { useSelector } from "react-redux";
import getTasks from "../../../api/tasks/getTasks";
import ConfirmDelete from "../../reusable/modal/confirmDelete";
import deleteTask from "../../../api/tasks/deleteTask";
import { useNavigate, useOutletContext } from "react-router-dom";
import Logout from "../../../utils/logout";
import { formatDate } from "../../../utils/getTime";
import searchTask from "../../../api/users/searchTask";
import Designation from "../../../utils/designation/designation";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouteLoaderData } from "react-router-dom";
import DuplicateTaskModal from "./DuplicateTaskModal";

const columns = [
  { id: "id", label: "Task Id" },
  { id: "title", label: "Title" },
  {
    id: "createdAt",
    label: "Created At",
  },
];

const limit = 25;

export default function TaskTable() {
  const loaderData = useRouteLoaderData("root");
  const [totalCount, setTotalCount] = useState(50);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState("");
  const [setAlertMessage, setSeverity] = useOutletContext();
  const [canEditDelete, setCanEditDelete] = useState(false);
  const [duplicate,setDuplicate] = useState(false);
  const [duplicateId, setDuplicateId] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);

  const getAllTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(loaderData.token, limit, page);
      if (response.status === 200) {
        if (response.data.count !== totalCount)
          setTotalCount(response.data.count);
        {
          !searching && page === 1
            ? setRows(response.data.tasks)
            : setRows((prevState) => {
                return [...prevState, ...response.data.tasks];
              });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getSearchedTasks = async () => {
    try {
      setLoading(true);
      const response = await searchTask(
        loaderData.token,
        limit,
        searchPage,
        searchQuery,
      );
      if (response.status === 200) {
        if (response.data.count !== totalCount)
          setTotalCount(response.data.count);
        {
          searching && searchPage === 1
            ? setRows(response.data.tasks)
            : setRows((prevState) => {
                return [...prevState, ...response.data.tasks];
              });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.designation === Designation.SUPER_ADMIN ||
      user.designation === Designation.ADMIN ||
      user.designation === Designation.LEADER ||
      user.designation === Designation.MANAGER
    )
      setCanEditDelete(true);
  }, [user]);

  useEffect(() => {
    if (!searching) getAllTasks();
  }, [page]);

  useEffect(() => {
    if (searching) getSearchedTasks();
  }, [searchPage]);

  useEffect(() => {
    setRows([]);
    setPage(1);
    setSearchPage(1);
  }, [searching]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    setRows([]);
    setSearching(true);
    setSearchPage(1);
    getSearchedTasks();
  };

  const handleRefresh = () => {
    setRows([]);
    setPage(1);
    setSearchPage(1);
    setSearching(false);
    setSearchQuery("");
    getAllTasks();
  };

  const removeFromRow = () => {
    setRows((prev) => {
      return prev.filter((task) => {
        return task.id !== taskToDelete;
      });
    });
    setTotalCount((prev) => {
      return prev - 1;
    });
  };

  const deleteTaskHandler = async () => {
    try {
      const response = await deleteTask(user.token, taskToDelete);
      if (response.status === 200) {
        removeFromRow();
        setAlertMessage("Task deleted successfully");
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

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="bg-white items-center flex p-[12px] justify-end gap-3 rounded-t-[8px] border-2">
          <IconButton
            disabled={loading}
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
                  disabled={loading}
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
        </div>
      </form>
      <InfiniteScroll
        style={{ overflow: "hidden" }}
        dataLength={rows?.length}
        next={() => {
          searching
            ? setSearchPage((prevPage) => prevPage + 1)
            : setPage((prevPage) => prevPage + 1);
        }}
        hasMore={rows.length < totalCount}
        loader={
          <div className="p-1 flex justify-center ">
            <CircularProgress />
          </div>
        }
      >
        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 600 }}>
                      {column.label}
                    </TableCell>
                  ))}

                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Completed
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600 }}
                    minwidth="170"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" key={row.id}>
                      {columns.map((column) => {
                        let value = row[column.id];
                        if (column.id === "createdAt") {
                          value = formatDate(value);
                        }
                        return <TableCell key={column.id}>{value}</TableCell>;
                      })}
                      <TableCell align="right">
                        {row.isCompleted ? (
                          <CheckCircleOutlineIcon sx={{ color: "green" }} />
                        ) : (
                          <CancelOutlinedIcon sx={{ color: "red" }} />
                        )}
                      </TableCell>

                      <TableCell align="right" style={{ maxWidth: 170 }}>
                        <IconButton
                          onClick={() => {
                            navigate(`/viewTask/${row.id}`);
                          }}
                          sx={{
                            fontSize: "12px",
                            "&:focus": {
                              outline: "none",
                              border: "none",
                            },
                          }}
                        >
                          <div className="flex gap-1 items-center">
                            <VisibilityIcon />
                            <span className="font-[600]">View</span>
                          </div>
                        </IconButton>

                        {canEditDelete ? (
                          <IconButton
                            onClick={() => {
                              navigate(`/editTask/${row.id}`);
                            }}
                            sx={{
                              fontSize: "12px",
                              "&:focus": {
                                outline: "none",
                                border: "none",
                              },
                            }}
                          >
                            <div className="flex gap-1 items-center">
                              <Edit sx={{ color: buttonBlue }} />
                              <span className={`font-[600] text-[#006eff]`}>
                                Edit
                              </span>
                            </div>
                          </IconButton>
                        ) : (
                          <></>
                        )}

                        {canEditDelete ? (
                          <IconButton
                            onClick={() => {
                              setTaskToDelete(row.id);
                              setConfirmDeleteTask(true);
                            }}
                            sx={{
                              fontSize: "12px",
                              "&:focus": {
                                outline: "none",
                                border: "none",
                              },
                            }}
                          >
                            <div className="flex gap-1 items-center">
                              <DeleteIcon sx={{ color: "red" }} />
                              <span className="font-[600] text-red-500 ">
                                Delete
                              </span>
                            </div>
                          </IconButton>
                        ) : (
                          <></>
                        )}

                        {canEditDelete ? (
                          <IconButton
                            onClick={() => {
                              setDuplicate(true);
                              setDuplicateId(row.id);
                            }}
                            sx={{
                              fontSize: "12px",
                              "&:focus": {
                                outline: "none",
                                border: "none",
                              },
                            }}
                          >
                            <div className="flex gap-1 items-center">
                              <ControlPointDuplicateIcon sx={{ color: "gray" }} />
                              <span className="font-[600] text-gray-500 ">
                                Duplicate
                              </span>
                            </div>
                          </IconButton>
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
      </InfiniteScroll>
      <ConfirmDelete
        open={confirmDeleteTask}
        setOpen={setConfirmDeleteTask}
        content={"Are you sure you want to delete this task"}
        delete={deleteTaskHandler}
      />
      <DuplicateTaskModal state={duplicate} setState={setDuplicate} duplicateId= {duplicateId} getAllTasks={getAllTasks}/>
    </>
  );
}
