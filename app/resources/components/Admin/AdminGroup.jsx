import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import SidePane from "./SidePane";
import ActionPane from "./ActionPane";
import { SnackBar } from "../Function/Factories";

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
        <SnackBar
          openState={statusAction.open}
          handleClose={handleClose}
          severity={statusAction.severity}
          message={statusAction.message}
        />
      </div>
    </div>
  );
};

export default AdminGroup;
