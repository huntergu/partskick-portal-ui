import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";

import {logout} from "./slices/auth";

import EventBus from "./common/EventBus";
import ChangePassword from "./components/ChangePassword";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import RegisterClient from "./components/RegisterClient";
import ClientSubscriptions from "./components/ClientSubscriptions";
import Subscriptions from "./components/Subscriptions";
import Checkout from "./components/Checkout";
import PaymentDeclined from "./components/moneris/PaymentDeclined";
import PaymentApproved from "./components/moneris/PaymentApproved";
import Receipt from "./components/moneris/Receipt";
import PaymentValidation from "./components/moneris/PaymentValidation";
import CreateUser from "./components/CreateUser";
import ClientDiscount from "./components/ClientDiscount";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            PartsKick
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showAdminBoard && (
                <li className="nav-item dropdown">
                  <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                  >
                    Admin
                  </a>
                  <div className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                    <Link to={"/createUser"} className="dropdown-item">
                      Create User
                    </Link>
                    <Link to={"/clientDiscount"} className="dropdown-item">
                      Set Client Discount
                    </Link>
                  </div>
                </li>

            )}

            <li className="nav-item">
              <Link to={"/subscriptions"} className="nav-link">
                Subscriptions
              </Link>
            </li>

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/registerNewClient" element={<RegisterClient />} />
            <Route path="/manageSubscription" element={<ClientSubscriptions />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/declined" element={<PaymentDeclined />} />
            <Route path="/payment/approved" element={<PaymentApproved />} />
            <Route path="/payment/validation" element={<PaymentValidation />} />
            <Route path="/payment/receipt" element={<Receipt />} />
            <Route path="/createUser" element={<CreateUser />} />
            <Route path="/clientDiscount" element={<ClientDiscount />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
