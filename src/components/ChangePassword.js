import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";

const ChangePassword = () => {
  const [successful, setSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    oldPassword: "",
    password: "",
    matchingPassword: ""
  };

  YupPassword(Yup);

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().password()
        .min(8, "Password must be between 8 and 30 characters.")
        .max(30, "Password must be between 8 and 30 characters.")
        .minUppercase(1, "Password must contain at least 1 upper case letter.")
        .minNumbers(1, 'Password must contain at least 1 number.')
        .minSymbols(1, 'Password must contain at least 1 special character.')
        .required("This field is required!"),
    password: Yup.string().password()
      .min(8, "Password must be between 8 and 30 characters.")
      .max(30, "Password must be between 8 and 30 characters.")
      .minUppercase(1, "Password must contain at least 1 upper case letter.")
      .minNumbers(1, 'Password must contain at least 1 number.')
      .minSymbols(1, 'Password must contain at least 1 special character.')
      .required("This field is required!"),
      matchingPassword: Yup.string()
      .min(8, "Password must be between 8 and 30 characters.")
      .max(30, "Password must be between 8 and 30 characters.")
      .minUppercase(1, "Password must contain at least 1 upper case letter.")
      .minNumbers(1, 'Password must contain at least 1 number.')
      .minSymbols(1, 'Password must contain at least 1 special character.')
      .oneOf([Yup.ref('password'), null], 'Passwords must match.')
      .required("This field is required!"),
  });

  const handleChangePassword = (formValue) => {
    const { oldPassword, password, matchingPassword } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(register({ oldPassword, password, matchingPassword }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
        setIsLoading(false);
      })
      .catch(() => {
        setSuccessful(false);
        setIsLoading(false);
      });
  };

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="oldPassword">Old Password</label>
                  <Field
                    name="oldPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="matchingPassword">Repeat Password</label>
                  <Field
                    name="matchingPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="matchingPassword"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Change</span></button>
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>

      {message && (
        <div className="form-group">
          <div
            className={successful ? "alert alert-success" : "alert alert-danger"}
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
