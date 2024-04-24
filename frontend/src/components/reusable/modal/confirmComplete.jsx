import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmComplete(props) {
  const handleClose = () => props.setOpen(false);
  //open,setOpen,content,complete

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">{"Confirm Complete"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-delete-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <motion.button
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 0.85 }}
          whileTap={{ scale: 0.7 }}
          className="bg-[red] text-white font-semibold px-5 py-1 h-12 mt-5  "
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </motion.button>
        <motion.button
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 0.85 }}
          whileTap={{ scale: 0.7 }}
          className="bg-[green] text-white font-semibold px-5 py-1 h-12 mt-5  "
          onClick={() => {
            props.complete();
            handleClose();
          }}
        >
          Confirm
        </motion.button>
      </DialogActions>
    </Dialog>
  );
}
