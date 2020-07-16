import React from "react";

import myApp from "myApp";
const App = (props) => {
  const { user } = myApp;

  return <div className="app-wrapper">{props.children}</div>;
};

export default App;
