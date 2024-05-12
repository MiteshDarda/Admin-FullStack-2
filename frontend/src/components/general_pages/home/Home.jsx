import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logout from "../../../utils/logout";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);

  return (
    <div className="p-[2rem] bg-gray-100 h-[90vh]">
      <h1 className="text-[32px] my-[1rem] font-bold">Dashboard</h1>
      <div className="max-w-sm p-4 bg-white border border-gray-700 rounded-lg shadow flex gap-3 ">
        <div>
          <Avatar sx={{ bgcolor: "black", textTransform: "capitalize" }}>
            {user.name[0]}
          </Avatar>
        </div>
        <div>
          <div className="font-semibold text-[18px] capitalize">
            Welcome, {user.name}
          </div>
          <span
            onClick={() => {
              Logout(navigate);
            }}
            className="text-gray-400 hover:cursor-pointer hover:text-red-500"
          >
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
