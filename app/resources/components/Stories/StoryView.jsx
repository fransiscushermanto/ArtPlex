import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const StoryView = ({ user }) => {
  const { author, storyId } = useParams();
  useEffect(() => {
    console.log(author, storyId);
  }, []);
  return <div>Publish Story</div>;
};

export default StoryView;
