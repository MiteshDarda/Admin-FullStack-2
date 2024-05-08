import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function Feedback(props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      <DialogTitle id="confirm-delete-title">{"Feedback"}</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center">
          <Box
            border="1px solid #ccc"
            padding={2}
            borderRadius="borderRadius"
            width="100%"
          >
            <Typography variant="body1">{props.remark}</Typography>
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
          Close
        </motion.button>
      </DialogActions>
    </Dialog>
  );
}
