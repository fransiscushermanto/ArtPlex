import React from "react";

const CustomInput = ({
  register,
  errors,
  fontSize,
  label,
  name,
  type,
  placeholder,
  onChange,
}) => {
  return (
    <div className="form-group">
      <label className="col-md-12 col-form-label">{label}</label>
      <div className="col-md-12">
        <input
          className="form-control"
          type={type}
          name={name}
          placeholder={placeholder}
          ref={register}
          style={
            errors.name
              ? errors.name.message
                ? { border: "1px solid red", marginBottom: "5px" }
                : null
              : null
          }
          onChange={onChange}
        />
        {errors.name && (
          <p
            style={{ fontSize: fontSize }}
            className="text-danger font-weight-bold"
          >
            {errors.name.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
