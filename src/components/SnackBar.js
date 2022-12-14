import React, { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function SimpleSnackbar(props) {
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (props.openSnackBar) {
      setOpenSnackBar(true);
    }
  }, [props.openSnackBar]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const action = (
    <div>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );

  return (
    <div>
      {openSnackBar && (
        <div>
          {console.log("bar ran")}
          <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Note archived"
            action={action}
          />
        </div>
      )}
    </div>
  );
}
