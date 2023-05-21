import React, {useEffect, useRef, useState} from "react";
import monerisService from "../../services/moneris.service";

const PaymentApproved = () => {
  const formRef = useRef(null);
  const [txKey, setTxKey] = useState("");
  const [orderId, setOrderId] = useState("");
  const [verifySent, setVerifySent] = useState(false);
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
        if (!verifySent && txKey && formRef.current) {
            formRef.current.submit();
            setVerifySent(true);
        }
    }, [txKey])


    useEffect(() => {
        const fetchData = async () => {
            if (verifySent) {
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
                            clearInterval(interval);
                            setLoading(false);
                        }

                    }
                );
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 5000); // 5 seconds

        return () => {
            clearInterval(interval);
        };
    }, [verifySent]);


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

              {txKey && !verifySent &&
              <form ref={formRef} id="moneris_form" method="POST" action={process.env.REACT_APP_MONERIS_URL_VERIFY}>
                  <input type="hidden" name="ps_store_id" value={process.env.REACT_APP_MONERIS_STORE} />
                  <input type="hidden" name="hpp_key" value={process.env.REACT_APP_MONERIS_HPPKEY} />
                  <input type="hidden" name="transactionKey" value={txKey} />
              </form>
              }

          </div>
  );
};

export default PaymentApproved;
