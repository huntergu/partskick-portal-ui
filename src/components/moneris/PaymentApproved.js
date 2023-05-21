import React, {useEffect, useState} from "react";
import monerisService from "../../services/moneris.service";

const PaymentApproved = () => {
  const [txKey, setTxKey] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [message, setMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState(1);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        setTxKey(urlSearchParams.get("key"));
        setOrderId(urlSearchParams.get("order"));
    }, []);

    useEffect(() => {
        if (txKey) {
            monerisService.validateOrder(txKey).then(
                (response) => {
                    const fetchData = async () => {
                        monerisService.checkOrder(orderId).then(
                            (response) => {
                                let c = +response.data;
                                if (c === 1) {
                                    // waiting for verification
                                    setCheckCount(checkCount + 1);
                                    if (checkCount > 3) {
                                        // took too long, break
                                        setMessage("Transaction was approved but took too long to be verified, please confirm with customer service with the order ID.")
                                        clearInterval(interval);
                                        setLoading(false);
                                    }
                                } else {
                                    if (c === 9) {
                                        setMessage("Transaction was approved and verified.")
                                        setOrderStatus(9);

                                    } else if (c === -99) {
                                        setMessage("Transaction was approved but failed to verify.")
                                        setOrderStatus(-99);
                                    } else {
                                        setMessage("There was some issue with this transaction, please confirm with customer service with the order ID.")
                                        setOrderStatus(-1);
                                    }
                                    clearInterval(interval);
                                    setLoading(false);
                                }

                            },
                            (error) => {
                                const _content =
                                    (error.response &&
                                        error.response.data &&
                                        error.response.data.message) ||
                                    error.message ||
                                    error.toString();

                                setCheckCount(checkCount + 1);
                                if (checkCount > 3) {
                                    setMessage(_content)
                                    setLoading(false);
                                }

                            }
                        );
                    };

                    const interval = setInterval(() => {
                        fetchData();
                    }, 5000); // 5 seconds

                    return () => {
                        clearInterval(interval);
                    };

                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage(_content);
                }
            );
        }
    }, [txKey])


  const handleBack = () => {
    // Handle back button click
    window.close();
  };

  const handleReceipt = () => {
      window.open("/payment/receipt?order=" + orderId, "_blank");
  }

    const centerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

  return (
          <div>
              {loading && (
                  <div>
                      <span className="spinner-border spinner-border-sm"></span>
                  </div>
              )}
              {
                  orderId && (
                      <div className="container">
                          <div className="card">
                              <div className="card-header">Order ID: {orderId}</div>
                              <div className="card-body">
                                  {
                                      message && (
                                          <div className="d-flex container">
                                              <div className="container">
                                                  <span>{message}</span><br/>
                                              </div>
                                              <div className="container">
                                                  <div className="d-flex justify-content-center">
                                                      <button className="btn btn-primary" style={centerStyle} onClick={handleReceipt}>Receipt</button>
                                                  </div>
                                                  <div className="d-flex justify-content-center mt-3">
                                                      <button className="btn btn-secondary" style={centerStyle} onClick={handleBack}>Back</button>
                                                  </div>
                                              </div>
                                          </div>
                                      )
                                  }
                              </div>
                          </div>
                      </div>

                  )
              }

          </div>
  );
};

export default PaymentApproved;
