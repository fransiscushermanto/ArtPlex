import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import UserList from "./UserList";
import EditPane from "../EditPane";
const ActionGroup = ({ user, setStatusAction, statusAction }) => {
  let { type } = useParams();
  const [openEditPane, setOpenEditPane] = useState(false);
  const [reload, setReload] = useState(false);
  const [tempData, setTempData] = useState();

  const urlPath = async (url, data) => {
    const res = await axios.post(url, data);
    return res.data;
  };

  const conditionalPassData = () => {
    switch (type) {
      case "users":
        const data = new FormData();
        data.append("user_id", tempData.user_id);
        data.append("name", tempData.name);
        data.append("level", tempData.level);
        return data;
      default:
        break;
    }
  };

  const updateData = async () => {
    const data = conditionalPassData();
    switch (type) {
      case "users":
        const status = await urlPath("/api/actions/update_user.php", data);
        console.log(status);
        if (status.success) {
          setOpenEditPane(false);
          setReload(true);
        }
        break;
      default:
        break;
    }
  };

  const renderByType = (type) => {
    switch (type) {
      case "users":
        return (
          <UserList
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
            setOpenEditPane={setOpenEditPane}
            openEditPane={openEditPane}
            tempUserData={tempData}
            setTempUserData={setTempData}
            reload={reload}
            setReload={setReload}
          />
        );

      default:
        break;
    }
  };

  return (
    <div className="action-pane-wrapper">
      {openEditPane ? (
        <EditPane
          type={type}
          tempData={tempData}
          setCloseState={setOpenEditPane}
          setTempData={setTempData}
          updateData={updateData}
        />
      ) : null}

      <div className="header">
        <span>{type.toUpperCase()}</span>
      </div>
      <div className="main-action-pane">{renderByType(type)}</div>
    </div>
  );
};

export default ActionGroup;
