import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Register = ({
  goHome,
  handleSubmit,
  onSubmit,
  register,
  errors,
  auth,
  setEmail,
}) => {
  return (
    <div className="auth-wrapper row height-100">
      <div className="col">
        <div className="wrapper-image height-100">
          <div className="overlay"></div>
          <svg
            id="b71cf957-6104-44bf-a28a-c3091bf56141"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            width="820.75903"
            height="568.3632"
            viewBox="0 0 820.75903 568.3632"
          >
            <path
              d="M850.57591,504.82881l-9.66971,13.186a9.3336,9.3336,0,0,1-11.76852,2.79447h0a9.33361,9.33361,0,0,1-.905-16.10031l12.33107-8.151L875.824,461.29756l3.91782-12.62406h26.55406l-13.93,30.03656Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#ffb8b8"
            />
            <path
              d="M559.92029,504.0647a4.636,4.636,0,0,0-4.63051,4.63052V728.18176a4.636,4.636,0,0,0,4.63051,4.63052H856.27343a4.636,4.636,0,0,0,4.63052-4.63052V508.69522a4.636,4.636,0,0,0-4.63052-4.63052Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M568.16156,720.28566H848.03217V516.59132H568.16156Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#fff"
            />
            <path
              d="M808.5791,574.91163H640.02825a6.01967,6.01967,0,1,0,0,12.03934H808.5791a6.01967,6.01967,0,0,0,0-12.03934Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M640.02825,611.95577a6.01967,6.01967,0,1,0,0,12.03934H808.5791a6.01967,6.01967,0,0,0,0-12.03934Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M640.02825,648.99991a6.01968,6.01968,0,0,0,0,12.03935H808.5791a6.01968,6.01968,0,0,0,0-12.03935Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <circle cx="418.45719" cy="415.57595" r="7.40883" fill="#6c63ff" />
            <circle cx="418.45719" cy="452.62009" r="7.40883" fill="#e6e6e6" />
            <circle cx="418.45719" cy="489.66423" r="7.40883" fill="#e6e6e6" />
            <path
              d="M741.43659,580.93129h0a6.01967,6.01967,0,0,1-6.01967,6.01967H640.24514a6.16706,6.16706,0,0,1-6.1844-5.21971,6.03053,6.03053,0,0,1,5.96751-6.81964h95.38867A6.01966,6.01966,0,0,1,741.43659,580.93129Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <circle cx="518.47638" cy="288.2367" r="24.07869" fill="#e6e6e6" />
            <circle cx="518.47638" cy="288.2367" r="12.03935" fill="#fff" />
            <path
              d="M976.81653,696.3663l-12.18875,5.65906L946.10627,666.8311c-11.43465-17.5167-18.8982-38.50844-24.13911-61.44511l19.15374,1.30594c11.40283,16.27531,19.85274,32.59328,22.57568,48.99407Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#ffb8b8"
            />
            <polygon
              points="755.418 445.227 731.041 445.227 731.041 403.001 750.63 399.519 755.418 445.227"
              fill="#2f2e41"
            />
            <path
              d="M913.71168,451.75943a120.11147,120.11147,0,0,0-36.0424-1.35786l7.04551-35.13738a16.44328,16.44328,0,0,1,13.99678-13.07257h0a16.44328,16.44328,0,0,1,18.46977,18.10791Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <circle cx="706.88089" cy="193.39839" r="20.45969" fill="#ffb8b8" />
            <path
              d="M928.06153,382.94132l-26.98937,19.15375-7.18266-34.172,20.242-8.05328C914.95167,368.82863,919.79075,376.45422,928.06153,382.94132Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#ffb8b8"
            />
            <path
              d="M916.96106,357.04023c-1.51333-3.11862-3.4078-.95452-5.09064,2.84938l-2.41407-9.6563-2.89689-.96563-1.93126-7.725c-8.85818-2.1154-15.96653,2.31011-25.104,7.22665l-3.4825,8.27094h0a20.99359,20.99359,0,0,1,14.1442-29.69143,22.04535,22.04535,0,0,1,4.618-.5353h0a21.92851,21.92851,0,0,1,22.14623,22.61226Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#2f2e41"
            />
            <path
              d="M980.35075,713.05925,938.70249,726.6437a6.33355,6.33355,0,0,1-7.09-3.57275h0a6.336,6.336,0,0,1,2.195-7.84913c8.214-5.62314,14.76-11.62212,17.76093-18.4202,2.77512-11.27216,5.91169-11.29777,9.31937-2.88766,9.41076,5.56676,7.89057,1.10821,13.7522-5.81859l9.03629,17.10442A5.50767,5.50767,0,0,1,980.35075,713.05925Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#2f2e41"
            />
            <path
              d="M881.91841,722.92036l-13.93-6.09437,4.99324-35.687,9.80738-70.09392,26.55406,3.4825a162.12855,162.12855,0,0,1-17.69163,69.92408Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#ffb8b8"
            />
            <path
              d="M927.19091,621.92787l-46.14313-9.14156,12.18875-63.99094L891.06,531.38287H951.5684C949.36118,553.92586,938.83249,587.20872,927.19091,621.92787Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#2f2e41"
            />
            <path
              d="M953.745,537.47725c-22.33506-5.65333-44.30575-6.45333-65.73219,0-4.008-41.30066-5.11065-80.68359-1.60372-117.02384a33.77444,33.77444,0,0,1,11.84359-22.62169l25.45576-21.42009,18.90169,9.45085a14.97413,14.97413,0,0,1,8.2743,13.08421C955.01094,453.88944,958.17514,506.1733,953.745,537.47725Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <path
              d="M975.9459,530.51225l3.80541,13.31891a10.1802,10.1802,0,0,1-8.20077,12.85233h0A10.18018,10.18018,0,0,1,959.869,545.30411l1.71155-13.05061L952.439,466.086l-12.18875-26.11875,24.3775-10.88281L974.64,461.73288Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#ffb8b8"
            />
            <path
              d="M877.47779,733.99325l-42.66-9.96177A6.33356,6.33356,0,0,1,830.605,717.302h0a6.336,6.336,0,0,1,5.94443-5.5759c9.939-.55326,18.64614-2.2922,24.73523-6.55156,8.21427-8.203,10.9102-6.59964,9.467,2.35912,5.16443,9.63742,6.17446,5.03639,14.777,2.14925l-1.13417,19.31137A5.50768,5.50768,0,0,1,877.47779,733.99325Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#2f2e41"
            />
            <path
              d="M968.54559,432.13163c-10.30732.84945-21.55169,6.82081-33.08375,14.36531l-8.84578-34.72789a16.44328,16.44328,0,0,1,6.9654-17.84055l0,0a16.44329,16.44329,0,0,1,24.485,8.3376Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <path
              d="M194.20943,240.61825a4.59435,4.59435,0,0,0-4.589,4.589V462.72333a4.59435,4.59435,0,0,0,4.589,4.589H487.9021a4.59435,4.59435,0,0,0,4.58895-4.589V245.2072a4.59435,4.59435,0,0,0-4.58895-4.589Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M201.12026,455.8125h279.8706V252.11816H201.12026Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#fff"
            />
            <path
              d="M228.62654,348.24342a5.96563,5.96563,0,0,0,0,11.93127H453.485a5.96563,5.96563,0,1,0,0-11.93127Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M228.62654,384.955a5.96563,5.96563,0,1,0,0,11.93126H453.485a5.96563,5.96563,0,1,0,0-11.93126Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#e6e6e6"
            />
            <path
              d="M329.1245,423.50217a5.96563,5.96563,0,0,0,0,11.93126H352.987a5.96563,5.96563,0,0,0,0-11.93126Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <path
              d="M309.08012,272.49307a1.83739,1.83739,0,0,0-1.83558,1.83558v46.59619a1.83739,1.83739,0,0,0,1.83558,1.83558h63.95129a1.83739,1.83739,0,0,0,1.83558-1.83558V274.32865a1.83739,1.83739,0,0,0-1.83558-1.83558Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#6c63ff"
            />
            <circle cx="151.43528" cy="126.65496" r="10.09569" fill="#fff" />
            <path
              d="M357.576,318.17147a10.01752,10.01752,0,0,1-1.10136,4.589H325.63691a10.09442,10.09442,0,0,1,8.99433-14.68463h12.84905A10.09,10.09,0,0,1,357.576,318.17147Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#fff"
            />
            <circle cx="151.43528" cy="126.65496" r="10.09569" fill="#fff" />
            <path
              d="M357.576,318.17147a10.01752,10.01752,0,0,1-1.10136,4.589H325.63691a10.09442,10.09442,0,0,1,8.99433-14.68463h12.84905A10.09,10.09,0,0,1,357.576,318.17147Z"
              transform="translate(-189.62048 -165.8184)"
              fill="#fff"
            />
            <circle cx="151.43528" cy="23.86253" r="23.86253" fill="#e6e6e6" />
            <circle cx="151.43528" cy="23.86253" r="11.93126" fill="#6c63ff" />
            <polygon
              points="820.364 567.695 246.283 567.695 246.283 565.514 820.759 565.514 820.364 567.695"
              fill="#3f3d56"
            />
          </svg>
        </div>
      </div>
      <div className="col">
        <div className="d-flex flex-column height-100">
          <div className="go-back d-flex align-items-center">
            <button
              className="d-flex align-items-center btn back-btn"
              onClick={goHome}
            >
              <span data-icon="back" className="d-flex align-items-center">
                <svg
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
              <span className="ml-2">
                <b>Home</b>
              </span>
            </button>
          </div>
          <div className="d-flex align-items-center flex-grow-1">
            <form className="col-md-12" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="col-md-12 col-form-label">Full Name</label>
                <div className="col-md-12">
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Name"
                    ref={register}
                    style={
                      errors.name
                        ? errors.name.message
                          ? { border: "1px solid red", marginBottom: "5px" }
                          : null
                        : null
                    }
                  />
                  {errors.name && (
                    <p
                      style={{ fontSize: "13px" }}
                      className="text-danger font-weight-bold"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-12 col-form-label">Username</label>
                <div className="col-md-12">
                  <input
                    className="form-control"
                    type="text"
                    name="username"
                    placeholder="Username"
                    ref={register}
                    style={
                      errors.username
                        ? errors.username.message
                          ? { border: "1px solid red", marginBottom: "5px" }
                          : null
                        : auth
                        ? auth.username
                          ? { border: "1px solid red", marginBottom: "5px" }
                          : null
                        : null
                    }
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {(errors.email && (
                    <p
                      style={{ fontSize: "13px" }}
                      className="text-danger font-weight-bold"
                    >
                      {errors.username.message}
                    </p>
                  )) ||
                  auth
                    ? auth.username && (
                        <p
                          style={{ fontSize: "13px" }}
                          className="text-danger font-weight-bold"
                        >
                          {auth}
                        </p>
                      )
                    : null}
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-12 col-form-label">E-mail</label>
                <div className="col-md-12">
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
                        ? auth.email
                          ? { border: "1px solid red", marginBottom: "5px" }
                          : null
                        : null
                    }
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {(errors.email && (
                    <p
                      style={{ fontSize: "13px" }}
                      className="text-danger font-weight-bold"
                    >
                      {errors.email.message}
                    </p>
                  )) ||
                  auth
                    ? auth.email && (
                        <p
                          style={{ fontSize: "13px" }}
                          className="text-danger font-weight-bold"
                        >
                          {auth.email}
                        </p>
                      )
                    : null}
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-12 col-form-label">Password</label>
                <div className="col-md-12">
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="*********"
                    ref={register}
                    style={
                      errors.password
                        ? errors.password.message
                          ? { border: "1px solid red", marginBottom: "5px" }
                          : null
                        : null
                    }
                  />
                  {errors.password && (
                    <p
                      style={{ fontSize: "13px" }}
                      className="text-danger font-weight-bold"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-md-12 d-inline-flex align-items-center mb-3">
                <button className="btn btn-action">Register</button>
              </div>
              <div className="col-md-12 d-flex float-right height-100 ml-auto">
                <span>Have an account?</span>
                <Link className="ml-1" to="/Login">
                  <b>Login</b>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  goHome: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object,
  auth: PropTypes.object,
  register: PropTypes.any,
};

export default Register;
