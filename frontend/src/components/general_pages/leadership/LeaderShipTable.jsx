import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getRanking from "../../../api/leadership/ranking";
import formatDesignation from "../../../utils/formatDesignation";
import { formatRanking } from "../../../utils/formatRanking";
import InfiniteScroll from "react-infinite-scroll-component";

const limit = 50;
const columns = [
  { id: "id", label: "#", minWidth: 170 },
  { id: "user_name", label: "Name", minWidth: 100 },
  { id: "user_email", label: "Email", minWidth: 100 },
  {
    id: "user_designation",
    label: "Designation",
    minWidth: 170,
  },
  {
    id: "totalAverage",
    label: "Total Average",
    minWidth: 170,
  },
];

export default function LeaderShipTable() {
  const [rows, setRows] = useState([]);
  const user = useSelector((state) => state.users);

  const getLeadershipRanking = async () => {
    try {
      if (user.token) {
        const response = await getRanking(user.token, limit, 1);
        if (response.status === 200) {
          if (response.data.leadership.length > 0)
            if (rows.length === 0) setRows(response.data.leadership);
            else {
              setRows((prevState) => {
                  return [...prevState, ...response.data.leadership];
              });
            }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

 
  // useEffect(() => {
  //   getLeadershipRanking();
  // }, [page]);

  useEffect(() => {
    getLeadershipRanking();
  }, [user]);

  return (
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 600 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" key={row.user_email}>
                    {columns.map((column) => {
                      let value = row[column.id];
                      if (column.id === "user_designation")
                        value = formatDesignation(value);
                      else if (column.id === "id") value = index + 1;
                      else if (column.id === "totalAverage")
                        value = formatRanking(row.average);
                      return <TableCell key={column.id}>{value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

  );
}
