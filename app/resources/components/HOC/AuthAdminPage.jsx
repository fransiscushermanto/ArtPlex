import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import myApp from "myApp";
export default (OriginalComponent) => {
  const MixedComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = myApp;
    let arrLocation = location.pathname.split("/");
    console.log(user);
    useEffect(() => {
      if (user === null) {
        console.log(history);
        history.push("/");
        window.location.reload();
      } else {
        if (user.level !== "admin") {
          history.push("/");
          window.location.reload();
        } else {
          if (arrLocation[2] === undefined) {
            history.push("/admin/users");
            window.location.reload();
          }
        }
      }
    }, []);
    if (user !== null) {
      return <OriginalComponent user={user} type={arrLocation[2]} />;
    } else {
      history.push("/login");
      window.location.reload();
    }
  };

  return MixedComponent;
};
