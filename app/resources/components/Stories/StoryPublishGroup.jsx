import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import StoryView from "./StoryView";
const StoryPublishGroup = ({ user }) => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:storyId`}>
        <StoryView user={user} />
      </Route>
    </Switch>
  );
};

export default StoryPublishGroup;
