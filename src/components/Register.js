import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";
import LoadingSpinner from "./spinner";

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
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),
    email: Yup.string()
      .email("This is not a valid email.")
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
                  <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>Sign Up</button>
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
      <div>
        {isLoading && <LoadingSpinner />}
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
