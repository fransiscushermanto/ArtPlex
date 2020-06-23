import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import myApp from "myApp";
export default (OriginalComponent) => {
  const MixedComponent = () => {
    const history = useHistory();
    const { user } = myApp;
    useEffect(() => {
      if (user === null) {
        history.push("/");
        window.location.reload();
      }
    }, []);
    return <OriginalComponent />;
  };

  return MixedComponent;
};
