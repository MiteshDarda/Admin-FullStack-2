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

const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

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

    if (!passwordRegex.test(pas)) {
      setSubmitting(true);
      setError(
        `Password must contain: \n 
        one digit from 0 to 9 \n
         one lowercase  & uppercase letter & special character \n
          no space and it must be between 8-16 characters long
          `,
      );
      return;
    }
    if (pas !== confirmpas || flag) {
      setSubmitting(true);
      setError("Passwords do not match!");
      return;
    }
    fields.forEach((element) => {
      element.setState("");
    });

    setSubmitting(false);
    await props.submit();
    handleClose();
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
                    style={{ whiteSpace: "pre-line", lineHeight: ".5" }}
                  >
                    {error}
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
