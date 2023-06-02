import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import {clearMessage, setMessage} from "../slices/message";
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
  const [country, setCountry] = useState("");
  const [provstate, setProvstate] = useState("");
  const [province, setProvince] = useState("");
  const [countries, setCountries] = useState([]);
  const [pz, setPz] = useState();
  const [postCode, setPostCode] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState({
    clientName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    province: province || "",
    postCode: postCode || "",
    country: country || "",
    contactFirstName: "",
    contactLastName: "",
  });


  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    userService.getCpz().then(
        (response) => {
          setCountries(response.data.countries);
          setPz(response.data.ps);
          setInitialValues({...initialValues, "country": response.data.countries[0], "province": response.data.ps[response.data.countries[0]][0]})
          setIsLoading(false);
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data) ||
              error.message ||
              error.toString();
          console.log(error);
          setMessage(_content);
          setIsLoading(false);
        }
    );
  }, []);

  useEffect(() => {
    if (countries && countries.length > 0) {
      setCountry(countries[0]);
      setPostzip(countries[0] === "CAN" ? "Post Code" : "Zip Code");
      setProvstate(countries[0] === "CAN" ? "Province" : "State");
      setProvince(pz[countries[0]][0].code);
    }
  }, [countries, pz]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const phoneReg = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
  const usZipReg = /^\d{5}(-\d{4})?$/;
  const caPostReg = /[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i


  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    phone: Yup.string().required(messages[LOCALES.ENGLISH].field_required)
        .matches(phoneReg, messages[LOCALES.ENGLISH].invalid_phone),
    email: Yup.string()
        .email(messages[LOCALES.ENGLISH].invalid_email)
        .required(messages[LOCALES.ENGLISH].field_required),
    address1: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    city: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    contactFirstName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
    contactLastName: Yup.string().required(messages[LOCALES.ENGLISH].field_required),
  });

  const handleRegisterClient = (formValue) => {
    const { clientName, phone, email, address1, address2, city, postCode, contactFirstName, contactLastName } = formValue;

    setSuccessful(false);
    setIsLoading(true);

    dispatch(userService.registerClient({ clientName, phone, email, address1, address2, city, province, postCode, country, contactFirstName, contactLastName, createAccount }))
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
    setPostzip(event.target.value === "CAN" ? "Post Code" : "Zip Code");
    setProvstate(event.target.value === "CAN" ? "Province" : "State");
    setCountry(event.target.value);
    setProvince(pz[event.target.value][0].code);
  }

  const handleSelectionProv = (event) => {
    setProvince(event.target.value);
  }

  const validatePZ = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (country === "CAN") {
      if (!caPostReg.test(value)) {
        error = messages[LOCALES.ENGLISH].invalid_postcode;
      }
    } else if (country === "USA") {
      if (!usZipReg.test(value)) {
        error = messages[LOCALES.ENGLISH].invalid_zipcode;
      }
    }
    return error;
  }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegisterClient}
        >
          {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
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
                        name="country"
                        value={country}
                        className="form-select"
                        onChange={(event) => {
                          setFieldValue("country", event.target.value);
                          handleSelectionCountry(event);
                        }}
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
                        name="province"
                        value={province}
                        className="form-select"
                        onChange={(event) => {
                          setFieldValue("province", event.target.value);
                          handleSelectionProv(event);
                        }}
                    >
                      {pz && pz[country] && pz[country].map((pors, index) => (
                          <option value={pors.code}>
                            {pors.name}
                          </option>
                      ))}

                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="postCode">{postzip}</label>
                  <Field
                    name="postCode"
                    type="input"
                    className="form-control"
                    validate={validatePZ}
                  />
                  <ErrorMessage
                    name="postCode"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactFirstName">Contact First Name</label>
                  <Field
                    name="contactFirstName"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="contactFirstName"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactLastName">Contact Last Name</label>
                  <Field
                    name="contactLastName"
                    type="input"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="contactLastName"
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
                  <label>
                    <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={() => setCreateAccount(!createAccount)}
                    />
                    &nbsp;&nbsp;&nbsp;Create User Account For Contact Person
                  </label>
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
              )}
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
