import React, {useEffect, useState} from "react";

const PaymentDeclined = () => {
    const [orderId, setOrderId] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        setOrderId(urlSearchParams.get("order"));
        setMsg(urlSearchParams.get("msg"));
    }, []);
  const handleBack = () => {
    window.close();
  };


  const centerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
  };

  return (
              <div className="container">
                  <div className="card">
                      <div className="card-header">Order Number: {orderId}</div>
                      <div className="card-body">
                          <div className="d-flex container">
                              <div className="container">
                                  <span>Status: Declined. <br/>Reason: {msg}</span><br/>
                              </div>
                              <div className="container">
                                  <div className="d-flex justify-content-center mt-3">
                                      <button className="btn btn-secondary" style={centerStyle} onClick={handleBack}>Back</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
  );
};

export default PaymentDeclined;
