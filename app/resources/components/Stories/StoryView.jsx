import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StoryView = ({ user }) => {
  const { storyId } = useParams();
  useEffect(() => {
    const getStory = async () => {
      const data = new FormData();
      data.append("story_id", storyId);
      const res = await axios.post("/api/actions/get_story.php", data);
      console.log(res.data);
    };
    getStory();
  }, []);
  return <div className="story-public"></div>;
};

export default StoryView;
