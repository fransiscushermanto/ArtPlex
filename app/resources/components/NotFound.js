import React, { useEffect } from "react";
import axios from "axios";

const NotFound = () => {
  useEffect(() => {
    const Handle = async () => {
      const data = new FormData();
      data.append("not_found", 1);
      const res = await axios.post("/api/actions/not_found.php", data);
      console.log(res);
    };
    Handle();
  }, []);
  return (
    <div className="container height-100 d-flex justify-content-center align-items-center">
      <h1>
        <b>404</b> Page Not Found.
      </h1>
    </div>
  );
};

export default NotFound;
