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
        if (arrLocation[1] === "p") {
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
                  history.push("/404");
                }
              });
          }
        } else if (arrLocation[1] === "story") {
          let type = arrLocation[2];
          if (type !== undefined) {
            if (type === "draft") {
              history.push("/story/draft");
            } else if (type === "publish") {
              history.push("/story/publish");
            }
          } else {
            history.push("/story/draft");
          }
        } else if (arrLocation[1].split("@")[1] !== undefined) {
          const data = new FormData();
          data.append("username", arrLocation[1].split("@")[1]);
          axios.post("/api/actions/check_username.php", data).then((res) => {
            if (res.data.success) {
              if (arrLocation[2] !== undefined) {
                const data = new FormData();
                data.append("author_id", res.data.author_id);
                data.append("story_id", arrLocation[2]);
                axios
                  .post("/api/actions/check_story_public.php", data)
                  .then((res) => {
                    if (!res.data.success) {
                      history.push("/404");
                    }
                  });
              }
            } else {
              history.push("/404");
            }
          });
        }
      }
    }, []);
    return <OriginalComponent user={user} />;
  };

  return MixedComponent;
};
