import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Grid, TextField } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Modal(props) {
  const open = props.state;
  const setOpen = props.setState;
  const disabled = props.disabled;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {props.title}
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
          <form>
            <Grid container spacing={2}>
              {Object.keys(props.input).map((field) => {
                return (
                  <Grid item xs={12} key={field}>
                    <TextField
                      fullWidth
                      id={field}
                      name={field}
                      label={field}
                      variant="outlined"
                      disabled={disabled}
                      value={props.input[field]}
                      sx={{
                        // Apply custom styles to disabled TextField
                        "& .MuiInputBase-root.Mui-disabled": {
                          color: "black", // Adjust text color
                          backgroundColor: "white", // Adjust background color
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "black",
                        },
                        "& .MuiInputLabel-root.Mui-disabled": {
                          color: "blue", // Adjust label color
                        },
                        "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                          borderColor: "blue !important", // Adjust border color
                        },
                      }}
                    />
                  </Grid>
                );
              })}
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  variant="outlined"
                  required
                  disabled={disabled}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  required
                  disabled={disabled}
                />
              </Grid> */}
              {!disabled && (
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
