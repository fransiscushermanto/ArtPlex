import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import UserList from "./UserList";

const ActionGroup = ({ user, setStatusAction, statusAction }) => {
  let { type } = useParams();

  useEffect(() => {
    console.log(type);
  }, [type]);

  const renderByType = (type) => {
    switch (type) {
      case "users":
        return (
          <UserList
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
          />
        );

      default:
        break;
    }
  };

  return (
    <div className="action-pane-wrapper">
      <div className="header">
        <span>{type.toUpperCase()}</span>
      </div>
      <div className="main-action-pane">{renderByType(type)}</div>
    </div>
  );
};

export default ActionGroup;
