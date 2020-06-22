import React, { useState, useEffect } from "react";
import axios from "axios";
const CheckMail = ({ email, type }) => {
  const [time, setTime] = useState(30);

  const sendMail = async () => {
    setTime(30);
    const data = new FormData();
    data.append("email", email);
    data.append("type", type);
    const res = await axios.post("/api/actions/send_mail.php", data);
    // console.log(res.data);
  };

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      }
    }, 1000);
    return () =>
      setTimeout(() => {
        if (time > 0) {
          setTime(time - 1);
        }
      }, 1000);
  }, [time]);

  return (
    <div className="container height-100">
      <div className="row height-100">
        <div className="col">
          <div
            className="height-100"
            style={{
              backgroundImage:
                "url('/app/assets/img/undraw_files_sent_oeqg.png')",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
        <div className="col d-flex aling-items-center">
          <div className="form-group d-flex flex-column justify-content-center">
            <h1 className="title">
              <b>We have sent you email, please kindly check your inbox.</b>
            </h1>
            <p>
              Not receiving mails?{" "}
              <span
                className={time > 0 ? "text-link disabled" : "text-link"}
                onClick={time > 0 ? null : sendMail}
              >
                Try again
              </span>
              {time > 0 ? ` in ${time} seconds` : ""}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckMail;
