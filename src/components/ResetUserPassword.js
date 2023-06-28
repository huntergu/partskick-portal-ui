import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {clearMessage} from "../slices/message";
import {messages} from "../i18n/messages";
import {LOCALES} from "../i18n/locales";
import {createUser, resetUserPassword} from "../services/admin.service";

const ResetUserPassword = () => {
  const [successful, setSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(messages[LOCALES.ENGLISH].invalid_email)
      .required(messages[LOCALES.ENGLISH].field_required),
  });

  const handleReset = (formValue) => {
    const { email } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(resetUserPassword({ email }))
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
          onSubmit={handleReset}
        >
          <Form>
            {!successful && (
              <div>
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
                  <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Reset Password</span></button>
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

export default ResetUserPassword;
