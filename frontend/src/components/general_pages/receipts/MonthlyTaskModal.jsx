import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import MonthPicker from "./FilterForm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./Invoice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Format the current month and year as a string in the format 'YYYY-MM'
export default function MonthlyTaskModal(props) {
  const setMonth = props.setMonth;
  const open = props.state;
  const setOpen = props.setState;
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "center", m: 0, p: 2 }}
          id="customized-dialog-title"
        >
          Select Month and Year
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
        <DialogContent dividers sx={{ overflow: "hidden" }}>
          <div className="w-[30vw] flex flex-col justify-center gap-3">
            <div className="flex justify-center">
              <MonthPicker setMonth={setMonth} />
            </div>

            <PDFDownloadLink
              document={<Invoice data={props.data} />}
              fileName="invoice.pdf"
            >
              <Button
                disabled={props.loading}
                variant="contained"
                color="primary"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  margin: "auto",
                  marginTop: "1rem",
                }}
              >
                Download
              </Button>
            </PDFDownloadLink>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </Fragment>
  );
}
