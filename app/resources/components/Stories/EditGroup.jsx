import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import StoryEditor from "./StoryEditor";
const EditGroup = ({ user }) => {
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:storyId/:type`}>
        <StoryEditor user={user} />
      </Route>
    </Switch>
  );
};

export default EditGroup;
