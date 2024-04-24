import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";
import getUsers from "../../../api/users/getUsers";
import formatDesignation from "../../../utils/formatDesignation";

const limit = 25;

const colors = {
  super_admin: "#A3D6E8",
  admin: "#F3BBBA",
  manager: "#B9DFB5",
  leader: "#E1B8E2",
  qa: "#F0E7B4",
  seo: "#C5E0C5",
  thumbnail_designer: "#FFD6C2",
  video_editor: "#D5CCF2",
  script_writer: "#F3E2F5",
  voice_over_assist: "#F9CB9C",
  member: "#B9B9B9",
};

const Chat = () => {
  const [totalCount, setTotalCount] = useState(50);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAllUsers();
  }, [page]);

  const getAllUsers = async () => {
    try {
      const response = await getUsers(token, limit, page);
      if (response.status === 200) {
        if (response.data.totalCount !== totalCount)
          setTotalCount(response.data.totalCount);
        setUsers((prevState) => {
          return [...prevState, ...response.data.people];
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <InfiniteScroll
      style={{ overflow: "hidden" }}
      dataLength={users?.length}
      next={() => {
        setPage((prevPage) => {
          return prevPage + 1;
        });
      }}
      hasMore={users.length < totalCount}
      loader={
        <div className="pt-1 flex justify-center ">
          <CircularProgress size={20} />
        </div>
      }
    >
      <div className="flex flex-wrap justify-center align-middle">
        {users.map((user, i) => {
          return (
            <div
              onClick={() => navigate(`./${user.email}`)}
              key={i}
              className={
                "cursor-pointer flex justify-between w-[100%] m-1 p-6 rounded-lg shadow bg-white border-gray-700 text-gray-600 font-semibold hover:bg-blue-100" +
                " "
              }
            >
              <div className="flex gap-3">
                <Avatar
                  sx={{ bgcolor: blue[500], textTransform: "capitalize" }}
                >
                  {user?.name[0]}
                </Avatar>
                <p className="text-center">{user?.name ?? ""}</p>
              </div>

              <div
                className={`p-2 rounded-md text-black font-bold w-[12rem] text-center`}
              >
                <div>{formatDesignation(user?.designation)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  );
};

export default Chat;
