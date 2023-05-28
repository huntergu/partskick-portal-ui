import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../slices/message";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(clearMessage());
  }, [dispatch]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
        {
            currentUser.roles && currentUser.roles.find(r => r === "CHANGE_PASSWORD_PRIVILEGE") &&
            <div>
                <a href={"/changePassword"}>
                    <span>Change Password</span></a>
            </div>
        }
    </div>
  );
};

export default Profile;
