import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import myApp from "myApp";
export default (OriginalComponent) => {
  const MixedComponent = () => {
    const location = useLocation();
    const history = useHistory();
    const { user } = myApp;
    const [keyStatus, setKeyStatus] = useState();
    useEffect(() => {
      const verifyToken = async (key, user_id, type) => {
        const data = new FormData();
        data.append("key", key);
        data.append("user_id", user_id);
        data.append("type", type);
        const res = await axios.post("/api/actions/verify_token.php", data);
        setKeyStatus(res.data.success);
      };

      if (user !== null) {
        history.push("/");
        window.location.reload();
      }
      if (location.pathname === "/verify") {
        let query = new URLSearchParams(location.search);
        if (query.get("key")) {
          verifyToken(query.get("key"), query.get("user_id"), "verify");
        } else {
          history.push("/");
          window.location.reload();
        }
      }
    }, []);
    return <OriginalComponent keyStatus={keyStatus} />;
  };

  return MixedComponent;
};
