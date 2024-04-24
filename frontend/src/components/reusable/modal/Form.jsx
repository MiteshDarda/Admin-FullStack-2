/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Form(props) {
  const [submitting, setSubmitting] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const open = props.state;
  const setOpen = props.setState;
  const title = props.title;
  const fields = props.inputs;

  const handleClose = () => {
    setSubmitting(false);
    setOpen(false);
  };

  const handleFormSubmit = async (e) => {
    let pas = "";
    let confirmpas = "";
    let flag = false;
    setSubmitting(false);
    setError("");
    e.preventDefault();
    fields.forEach((element) => {
      if (element.type !== "select") {
        if (element.id === "password") {
          setPass(element.state);
          pas = element.state;
        }
        if (element.id === "confirmPassword") {
          confirmpas = element.state;
          setConfirmPass(element.state);
        }
        if (element.state.trim() === "") {
          flag = true;
        }
      }
    });

    if (pas !== confirmpas || flag) {
      setSubmitting(true);
      setError("Passwords do not match!");
      return;
    }
    if (pas.includes(" ")) {
      setSubmitting(true);
      setError("Password shouldn't contain empty space.");
      return;
    }
    fields.forEach((element) => {
      element.setState("");
    });

    setSubmitting(false);
    await props.submit();
    handleClose();
    console.log("submitted");
  };

  const getComponent = (field, i) => {
    if (field.type !== "select") {
      return (
        <Grid item xs={12} key={i}>
          <TextField
            type={field.type}
            onFocus={() => {
              setSubmitting(false);
            }}
            fullWidth
            id={field.id}
            name={field.id}
            label={field.label}
            value={field.state}
            variant="outlined"
            required
            onChange={(e) => {
              field.setState(e.target.value);
            }}
            error={submitting && field.state.trim() === "" ? true : false}
            disabled={!props.button}
          />
        </Grid>
      );
    } else if (field.type === "select") {
      return (
        <Grid item xs={12} key={i}>
          <InputLabel id={field.label}>{field.label}</InputLabel>
          <Select
            onFocus={() => {
              setSubmitting(false);
            }}
            fullWidth
            labelId={field.label}
            id={field.id}
            value={field.state}
            label="Age"
            onChange={(e) => {
              field.setState(e.target.value);
            }}
            required
            error={submitting && field.state === "" ? true : false}
            disabled={!props.button}
          >
            {field.values.map((value, i) => {
              return (
                <MenuItem value={value.value} key={i}>
                  {value.label}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      );
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
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
              {fields.map((field, i) => {
                const component = getComponent(field, i);
                return component;
              })}

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                {props.button ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {/* Conditional rendering of button label */}
                    {props.loading ? (
                      <>
                        <CircularProgress size={24} />
                        Submitting
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </Grid>
              {submitting && error !== "" ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "middle",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{
                      marginTop: "10px",
                    }}
                  >
                    {pass !== confirmPass ? "Passwords do not match!" : error}
                  </Typography>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
