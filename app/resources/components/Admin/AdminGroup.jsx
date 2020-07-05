import React from "react";
import SidePane from "./SidePane";
const AdminGroup = () => {
  return (
    <div className="admin-wrapper">
      <div className="row">
        <SidePane />
        <div className="action-pane"></div>
      </div>
    </div>
  );
};

export default AdminGroup;
