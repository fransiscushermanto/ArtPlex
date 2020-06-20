import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const VerifyEmail = ({ keyStatus }) => {
  const history = useHistory();
  const [time, setTime] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      }
    }, 1000);
    // if (time === 0) {
    //   history.push("/login");
    // }
  }, [time]);

  return keyStatus !== undefined ? (
    keyStatus ? (
      <div className="container height-100">
        <div className="row height-100">
          <div
            className="col"
            style={{
              backgroundImage:
                "url('/app/assets/img/undraw_verified_tw20.png')",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="col d-flex align-items-center">
            <div className="form-group">
              <h1>
                <b>Email Verified!</b>
              </h1>
              <p>
                Thank you for verifying your emails.{" "}
                {time > 0
                  ? `You will be redirected in ${time} seconds.`
                  : "Redirecting ..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="container height-100 d-flex align-items-center justify-content-center">
        <h1 className="text-danger">
          <b>Link not found or expired</b>
        </h1>
      </div>
    )
  ) : null;
};

export default VerifyEmail;
