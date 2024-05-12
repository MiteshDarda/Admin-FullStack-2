import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import deleteUser from "../../../api/users/deleteUser";
import Logout from "../../../utils/logout";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function ConfirmDelete(props) {
  const handleClose = () => props.setOpen(false);
  const user = useSelector((state) => state.users);
  const [setAlertMessage, setSeverity] = useOutletContext();
  const navigate = useNavigate();

  const confirmDeleteUser = async () => {
    try {
      const response = await deleteUser(
        user.token,
        props.email,
        setSeverity,
        setAlertMessage,
      );
      if (response.status === 200) {
        setAlertMessage("User deleted successfully.");
        props.getAllUsers();
      } else if (response.status === 401) {
        Logout(navigate);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
          Are you sure you want to delete user associated with the email{" "}
          {props.email}?
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
            confirmDeleteUser();
            handleClose();
          }}
        >
          Confirm
        </motion.button>
      </DialogActions>
    </Dialog>
  );
}
