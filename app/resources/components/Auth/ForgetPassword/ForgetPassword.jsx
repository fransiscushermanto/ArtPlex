import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
const ForgetPassword = ({
  errors,
  handleSubmit,
  onSubmit,
  auth,
  loading,
  goBack,
  register,
}) => {
  return (
    <div
      className="forget-wrapper height-100"
      style={{
        position: "relative",
      }}
    >
      <header
        style={{ position: "absolute", zIndex: "3", top: "3%", left: "2%" }}
      >
        <button
          className="d-flex align-items-center btn back-btn"
          onClick={goBack}
        >
          <span data-icon="back" className="d-flex align-items-center">
            <svg
              style={{ width: "50px", height: "35px" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="currentColor"
                d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"
              ></path>
            </svg>
          </span>
        </button>
      </header>
      <div className="container height-100 illustrations">
        <div className="row height-100">
          <div className="col height-100">
            <div
              className="height-100"
              style={{
                backgroundImage:
                  "url('/app/assets/img/undraw_forgot_password_gi2d.png')",
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          <div className="col d-flex align-items-center">
            <form
              className="col-lg-12 col-md-12 col-sm-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-group">
                <h1 className="title">
                  <b>Reset your password</b>
                </h1>
              </div>
              <div className="form-group">
                <p className="description">
                  <b>
                    Insert registered email. We will send you link to reset your
                    password.
                  </b>
                </p>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="E-mail Address"
                  ref={register}
                  style={
                    errors.email
                      ? errors.email.message
                        ? { border: "1px solid red", marginBottom: "5px" }
                        : null
                      : auth
                      ? { border: "1px solid red", marginBottom: "5px" }
                      : null
                  }
                />
                {(errors.email && (
                  <p
                    style={{ fontSize: "13px" }}
                    className="text-danger font-weight-bold"
                  >
                    {errors.email.message}
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

              <div className="col-md-12 d-inline-flex align-items-center mb-3 p-0">
                <button
                  className="btn btn-action d-inline-flex w-100 justify-content-center"
                  type="submit"
                >
                  {loading ? (
                    <CircularProgress
                      size="23px"
                      color="inherit"
                    ></CircularProgress>
                  ) : (
                    <b style={{ fontSize: "15px" }}>Next</b>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ForgetPassword.propTypes = {
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  auth: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  register: PropTypes.any.isRequired,
};

export default ForgetPassword;
