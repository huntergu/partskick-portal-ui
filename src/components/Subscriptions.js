import React, { useState, useEffect } from "react";

import userService from "../services/user.service";
import {Link, Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import ListItemCB from "./ListItemCB";
import DatePicker from "react-datepicker";
import {clearMessage} from "../slices/message";
import monerisService from "../services/moneris.service";
import ListItemCBDiscount from "./ListItemCBDiscount";

const Subscriptions = () => {
  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };

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
  const [showSubs, setShowSubs] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getMinDate());
  const [timeZone, setTimeZone] = useState("");
  const [clientWithDisc, setClientWithDisc] = useState([]);
  const [clientWithoutDisc, setClientWithoutDisc] = useState([]);
  const [discountSub, setDiscountSub] = useState([]);
  const [displayClientWithDiscount, setDisplayClientWithDiscount] = useState([]);
  const [selectedDiscountSub, setSelectedDiscountSub] = useState(0);
  const [checkedDiscountClient, setCheckedDiscountClient] = useState([]);

  useEffect(() => {
    // Retrieve the client's timezone
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(clientTimezone);
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  });

  useEffect(() => {
    setLoading(true);
    userService.getClientList().then(
      (response) => {
        let cWithd = [];
        let cWithoutd = [];
        let disc = [];
        if (response.data && response.data instanceof Array) {
          setContent(response.data);
          response.data.map((c) => {
            if (c.subId) {
              cWithd.push(c);
              if (!disc.find(d => d.id === c.subId)) {
                disc.push({id: c.subId, name: c.subName})
              }
            } else {
              cWithoutd.push(c);
            }
          })
        }
        setClientWithoutDisc(cWithoutd);
        setClientWithDisc(cWithd);
        setDiscountSub(disc);
        if (disc.length > 0) {
          setSelectedDiscountSub(disc[0].id);
          filterDisplayForDiscountedClient(disc[0].id, cWithd);
        }
        setLoading(false);
        setResponseCode(200);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data) ||
            error.message ||
            error.toString();

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

/*  useEffect(() => {
    if (!currentUser) return;
    refreshSubInfo();
  }, [content, currentUser]);*/

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
                  error.response.data) ||
              error.message ||
              error.toString();
          setMessage(_content);
          setLoading(false);
        }
    );
  }, []);

  useEffect(() => {
    // console.log(checkedItems);
    setShowSubs(false);
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

    const handleDiscountClientCheck = (itemId, isChecked) => {
    if (isChecked) {
      setCheckedDiscountClient([...checkedDiscountClient, itemId]);
    } else {
      setCheckedDiscountClient(checkedDiscountClient.filter((id) => id !== itemId));
    }
  };

  const handleShowPlan = () => {
    if (checkedItems.length > 0) {
      let dis = subs.filter(s => s.multiShop === checkedItems.length);
      if (dis.length > 0) {
        setDisplaySubs(dis);
        setSelectedSub(dis[0]);
        setShowSubs(true);
      } else {
        alert("No available plan for " + checkedItems.length + " shops");
      }
    } else {
      alert("Please select at least one shop");
    }
  }

/*
  const refreshSubInfo = () => {
    setLoading(true);
    userService.getClientsSubs().then(
        (response) => {
          setClientsSubs(response.data);
          setResponseCode(200);
          setLoading(false);
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data) ||
              error.message ||
              error.toString();

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );
  }
*/

  const handleSelection = (event) => {
    setSelectedSub(displaySubs[event.target.selectedIndex]);
  }

  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  const handleSubscribe = (clientIds, sub, startDate) => {
    setLoading(true);
    let subId = sub.id;

    monerisService.preLoad(clientIds, subId, startDate, timeZone, false).then(
        (response) => {
          // console.log(response.data);
          setResponseCode(200);
          setLoading(false);
          localStorage.setItem("orderId", response.data);
          window.open("/checkout", "_blank");
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data) ||
              error.message ||
              error.toString();

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );

  }

  const handleDiscountSubscribe = (clientIds, startDate) => {
    if (!clientIds || clientIds.length === 0) {
      alert("Please select at least one client");
      return;
    }
    setLoading(true);

    monerisService.preLoad(clientIds, selectedDiscountSub, startDate, timeZone, true).then(
        (response) => {
          // console.log(response.data);
          setResponseCode(200);
          setLoading(false);
          localStorage.setItem("orderId", response.data);
          window.open("/checkout", "_blank");
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data) ||
              error.message ||
              error.toString();

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );
  }

  const handleSelectDiscount = (event) => {
    setSelectedDiscountSub(event.target.value);
    setCheckedDiscountClient([]);
    filterDisplayForDiscountedClient(event.target.value, clientWithDisc);
  }

  const filterDisplayForDiscountedClient = (_subId, clients) => {
    let d = [];
    clients.forEach((c) => {

      if (c.subId === parseInt(_subId)) {
        d.push(c);
      }
    });
    setDisplayClientWithDiscount(d);
  }

  return (
      <div>
        {
          clientWithoutDisc && clientWithoutDisc.length > 0 && (
                <div className="container">
                  <div className="card">
                    <div className="card-header">Clients {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}</div>
                    <div className="card-body">
                      <div className="d-flex container">
                        <div className="container">
                          {
                            clientWithoutDisc.map((c, index) => (
                                  <ListItemCB key={c.oid} item={c}  handleCheck={handleCheck} />
                              ))
                          }
                        </div>
                        <div className="container">
                          <div className="d-flex justify-content-center">
                            <button className="btn btn-primary" style={centerStyle} onClick={handleShowPlan}>Show Available Plans</button>
                          </div>
                          {
                              showSubs &&
                              <div className="container mt-3">
                                <button className="btn-primary" onClick={() => handleSubscribe(checkedItems, selectedSub, selectedDate)}>Subscribe</button>
                              </div>
                          }

                        </div>
                        {
                            showSubs && displaySubs && displaySubs.length > 0 &&
                            <div className="mr-3">
                              <div className="dropdown">
                                <select
                                    value={selectedSub.id}
                                    className="form-select"
                                    onChange={handleSelection}
                                >
                                  {
                                    displaySubs.map((sub, index) => (
                                        <option value={sub.id} >
                                          {sub.subscriptionName + "  " + currencyFormatter.format(sub.price) + " plus " + sub.tax + "% tax"}
                                        </option>

                                    ))
                                  }
                                </select>
                              </div>
                              <span className="text-nowrap mr-3">Start Date:</span>
                              <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    minDate={getMinDate()}
                                    popperPlacement="top-start"
                                    popperModifiers={{
                                      preventOverflow: {
                                        enabled: true,
                                        escapeWithReference: false,
                                        boundariesElement: 'viewport',
                                      },
                                      flip: {
                                        enabled: true,
                                      },
                                      offset: {
                                        enabled: true,
                                        offset: '5px, 10px'
                                      },
                                    }}
                                    style={{zIndex: 9999}}
                                />
                              </div>

                            </div>
                        }
                      </div>

                    </div>
                  </div>
                </div>

            )
        }
        {
          clientWithDisc && clientWithDisc.length > 0 && (
                <div className="container">
                  <div className="card">
                    <div className="card-header d-flex container justify-content-between">
                      <div className="dropdown mt-3 mr-5">
                        <select
                            value={selectedDiscountSub}
                            className="form-select"
                            onChange={handleSelectDiscount}
                        >
                          {
                            discountSub.map((sub, index) => (
                                <option value={sub.id} >
                                  {sub.name}
                                </option>

                            ))
                          }
                        </select>
                      </div>
                      <div>
                      <span className="text-nowrap mr-3">Start Date:</span>
                        <div>
                          <DatePicker
                              selected={selectedDate}
                              onChange={date => setSelectedDate(date)}
                              minDate={getMinDate()}
                              popperPlacement="top-start"
                              popperModifiers={{
                                preventOverflow: {
                                  enabled: true,
                                  escapeWithReference: false,
                                  boundariesElement: 'viewport',
                                },
                                flip: {
                                  enabled: true,
                                },
                                offset: {
                                  enabled: true,
                                  offset: '5px, 10px'
                                },
                              }}
                              style={{zIndex: 9999}}
                          />
                        </div>

                        {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    </div>
                      <div className="container mt-3">
                        <button className="btn-primary" onClick={() => handleDiscountSubscribe(checkedDiscountClient, selectedDate)}>Subscribe</button>
                      </div>

                    </div>
                    <div className="card-body">
                      <div className="d-flex container">
                        <div className="container">
                          <div className="row mt-4">
                            <table className="table">
                              <thead>
                              <tr>
                                <th scope="col">Client</th>
                                <th scope="col">Subscription</th>
                                <th scope="col">Price</th>
                                <th scope="col">Discount (%off)</th>
                              </tr>
                              </thead>
                              <tbody>
                              {
                                displayClientWithDiscount.map((c, index) => (
                                    <ListItemCBDiscount key={c.oid} item={c}  handleCheck={handleDiscountClientCheck} />
                                ))
                              }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            )
        }
        {responseCode >= 400 && content && (
            <div className="form-group pt-50">
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {
                  (typeof content) === "string" ? content : (content.hasOwnProperty("message") ? content.message : "something wrong")
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
