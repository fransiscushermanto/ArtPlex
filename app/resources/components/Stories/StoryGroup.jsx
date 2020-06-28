import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import ListStory from "./ListStory";

const StoryGroup = ({ user }) => {
  const [modal, setModal] = useState(false);
  const [storyId, setStoryId] = useState("");
  let match = useRouteMatch();
  useEffect(() => {
    document.getElementsByTagName("body")[0].style.overflowY = modal
      ? "hidden"
      : "scroll";
  }, [modal]);
  return (
    <div className="story-wrapper container height-100">
      <div className="col">
        <div className="row">
          <h1 className="title mb-0">
            <span>Your</span> <span>stories</span>
          </h1>
          <div className="action-wrapper">
            <div className="inner-action-wrapper">
              <Link to="/new-story" className="ml-auto">
                <button className="btn btn-outline-success">
                  Write a story
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Switch>
          <Route path={`${match.path}/:type`}>
            <ListStory
              setModal={setModal}
              user={user}
              setStoryId={setStoryId}
              modal={modal}
              storyId={storyId}
            ></ListStory>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default StoryGroup;
