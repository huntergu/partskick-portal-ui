import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";
import {messages} from "../i18n/messages";
import {LOCALES} from "../i18n/locales";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    matchingPassword: ""
  };

  YupPassword(Yup);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    lastName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    email: Yup.string()
      .email(messages[LOCALES.ENGLISH].invalid_email)
      .required(messages[LOCALES.ENGLISH].field_required),
    password: Yup.string().password()
        .min(8, messages[LOCALES.ENGLISH].password_length)
        .max(30, messages[LOCALES.ENGLISH].password_length)
        .minUppercase(1, messages[LOCALES.ENGLISH].password_upper_case)
        .minNumbers(1, messages[LOCALES.ENGLISH].password_number)
        .minSymbols(1, messages[LOCALES.ENGLISH].password_symbol)
        .required(messages[LOCALES.ENGLISH].field_required),
    matchingPassword: Yup.string()
        .min(8, messages[LOCALES.ENGLISH].password_length)
        .max(30, messages[LOCALES.ENGLISH].password_length)
        .minUppercase(1, messages[LOCALES.ENGLISH].password_upper_case)
        .minNumbers(1, messages[LOCALES.ENGLISH].password_number)
        .minSymbols(1, messages[LOCALES.ENGLISH].password_symbol)
        .oneOf([Yup.ref("password"), null], messages[LOCALES.ENGLISH].password_match)
        .required(messages[LOCALES.ENGLISH].field_required),
  });

  const handleRegister = (formValue) => {
    const { firstName, lastName, email, password, matchingPassword } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(register({ firstName, lastName, email, password, matchingPassword }))
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
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Field name="firstName" type="input" className="form-control" />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Field name="lastName" type="input" className="form-control" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
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
                    <span>Sign Up</span></button>
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

export default Register;
