import "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import App from "./components/App";
import Login from "./components/Auth/Login";
import RegisterGroup from "./components/Auth/Register/RegisterGroup.jsx";
import ForgetPasswordGroup from "./components/Auth/ForgetPassword/ForgetPasswordGroup";
import NotFound from "./components/NotFound";
import HomeGroup from "./components/Home/HomeGroup";
import AuthPage from "./components/HOC/AuthPage";
import VerifyEmail from "./components/Auth/VerifyEmail";
import ResetPassword from "./components/Auth/ResetPassword";
import myApp from "myApp";

/* globals __webpack_public_path__ */
__webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;
if (document.getElementById("app")) {
  ReactDOM.render(
    <Router>
      <App history={useHistory}>
        <Switch>
          <Route exact path="/" component={HomeGroup} />
          <Route exact path="/login" component={AuthPage(Login)} />
          <Route exact path="/register" component={AuthPage(RegisterGroup)} />
          <Route
            exact
            path="/forget"
            component={AuthPage(ForgetPasswordGroup)}
          />
          <Route exact path="/verify" component={AuthPage(VerifyEmail)} />
          <Route exact path="/reset" component={AuthPage(ResetPassword)} />
          <Route exact path="*" component={NotFound} />
          <Route exact path="/404" component={NotFound} />
        </Switch>
      </App>
    </Router>,
    document.getElementById("app")
  );
}

{
  /* <div className="dashboard">
  <h1 className="name"> {user ? user.name : ""}</h1>
  <p className="email">{user ? user.email : ""}</p>
  <p>API host variable {__API_HOST__}</p>
  <p>API host variable {__API_APP_NAME__}</p>
  <button className="btn btn-primary" onClick={() => handleSubmit()}>
    Tes
  </button>
</div>; */
}
