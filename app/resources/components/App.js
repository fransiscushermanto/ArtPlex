import React from "react";

import myApp from "myApp";
const App = (props) => {
  const { user } = myApp;

  const handleSubmit = async () => {
    let data = new FormData();
    data.append("tes", "Tes");
    const res = await axios.post("/api/tes.php", data);
    console.log(res);
  };

  return <div className="app-wrapper">{props.children}</div>;
};

export default App;
