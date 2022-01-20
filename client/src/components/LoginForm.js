import React from "react";
import FormikInputField from "./FormikInputField";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userReducer";


const initialValues = {
  username: "StockWizard",
  password: "password"
};


const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    dispatch(login(values));
    history.push("/");
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit
  });


  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormikInputField
          name={"username"}
          type={"text"}
          formik={formik}
          value={formik.values.username}
        />
        <FormikInputField
          name={"password"}
          type={"text"}
          formik={formik}
          value={formik.values.password}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};


export default LoginForm;