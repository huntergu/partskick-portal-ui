import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import { changePassword } from "../slices/auth";
import { clearMessage } from "../slices/message";
import {LOCALES} from "../i18n/locales";
import {messages} from "../i18n/messages";
import {Navigate} from "react-router-dom";

const ChangePassword = () => {
  const [successful, setSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }


  const initialValues = {
    oldPassword: "",
    newPassword: "",
    matchingPassword: ""
  };

  YupPassword(Yup);

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .required(messages[LOCALES.ENGLISH].field_required),
    newPassword: Yup.string().password()
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
        .oneOf([Yup.ref("newPassword"), null], messages[LOCALES.ENGLISH].password_match)
        .required(messages[LOCALES.ENGLISH].field_required),
  });

  const handleChangePassword = (formValue) => {
    const { oldPassword, newPassword, matchingPassword } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(changePassword({ oldPassword, newPassword, matchingPassword }))
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
                  <label htmlFor="newPassword">New Password</label>
                  <Field
                    name="newPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="matchingPassword">Repeat New Password</label>
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
