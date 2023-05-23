import React, {useEffect, useState} from "react";
import monerisService from "../../services/moneris.service";

const PaymentValidation = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [orderStatus, setOrderStatus] = useState(1);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        let o = urlSearchParams.get("order");
        setOrderId(o);
        monerisService.checkOrder(o).then(
            (response) => {
                let c = +response.data;
                setOrderStatus(c);
                switch (c) {
                    case 1:
                        setMessage("Transaction was approved but took too long to be verified, please confirm with customer service with the order ID.");
                        break;
                    case 9:
                        setMessage("Transaction was approved and verified.");
                        break;
                    case -99:
                        setMessage("Transaction was approved but failed to verify.");
                        break;
                    default:
                        setMessage("There was some issue with this transaction, please confirm with customer service with the order ID.");
                }
                setLoading(false);

            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(_content)
                setLoading(false);
            }
        );
      }, []);

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

export default PaymentValidation;
