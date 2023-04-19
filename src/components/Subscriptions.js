import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import {Link, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ListItemCB from "./ListItemCB";
import userService from "../services/user.service";

const Subscriptions = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseCode, setResponseCode] = useState(400);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [clientsSubs, setClientsSubs] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [subs, setSubs] = useState([]);
  const [message, setMessage] = useState(null);
  const [displaySubs, setDisplaySubs] = useState([]);

  useEffect(() => {
    setLoading(true);
    UserService.getClientList().then(
      (response) => {
        setContent(response.data);
        setLoading(false);
        setResponseCode(200);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    UserService.getClientsSubs().then(
      (response) => {
        setClientsSubs(response.data);
        setResponseCode(200);
        setLoading(false);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, [content, currentUser]);

  useEffect(() => {
    setLoading(true);
    userService.getSubscription().then(
        (response) => {
          setSubs(response.data);
          setLoading(false);
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
              error.message ||
              error.toString();
          setMessage(_content);
          setLoading(false);
        }
    );
  }, []);

  useEffect(() => {
    console.log(checkedItems);
  }, [checkedItems])

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleCheck = (itemId, isChecked) => {
    if (isChecked) {
      setCheckedItems([...checkedItems, itemId]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    }
  };

  return (
      <div>
        <div className="container">
          <div className="card">
            <div className="card-header">Clients {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}</div>
            <div className="card-body">
              <div className="d-flex container">
                <div className="container">
                  {
                      content && content instanceof Array && content.length > 0 && content.map((c, index) => (
                          <ListItemCB key={c.oid} item={c}  handleCheck={handleCheck} />
                      ))
                  }
                </div>
                <div className="container">
                    <button className="btn-primary">Choose Plan</button>
                </div>
                {
                    displaySubs && displaySubs.length > 0 &&
                    <div className="mr-3">
                      <div className="dropdown">
                        <select
                            value={selectedSub.id}
                            className="form-select"
                            // onChange={handleSelection}
                        >
                          {
                            displaySubs.map((sub, index) => (
                                  <option value={sub.id} >
                                    {sub.subscriptionName}
                                  </option>

                              ))
                          }
                        </select>
                      </div>
                    </div>
                }
              </div>

            </div>
          </div>
        </div>
        {responseCode >= 400 && content && (
            <div className="form-group pt-50">
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {
                  (typeof content) == "string" ? content : (content.hasOwnProperty("message") ? content.message : "something wrong")
                }
              </div>
            </div>
        )}

        <div className="row mt-5">
          <table className="table">
            <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Subscription</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Payment ID</th>
            </tr>
            </thead>
            <tbody>

            {clientsSubs && clientsSubs instanceof Array && clientsSubs.length > 0 && clientsSubs.map((cs, index) => (
                <tr>
                  <th scope="row">{cs.clientName}</th>
                  <td>{cs.subscriptionName}</td>
                  <td>{new Date(cs.startDate).toLocaleDateString()}</td>
                  <td>{new Date(cs.endDate).toLocaleDateString()}</td>
                  <td>{cs.paymentId}</td>
                </tr>

            ))}

            </tbody>
          </table>
        </div>
      </div>

  );
};

export default Subscriptions;
