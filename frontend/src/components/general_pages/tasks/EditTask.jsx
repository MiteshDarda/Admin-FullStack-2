import { useEffect, useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import EditTaskForm from "./EditTaskForm";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import getTask from "../../../api/tasks/getTask";
import Logout from "../../../utils/logout";

const EditTask = () => {
  const user = useSelector((state) => state.users);
  const location = useLocation();
  const path = location.pathname.split("/");
  const [rows, setRowsData] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    estimatedTime: new Date().toISOString().split("T")[0],
  });
  const navigate = useNavigate();
  const getTaskData = async () => {
    try {
      const response = await getTask(user.token, path[2]);
      if (response.status === 200) {
        setTaskData({
          title: response.data.task.title,
          description: response.data.task.description,
          estimatedTime: new Date(response.data.task.estimatedCompletion)
            .toISOString()
            .split("T")[0],
        });
        setRowsData(response.data.usersAssigned);
      } else if (response.status === 401) Logout(navigate);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (user.token) getTaskData();
  }, [user]);

  return (
    <div className="p-[2rem] bg-gray-100 ">
      <h1 className="text-[32px] my-[1rem] font-bold">Edit Task</h1>
      <CreateTaskForm data={taskData} />
      <EditTaskForm rows={rows} />
    </div>
  );
};

export default EditTask;
