import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import myApp from "myApp";
export default (OriginalComponent) => {
  const MixedComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = myApp;
    let arrLocation = location.pathname.split("/");
    useEffect(() => {
      if (user === null) {
        history.push("/");
        window.location.reload();
      } else if (user.level !== "admin") {
        history.push("/");
        window.location.reload();
      } else {
        if (arrLocation[2] === undefined) {
          history.push("/admin/users");
        }
      }
    }, []);
    return <OriginalComponent user={user} type={arrLocation[2]} />;
  };

  return MixedComponent;
};
