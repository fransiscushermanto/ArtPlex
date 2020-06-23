import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const ResetPassword = ({ email, keyStatus }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [password, setPassowrd] = useState("");
  const [auth, setAuth] = useState(null);
  const [time, setTime] = useState(3);
  let query = new URLSearchParams(location.search);
  const schema = yup.object().shape({
    password: yup
      .string()
      .required("This field is required")
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
        "Password length must be at least 6 characters include uppercase, lowercase, number "
      ),
    confirmPassword: yup
      .string()
      .required("This field is required")
      .matches(password, "Password not match"),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
  });

  const onSubmit = async (formData) => {
    setAuth(null);
    setLoading(!loading);
    const data = new FormData();
    data.append("user_id", query.get("user_id"));
    data.append("password", formData.password);
    data.append("type", "reset");
    const res = await axios.post("/api/actions/forget_password.php", data);
    // console.log(res.data);
    if (res.data.success) {
      setAuth(res.data.error);
    } else {
      setAuth(res.data.error);
    }
  };

  useEffect(() => {
    if (auth !== null) {
      setLoading(!loading);
    }
  }, [auth]);

  useEffect(() => {
    if (auth === "") {
      setTimeout(() => {
        if (time > 0) {
          setTime(time - 1);
        } else {
          const data = new FormData();
          data.append("user_id", query.get("user_id"));
          data.append("key", query.get("key"));
          data.append("type", "delete_reset");
          axios.post("/api/actions/forget_password.php", data);
          history.push("/login");
        }
      }, 1000);
    }

    return () => {
      if (auth === "") {
        setTimeout(() => {
          if (time > 0) {
            setTime(time - 1);
          } else {
            history.push("/login");
          }
        }, 1000);
      }
    };
  }, [time, auth]);

  return keyStatus !== undefined ? (
    keyStatus ? (
      <div className="forget-wrapper container d-flex flex-column  justify-content-center height-100 reset-password">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group d-flex flex-column align-items-center">
            <div className="col-md-6">
              <h1>
                <b>New Password</b>
              </h1>
              <p className="mb-0">
                Create new strong password for account with email {email}.{" "}
              </p>
            </div>
          </div>
          <div className="form-group d-flex flex-column align-items-center">
            <label className="col-md-6 col-form-label">New Password</label>
            <div className="col-md-6">
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="*******"
                ref={register}
                style={
                  errors.password
                    ? errors.password.message
                      ? { border: "1px solid red", marginBottom: "5px" }
                      : null
                    : auth
                    ? { border: "1px solid red", marginBottom: "5px" }
                    : null
                }
                onChange={(e) => setPassowrd(e.target.value)}
              />
              {(errors.password && (
                <p
                  style={{ fontSize: "13px" }}
                  className="text-danger font-weight-bold"
                >
                  {errors.password.message}
                </p>
              )) ||
                (auth && (
                  <p
                    style={{ fontSize: "13px" }}
                    className="text-danger font-weight-bold"
                  >
                    {auth}
                  </p>
                ))}
            </div>
          </div>
          <div className="form-group d-flex flex-column align-items-center">
            <label className="col-md-6 col-form-label">
              Confirm New Password
            </label>
            <div className="col-md-6">
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                placeholder="*******"
                ref={register}
                style={
                  errors.confirmPassword
                    ? errors.confirmPassword.message
                      ? { border: "1px solid red", marginBottom: "5px" }
                      : null
                    : auth
                    ? { border: "1px solid red", marginBottom: "5px" }
                    : null
                }
              />
              {(errors.confirmPassword && (
                <p
                  style={{ fontSize: "13px" }}
                  className="text-danger font-weight-bold"
                >
                  {errors.confirmPassword.message}
                </p>
              )) ||
                (auth && (
                  <p
                    style={{ fontSize: "13px" }}
                    className="text-danger font-weight-bold"
                  >
                    {auth}
                  </p>
                ))}
            </div>
          </div>
          <div className="form-group d-flex flex-column align-items-center">
            <div className="col-md-6 d-inline-flex align-items-center mb-3 px-3">
              <button
                className="btn btn-action d-inline-flex w-100 justify-content-center"
                type="submit"
                disabled={auth === "" ? true : false}
              >
                {auth === "" ? (
                  <div>
                    {time > 0
                      ? `Rederict to Login Page in ${time} seconds.`
                      : "Redirecting ..."}
                  </div>
                ) : loading ? (
                  <CircularProgress
                    size="23px"
                    color="inherit"
                  ></CircularProgress>
                ) : (
                  <b style={{ fontSize: "15px" }}>Next</b>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    ) : (
      <div className="forget-wrapper container height-100 d-flex align-items-center justify-content-center">
        <h1 className="text-danger">
          <b>Link not found or expired</b>
        </h1>
      </div>
    )
  ) : null;
};

export default ResetPassword;
