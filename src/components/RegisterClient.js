import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import {clearMessage} from "../slices/message";
import {LOCALES} from "../i18n/locales";
import {messages} from "../i18n/messages";
import {Navigate} from "react-router-dom";
import userService from "../services/user.service";

const RegisterClient = () => {
  const [successful, setSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const [postzip, setPostzip] = useState("Post Code");
  const [countryCode, setCountryCode] = useState("");
  const [provstate, setProvstate] = useState("");
  const [content, setContent] = useState("");
  const [countries, setCountries] = useState([]);
  const [pz, setPz] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    userService.getCpz().then(
        (response) => {
          setContent(response.data);
          setCountries(response.data.countries);
          setPz(response.data.ps);
        },
        (error) => {
          const _content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();

          setContent(_content);
        }
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (countries && countries.length > 0) {
      setCountryCode(countries[0]);
      setPostzip(countries[0] === "CAN" ? "Post Code" : "Zip Code");
      setProvstate(countries[0] === "CAN" ? "Province" : "State");

    }
  }, [countries]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  const usZipReg = /\d{5}(-\d{4})?$/;
  const caPostReg = /[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/

  const initialValues = {
    clientName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postcode: "",
    country: "",
    contact: "",
  };

/*
  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    phone: Yup.string().required(messages[LOCALES.ENGLISH].field_required)
        .matches(phoneReg, messages[LOCALES.ENGLISH].invalid_phone),
    email: Yup.string()
        .email(messages[LOCALES.ENGLISH].invalid_email)
        .required(messages[LOCALES.ENGLISH].field_required),
    address1: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    city: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    country: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    province: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    postcode: Yup.string().required(messages[LOCALES.ENGLISH].field_required)
        .when("country", {
          is: (country) => country === "CAN",
          then: Yup.string().matches(caPostReg, messages[LOCALES.ENGLISH].invalid_postcode),
          otherwise: Yup.string().matches(usZipReg, messages[LOCALES.ENGLISH].invalid_zipcode)
        }),
    contact: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
  });
*/

  const handleRegisterClient = (formValue) => {
    const { clientName, phone, email, address1, address2, city, province, postcode, country, contact } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(userService.registerClient({ clientName, phone, email, address1, address2, city, province, postcode, country, contact }))
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

  const handleSelectionCountry = (event) => {
    setPostzip(countries[event.target.selectedIndex] === "CAN" ? "Post Code" : "Zip Code");
    setProvstate(countries[event.target.selectedIndex] === "CAN" ? "Province" : "State");
    setCountryCode(countries[event.target.selectedIndex]);
  }

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
          // validationSchema={validationSchema}
          onSubmit={handleRegisterClient}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="clientName">Name</label>
                  <Field
                    name="clientName"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="clientName"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <Field
                    name="phone"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address1">Address1</label>
                  <Field
                    name="address1"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="address1"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address2">Address2</label>
                  <Field
                    name="address2"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="address2"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <Field
                    name="city"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <div className="dropdown">
                    <select
                        className="form-select"
                        onChange={handleSelectionCountry}
                    >

                      {countries && countries.map((country, index) => (
                          <option value={country}>
                            {country}
                          </option>
                      ))}

                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="province">{provstate}</label>
                  <div className="dropdown">
                    <select
                        className="form-select"
                    >
                      {pz && pz[countryCode] && pz[countryCode].map((pors, index) => (
                          <option value={pors.name}>
                            {pors.name}
                          </option>
                      ))}

                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">{postzip}</label>
                  <Field
                    name="postcode"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="postcode"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact">Contact Person</label>
                  <Field
                    name="contact"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="contact"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Register</span></button>
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

export default RegisterClient;
