import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDelete(props) {
  const handleClose = () => props.setOpen(false);
  //open,setOpen,content,delete

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">{"Confirm Delete"}</DialogTitle>
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
          className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5  "
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
          className="bg-[red] text-white font-semibold px-5 py-1 h-12 mt-5  "
          onClick={() => {
            props.delete();
            handleClose();
          }}
        >
          Confirm
        </motion.button>
      </DialogActions>
    </Dialog>
  );
}
