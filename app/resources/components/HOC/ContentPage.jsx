import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import myApp from "myApp";
export default (OriginalComponent) => {
  const MixedComponent = () => {
    const history = useHistory();
    const location = useLocation();
    let arrLocation = location.pathname.split("/");
    const { user } = myApp;
    useEffect(() => {
      if (user === null) {
        history.push("/");
        window.location.reload();
      } else {
        if (location.pathname.split("/")[1] === "p") {
          if (arrLocation[2] === undefined) {
            history.push("/");
          } else {
            const data = new FormData();
            data.append("user_id", user.id);
            data.append("story_id", arrLocation[2]);
            axios
              .post("/api/actions/verify_user_story.php", data)
              .then((res) => {
                if (!res.data.success) {
                  history.push("/");
                }
              });
          }
        } else if (location.pathname.split("/")[1] === "story") {
          history.push("/story/draft");
        }
      }
    }, []);
    return <OriginalComponent user={user} />;
  };

  return MixedComponent;
};
