import React, { useState } from "react";

import UserEditPane from "./EditComponents/UserEditPane";

const EditPane = ({
  type,
  setCloseState,
  tempData,
  setTempData,
  updateData,
}) => {
  const conditionalRender = (type) => {
    switch (type) {
      case "users":
        return (
          <UserEditPane
            setCloseState={setCloseState}
            tempData={tempData}
            setTempData={setTempData}
            updateData={updateData}
          />
        );

      default:
        break;
    }
  };

  return <div className="edit-pane">{conditionalRender(type)}</div>;
};

export default EditPane;
