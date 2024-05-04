import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { buttonBlue } from "../../../utils/colors/colors";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import newTask from "../../../api/tasks/newTask";
import { useSelector } from "react-redux";
import Logout from "../../../utils/logout";
import editTask from "../../../api/tasks/editTask";

const CreateTaskForm = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [errorTask, setErrorTask] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);

  const location = useLocation();
  const path = location.pathname.split("/");
  const buttonText = path.length === 2 ? "Create Task" : "Edit Task";
  const user = useSelector((state) => state.users);
  const [setAlertMessage, setSeverity] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(props.data.title);
    setDescription(props.data.description);
    setEstimatedTime(props.data.estimatedTime);
  }, [props]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setErrorTask(false);

    if (title.trim() === "") {
      setErrorTask(true);
      return;
    }
    if (path.length === 2) {
      setLoadingTask(true);
      try {
        const response = await newTask(
          user.token,
          title.trim(),
          description.trim(),
          estimatedTime,
        );
        if (response.status === 201) {
          setAlertMessage("Task Created Successfully.");
          navigate(`/editTask/${response.data.id}`);
        } else if (response.status === 401) {
          Logout(navigate);
        } else {
          setSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (e) {
        setSeverity("warning");
        console.log("Unexpected Error");
        setAlertMessage(e.message);
      }
      setLoadingTask(false);
    } else {
      setLoadingTask(true);
      try {
        const response = await editTask(
          user.token,
          title.trim(),
          description.trim(),
          estimatedTime,
          path[2],
        );
        if (response.status === 200) {
          setAlertMessage("Task Edited Successfully.");
        } else if (response.status === 401) {
          Logout(navigate);
        } else {
          setSeverity("error");
          setAlertMessage(response.data.message);
        }
      } catch (e) {
        setSeverity("warning");
        console.log("Unexpected Error");
        setAlertMessage(e.message);
      }
      setLoadingTask(false);
    }
  };
  return (
    <form onSubmit={handleCreateTask}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, width: "100%" }}>
        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              required
              label="Title"
              fullWidth
              inputProps={{
                maxLength: 100,
              }}
              error={errorTask && title.trim() === ""}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </Grid>
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              inputProps={{
                maxLength: 500,
              }}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Grid>
          {/* Estimated Time */}
          <Grid item xs={12}>
            <TextField
              label="Estimated Time"
              fullWidth
              type="date"
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
          </Grid>
          {/* Submit Button */}
          <Grid item sx={{ textAlign: "right" }} xs={12}>
            <Button
              disabled={loadingTask}
              type="submit"
              variant="contained"
              sx={{
                bgcolor: buttonBlue,
                color: "white",
              }}
            >
              {loadingTask ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                </>
              ) : (
                buttonText
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default CreateTaskForm;
