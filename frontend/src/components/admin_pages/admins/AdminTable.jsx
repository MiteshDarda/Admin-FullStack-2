import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Input, InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "../../reusable/modal/Modal";
import getUsers from "../../../api/users/getUsers";
import { useSelector } from "react-redux";
import { formatDate } from "../../../utils/getTime";
import formatDesignation from "../../../utils/formatDesignation";
import RefreshIcon from "@mui/icons-material/Refresh";
import searchUser from "../../../api/users/searchUser";
import { canDelete } from "../../../utils/designation/designation";
import ConfirmDelete from "./ConfirmDelete";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouteLoaderData } from "react-router-dom";
import { buttonBlue } from "../../../utils/colors/colors";

const columns = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "designation", label: "Designation" },
  {
    id: "createdAt",
    label: "Created At",
  },
];

export default function AdminTable(props) {
  const loaderData = useRouteLoaderData("root");
  const [totalCount, setTotalCount] = useState(50);
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState(false);
  const [input, setInput] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  const user = useSelector((state) => state.users);
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers(loaderData.token, limit, page);
      if (response.status === 200) {
        if (response.data.totalCount !== totalCount)
          setTotalCount(response.data.totalCount);
        {
          !searching && page === 1
            ? props.setRows(response.data.people)
            : props.setRows((prevState) => {
                return [...prevState, ...response.data.people];
              });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getSearchedUsers = async () => {
    try {
      setLoading(true);
      const response = await searchUser(
        user.token,
        limit,
        searchPage,
        searchQuery,
      );
      if (response.status === 200) {
        if (response.data.totalCount !== totalCount)
          setTotalCount(response.data.totalCount);
        {
          searching && searchPage === 1
            ? props.setRows(response.data.people)
            : props.setRows((prevState) => {
                return [...prevState, ...response.data.people];
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
    if (!searching) getAllUsers();
  }, [page]);

  useEffect(() => {
    if (searching) getSearchedUsers();
  }, [searchPage]);

  // useEffect(() => {
  //   props.setRows([]);
  //   setPage(1);
  //   setSearchPage(1);
  // }, [searching]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    props.setRows([]);
    setSearching(true);
    setPage(1);
    setSearchPage(1);
    getSearchedUsers();
  };

  const handleRefresh = () => {
    props.setRows([]);
    setPage(1);
    setSearchPage(1);
    setSearching(false);
    setSearchQuery("");
    getAllUsers();
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="bg-white items-center flex p-[12px] justify-end gap-3 rounded-t-[8px] border-2">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
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
                  onClick={handleSearch}
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
        dataLength={props.rows?.length}
        next={() => {
          searching
            ? setSearchPage((prevPage) => prevPage + 1)
            : setPage((prevPage) => prevPage + 1);
        }}
        hasMore={props.rows.length < totalCount}
        loader={
          <div className="pt-1 flex justify-center ">
            <CircularProgress size={20} />
          </div>
        }
      >
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} sx={{ fontWeight: 600 }}>
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                    key="verified"
                    sx={{ fontWeight: 600 }}
                    align="right"
                  >
                    Verified
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600 }}
                    minwidth="170"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.rows.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.email}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            sx={{
                              textTransform: `${column.id === "name" ? "capitalize" : ""}`,
                            }}
                            key={column.id}
                          >
                            {column.id === "createdAt"
                              ? formatDate(value)
                              : column.id === "designation"
                                ? formatDesignation(value)
                                : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right">
                        {row.isVerified ? (
                          <CheckCircleOutlineIcon sx={{ color: "green" }} />
                        ) : (
                          <CancelOutlinedIcon sx={{ color: "red" }} />
                        )}
                      </TableCell>
                      <TableCell align="right" style={{ maxWidth: 170 }}>
                        <IconButton
                          disabled={!row.isVerified}
                          onClick={() => {
                            setInput({
                              "Account Number": row?.accountNumber ?? "",
                              IFSC: row?.ifsc ?? "",
                              "Bank Name": row?.bankName ?? "",
                              Address: row?.address ?? "",
                              "PAN Number": row?.panNum ?? "",
                            });
                            setView(true);
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

                        <IconButton
                          onClick={() => {
                            setDeleteId(row?.email);
                            setConfirmDelete(true);
                          }}
                          disabled={
                            !canDelete(user.designation, row.designation)
                          }
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
                            <span className="text-red-500 font-[600]">
                              Delete
                            </span>
                          </div>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </InfiniteScroll>
      <Modal
        disabled={true}
        title="View Admin"
        state={view}
        setState={setView}
        input={input}
      />
      <ConfirmDelete
        open={confirmDelete}
        setOpen={setConfirmDelete}
        email={deleteId}
        getAllUsers={getAllUsers}
      />
    </>
  );
}
