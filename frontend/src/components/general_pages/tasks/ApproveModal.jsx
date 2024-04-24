import { motion } from "framer-motion";
import { useState } from "react";
import { Box, CircularProgress, Rating, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSelector } from "react-redux";
import approveUserTask from "../../../api/tasks/approveUserTask";
import { useNavigate, useOutletContext } from "react-router-dom";
import Logout from "../../../utils/logout";

export default function ApproveModal(props) {
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [setAlertMessage, setSeverity] = useOutletContext();

  const handleClose = () => {
    props.setOpen(false);
    setError(false);
    setQualityRating(0);
    setDeliveryRating(0);
    setCommunicationRating(0);
  };
  const handleSubmit = async () => {
    setError(false);
    if (
      deliveryRating === 0 ||
      communicationRating === 0 ||
      qualityRating === 0
    ) {
      setError(true);
      return;
    }
    try {
      setLoading(true);
      const response = await approveUserTask(
        user.token,
        deliveryRating,
        qualityRating,
        communicationRating,
        props.userId,
      );
      console.log(response);
      if (response.status === 200) {
        handleClose();
        props.handleApprove();
      } else if (response.status === 401) {
        Logout(navigate);
      } else {
        setSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (e) {
      setSeverity("warning");
      setAlertMessage("Unexpected Error");
    } finally {
      setLoading(false);
    }

    // Close the modal after form submission
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">{"Feedback Form"}</DialogTitle>
      <DialogContent>
        <Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography mr={2} sx={{ fontWeight: "400" }}>
              Delivery:
            </Typography>
            <Rating
              value={deliveryRating}
              onChange={(event, newValue) => {
                setDeliveryRating(newValue);
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography mr={2}>Communication:</Typography>
            <Rating
              value={communicationRating}
              onChange={(event, newValue) => {
                setCommunicationRating(newValue);
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            <Typography mr={2}>Quality:</Typography>
            <Rating
              value={qualityRating}
              onChange={(event, newValue) => {
                setQualityRating(newValue);
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <motion.button
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 0.85 }}
          whileTap={{ scale: 0.7 }}
          className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5"
          onClick={handleClose}
        >
          Cancel
        </motion.button>
        <motion.button
        disabled={loading}
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 0.85 }}
          whileTap={{ scale: 0.7 }}
          className="bg-[green] text-white font-semibold px-5 py-1 h-12 mt-5"
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress /> : "Confirm"}
        </motion.button>
      </DialogActions>
      <Typography
        color="error"
        sx={{ display: "flex", justifyContent: "center", padding: "3px" }}
      >
        {error ? "Ratings are required" : ""}
      </Typography>
    </Dialog>
  );
}
