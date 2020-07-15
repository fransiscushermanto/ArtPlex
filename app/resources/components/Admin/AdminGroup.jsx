import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Close } from "@material-ui/icons";
import { Snackbar, IconButton } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";

import SidePane from "./SidePane";
import ActionPane from "./ActionPane";
const AdminGroup = ({ user, type }) => {
  const [openSidePane, setOpenSidePane] = useState(true);
  const [statusAction, setStatusAction] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const history = useHistory();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatusAction({ ...statusAction, open: false });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    if (document.getElementById("ftco-navbar")) {
      document.getElementById("ftco-navbar").style.display = "none";
    }
  }, []);

  return (
    <div className="admin-wrapper">
      <div className="row">
        <SidePane openSidePane={openSidePane} type={type} />
        <ActionPane
          user={user}
          openSidePane={openSidePane}
          setOpenSidePane={setOpenSidePane}
          statusAction={statusAction}
          setStatusAction={setStatusAction}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={statusAction.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClick={handleClose}
            severity={statusAction.severity}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {statusAction.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminGroup;
