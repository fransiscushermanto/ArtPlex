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
    const [email, setEmail] = useState();
    console.log(location.pathname);
    useEffect(() => {
      const verifyToken = async (key, user_id, type) => {
        const data = new FormData();
        data.append("key", key);
        data.append("user_id", user_id);
        data.append("type", type);
        const res = await axios.post("/api/actions/verify_token.php", data);
        setKeyStatus(res.data.success);
        if (res.data.email) {
          setEmail(res.data.email);
        }
      };

      if (location.pathname === "/verify") {
        let query = new URLSearchParams(location.search);
        if (query.get("key")) {
          verifyToken(query.get("key"), query.get("user_id"), "verify");
        } else {
          history.push("/");
          window.location.reload();
        }
      } else if (location.pathname === "/reset") {
        let query = new URLSearchParams(location.search);
        if (query.get("key")) {
          verifyToken(query.get("key"), query.get("user_id"), "forget");
        } else {
          history.push("/");
          window.location.reload();
        }
      } else if (user !== null) {
        history.push("/");
        window.location.reload();
      }
    }, []);
    return (
      <OriginalComponent email={email} keyStatus={keyStatus} user={user} />
    );
  };

  return MixedComponent;
};
