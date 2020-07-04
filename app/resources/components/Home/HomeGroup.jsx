import React, { useEffect } from "react";
import axios from "axios";
const HomeGroup = () => {
  useEffect(() => {
    axios
      .get("/api/actions/get_list_story.php")
      .then((res) => console.log(res.data));
  });

  return <div></div>;
};

export default HomeGroup;
