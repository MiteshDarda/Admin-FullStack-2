/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Grid, TextField } from "@mui/material";
import { useState } from "react";
import duplicateTask from "../../../api/tasks/duplicateTask";
import {
  useNavigate,
  useOutletContext,
  useRouteLoaderData,
} from "react-router-dom";
import Logout from "../../../utils/logout";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DuplicateTaskModal(props) {
  const [numberOfDuplicates, setNumberOfDuplicates] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const open = props.state;
  const setOpen = props.setState;
  const loaderData = useRouteLoaderData("root");
  const [setAlertMessage, setSeverity] = useOutletContext();
  const navigate = useNavigate();
  const duplicate = async () => {
    try {
      setSubmitting(true);
      const response = await duplicateTask(
        loaderData.token,
        numberOfDuplicates,
        props.duplicateId,
      );
      if (response.status === 201) {
        await props.getAllTasks();
        setSeverity("success");
        setAlertMessage("Task Duplicated Sucessfully");
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

  const handleClose = () => {
    setSubmitting(false);
    setOpen(false);
  };

  const handleFormSubmit = async (e) => {
    setSubmitting(false);
    e.preventDefault();
    await duplicate();
    setSubmitting(false);
    handleClose();
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {`Duplicate Task`}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Number of Duplicates"
                  type="number"
                  fullWidth
                  inputProps={{
                    min: 1,
                    max: 100,
                  }}
                  value={numberOfDuplicates}
                  onChange={(e) => {
                    setNumberOfDuplicates(e.target.value);
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={24} />
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
