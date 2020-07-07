import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Avatar from "react-avatar";

import ActionGroup from "./ActionComponents/ActionGroup";
const ActionPange = ({
  user,
  openSidePane,
  setOpenSidePane,
  statusAction,
  setStatusAction,
}) => {
  let match = useRouteMatch();
  return (
    <div className="action-pane">
      <div className="header-action-pane">
        <div className="header-wrapper">
          <div
            id="nav-icon"
            className={openSidePane ? "mr-auto open" : "mr-auto"}
            onClick={() => setOpenSidePane(!openSidePane)}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Avatar
            round={"36px"}
            size={"36px"}
            name={user.name}
            className="profile-avatar"
            style={{ fontSize: "30px" }}
            maxInitials={2}
          />
          <span className="user-name">{user.name}</span>
        </div>
      </div>
      <Switch>
        <Route path={`${match.path}/:type`}>
          <ActionGroup
            user={user}
            statusAction={statusAction}
            setStatusAction={setStatusAction}
          />
        </Route>
      </Switch>
      <div className="footer mt-auto">
        <span>
          <b>
            <strong>ArtPlex</strong> Admin Panel
          </b>{" "}
          &copy; 2020
        </span>
      </div>
    </div>
  );
};

export default ActionPange;
