import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ForgetPassword from "./ForgetPassword";
import CheckMail from "../CheckMail";

const ForgetPasswordGroup = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Please fill with registered email")
      .email("Email is in invalid form"),
  });

  const { register, errors, handleSubmit, watch } = useForm({
    validationSchema: schema,
  });

  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(null);

  const onSubmit = async (formData) => {
    setAuth(null);
    setLoading(!loading);
    const data = new FormData();
    data.append("email", formData.email);
    const res = await axios.post("/api/actions/forget_password.php", data);
    // console.log(res.data);
    if (res.data.success) {
      setAuth(res.data.error);
    } else {
      setAuth(res.data.error);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (auth !== null) {
      setLoading(!loading);
    }
  }, [auth]);

  return auth !== "" || auth === null ? (
    <ForgetPassword
      auth={auth}
      register={register}
      errors={errors}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      goBack={goBack}
      loading={loading}
    ></ForgetPassword>
  ) : (
    <CheckMail email={watch("email")} type={"forget"}></CheckMail>
  );
};

export default ForgetPasswordGroup;
