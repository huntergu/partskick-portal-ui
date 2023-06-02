import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import {Link} from "react-router-dom";

const BoardAdmin = () => {
  const [content, setContent] = useState("");

/*  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data) ||
          error.message ||
          error.toString();
        console.log(error);
        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);*/

  return (
    <div className="container">
{/*
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
*/}
      <Link to="/createUser">
        <button className="btn-primary">Create New User</button>
      </Link>
      <Link to="/clientDiscount">
        <button className="btn-primary">Set Discount</button>
      </Link>

    </div>
  );
};

export default BoardAdmin;
