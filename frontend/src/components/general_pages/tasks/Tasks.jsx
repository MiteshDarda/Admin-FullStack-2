import { motion } from "framer-motion";
import TaskTable from "./TaskTable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Designation from "../../../utils/designation/designation";

const Tasks = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);
  return (
    <>
      <div className="p-[2rem] bg-gray-100 mx-0 pb-0">
        <div className="flex justify-between">
          <h1 className="text-[32px] my-[1rem] font-bold">Tasks</h1>
          {user.designation === Designation.SUPER_ADMIN ||
          user.designation === Designation.ADMIN ||
          user.designation === Designation.LEADER ||
          user.designation === Designation.MANAGER ? (
            <motion.button
              onClick={() => {
                navigate("/createTask");
              }}
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.7 }}
              className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5 "
            >
              Create Task
            </motion.button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="p-8 bg-gray-100">
        <TaskTable />
      </div>
    </>
  );
};
export default Tasks;
