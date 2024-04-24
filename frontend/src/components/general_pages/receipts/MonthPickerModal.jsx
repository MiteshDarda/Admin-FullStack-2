import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import { Fragment, useState } from "react";
import MonthPicker from "./FilterForm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceMonthly from "./InvoiceMonthly";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Format the current month and year as a string in the format 'YYYY-MM'
export default function MonthPickerModal(props) {
  const [amount, setAmount] = useState(0);
  const month = props.month;
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
          Create Customized Invoice
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
        <DialogContent divider sx={{ overflow: "hidden" }}>
          <div className="w-[30vw] flex flex-col justify-center gap-3">
            <div className="flex justify-center">
              <MonthPicker setMonth={setMonth} />
            </div>
            <div className="flex justify-center">
              <TextField
                label="Enter your number"
                variant="outlined"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                sx={{
                  "& input": {
                    padding: "12px", // Adjust the padding as needed
                    fontSize: "16px", // Adjust the font size as needed
                    borderRadius: "4px", // Adjust the border radius as needed
                    borderColor: "#ced4da", // Adjust the border color as needed
                    borderWidth: "1px", // Adjust the border width as needed
                  },
                }}
              />
            </div>
            <PDFDownloadLink
              document={
                <InvoiceMonthly
                  data={props.data}
                  month={month}
                  amount={amount}
                  people={props.people}
                  email={props.email}
                />
              }
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
