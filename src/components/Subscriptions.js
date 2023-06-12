import React, {useEffect, useState} from "react";

import userService from "../services/user.service";
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import DatePicker from "react-datepicker";
import {clearMessage} from "../slices/message";
import monerisService from "../services/moneris.service";
import ListItemDiscount from "./ListItemDiscount";
import ListItemNoDiscount from "./ListItemNoDiscount";

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
  const [subs, setSubs] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getMinDate());
  const [timeZone, setTimeZone] = useState("");
  const [clientWithDisc, setClientWithDisc] = useState([]);
  const [clientWithoutDisc, setClientWithoutDisc] = useState([]);
  const [taxInfo, setTaxInfo] = useState(undefined);
  const [displayDiscount, setDisplayDiscount] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Retrieve the client's timezone
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimeZone(clientTimezone);
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    userService.getClientList().then(
      (response) => {
        let cWithd = [];
        let cWithoutd = [];
        if (response.data && response.data instanceof Array) {
          setContent(response.data);
          response.data.map((c) => {
            if (c.subId && c.subDiscount > 0) {
              cWithd.push(c);
              setDisplayDiscount(true);
            } else {
              cWithoutd.push(c);
            }
          })
        }
        setClientWithoutDisc(cWithoutd);
        setClientWithDisc(cWithd);
        setLoading(false);
        setResponseCode(200);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data) ||
            error.message ||
            error.toString();
        console.log(error);

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    userService.getTaxInfo().then(
        (response) => {
          if (response.data) {
            setTaxInfo(response.data);
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
          console.log(error);

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );
  }, []);

  useEffect(() => {
    refreshSubInfo();
  }, []);

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
          console.log(error);
          setMessage(_content);
          setLoading(false);
        }
    );
  }, []);


  if (!currentUser) {
    return <Navigate to="/login" />;
  }

    const handleDiscountItemSelect = (item) => {
        setSelectedItem(item);
    }

    const handleNoDiscountItemSelect = (item, sub) => {
        item.subPrice = sub.price;
        item.subDiscount = 0;
        item.subId = sub.id;
        setSelectedItem(item);
    }

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
        console.log(error);

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );
  }

  const handleSubscribe = (client, startDate) => {
    console.log(client);
    setLoading(true);

    monerisService.preLoad([client.oid], client.subId, startDate, timeZone, true).then(
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
          console.log(error);

          setContent(_content);
          setResponseCode(error.response.status);
          setLoading(false);
        }
    );
  }

  return (
      <div>
        {
            ((clientWithDisc && clientWithDisc.length > 0) || (clientWithoutDisc && clientWithoutDisc.length > 0)) && (
                <div className="container">
                  <div className="card">
                    <div className="card-header d-flex container justify-content-between">
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
                        {
                            selectedItem && (
                                <div className="container mt-3">
                                    <button className="btn-primary" onClick={() => handleSubscribe(selectedItem, selectedDate)}>Subscribe</button>
                                </div>
                            )
                        }
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
                                <th scope="col">Tax</th>
                                {
                                    displayDiscount && (
                                        <th scope="col">Discount (%off)</th>
                                    )
                                }
                              </tr>
                              </thead>
                              <tbody>
                              {
                                  subs.length > 0 && clientWithDisc && clientWithDisc.length > 0 && (
                                    clientWithDisc.map((c, index) => (
                                        <ListItemDiscount key={c.oid} item={c} handleCheck={handleDiscountItemSelect} />
                                    ))
                                  )
                              }
                              {
                                  subs.length > 0 && clientWithoutDisc && clientWithoutDisc.length > 0 && (
                                      clientWithoutDisc.map((c, index) => (
                                          subs.map(sub => (
                                              <ListItemNoDiscount key={c.oid + sub.id} item={c} displayDiscount={displayDiscount} subscription={sub} handleCheck={handleNoDiscountItemSelect} />
                                          ))
                                      ))
                                  )
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
              <th scope="col">
                <div className="container mt-3">
                  <button className="btn-primary" onClick={() => refreshSubInfo()}>Refresh</button>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>

            {clientsSubs && clientsSubs instanceof Array && clientsSubs.length > 0 && clientsSubs.map((cs, index) => (
                <tr>
                  <th scope="row">{cs.clientName}</th>
                  <td>{cs.subscriptionName}</td>
                  <td>{cs.startDate}</td>
                  <td>{cs.endDate}</td>
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
