import React, { useState, useEffect } from "react";
import { Check, Clear, Close } from "@material-ui/icons";
const UserEditPane = ({ setCloseState, tempData, setTempData, updateData }) => {
  const [inputs, setInputs] = useState([
    {
      type: "text",
      name: "name",
      className: "form-control",
      label: "Name",
      value: tempData.name,
      onChange: function(e, data) {
        const temp = [...inputs];
        const index = temp.indexOf(data);
        temp[index].value = e.target.value;
        setInputs(temp);
      },
    },
    {
      type: "select",
      name: "level",
      className: "form-control",
      label: "Level",
      value: tempData.level,
      onChange: function(e, data) {
        const temp = [...inputs];
        const index = temp.indexOf(data);
        temp[index].value = e.target.value;
        setInputs(temp);
      },
    },
  ]);

  const [options, setOptions] = useState([
    { level: "reader" },
    { level: "author" },
    { level: "admin" },
  ]);

  useEffect(() => {
    setTempData({
      ...tempData,
      name: inputs.filter((input) => input.name === "name")[0].value,
      level: inputs.filter((input) => input.name === "level")[0].value,
    });
  }, [inputs]);

  return (
    <div className="user-edit-pane inner-edit-pane">
      <header>
        <h1>Edit User</h1>
        <Close
          fontSize="small"
          className="ml-auto close-btn"
          onClick={() => setCloseState(false)}
        />
      </header>
      <div className="form">
        {inputs.map((input, index) => {
          if (input.type === "select") {
            return (
              <div key={index} className="form-group">
                <label>{input.label}</label>
                <select
                  name={input.className}
                  className={input.className}
                  value={input.value}
                  onChange={(e) => input.onChange(e, input)}
                >
                  {options.map((option) => {
                    return (
                      <option key={option.level} value={option.level}>
                        {option.level}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          } else {
            return (
              <div key={index} className="form-group">
                <label>{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  className={input.className}
                  value={input.value}
                  onChange={(e) => input.onChange(e, input)}
                />
              </div>
            );
          }
        })}
        <div className="btn-action d-flex justify-content-end">
          <button className="btn btn-success d-flex align-items-center mr-2">
            <Check onClick={updateData} />
          </button>
          <button className="btn btn-danger d-flex align-items-center">
            <Clear onClick={() => setCloseState(false)} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditPane;
