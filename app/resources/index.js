import "regenerator-runtime";
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import HttpsRedirect from "react-https-redirect";

import App from "./components/App";
import NotFound from "./components/NotFound";
import AuthPage from "./components/HOC/AuthPage";
import ContentPage from "./components/HOC/ContentPage";
import AuthAdminPage from "./components/HOC/AuthAdminPage";
import Login from "./components/Auth/Login";
import ForgetPasswordGroup from "./components/Auth/ForgetPassword/ForgetPasswordGroup";
import RegisterGroup from "./components/Auth/Register/RegisterGroup.jsx";
import VerifyEmail from "./components/Auth/VerifyEmail";
import ResetPassword from "./components/Auth/ResetPassword";
import HomeGroup from "./components/Home/HomeGroup";
import StoryUserGroup from "./components/Stories/StoryUserGroup";
import EditGroup from "./components/Stories/EditGroup";
import StoryEditor from "./components/Stories/StoryEditor";
import StoryPublishGroup from "./components/Stories/StoryPublishGroup";
import AdminGroup from "./components/Admin/AdminGroup";
import myApp from "myApp";

/* globals __webpack_public_path__ */
// __webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;
if (document.getElementById("app")) {
  ReactDOM.render(
    <HttpsRedirect>
      <Router>
        <App history={useHistory}>
          <Switch>
            <Route exact path="/" component={ContentPage(HomeGroup)} />
            <Route path="/story" component={ContentPage(StoryUserGroup)} />
            <Route path="/p" component={ContentPage(EditGroup)} />
            <Route path="/new-story" component={ContentPage(StoryEditor)} />
            <Route path="/@:email" component={ContentPage(StoryPublishGroup)} />
            <Route exact path="/login" component={AuthPage(Login)} />
            <Route exact path="/register" component={AuthPage(RegisterGroup)} />
            <Route path="/admin" component={AuthAdminPage(AdminGroup)} />
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
      </Router>
    </HttpsRedirect>,
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
