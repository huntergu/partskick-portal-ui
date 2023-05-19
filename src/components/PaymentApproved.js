import React, {useEffect, useRef, useState} from "react";

const PaymentApproved = () => {
  const formRef = useRef(null);
  const [txKey, setTxKey] = useState("");
  const [orderId, setOrderId] = useState("");
  const [verifySent, setVerifySent] = useState(false);
  const [loading, setLoading] = useState(true);

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
                try {
                    // Make API call here
                    const response = await fetch('https://api.example.com/data');
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        const interval = setInterval(() => {
            fetchData();
        }, 10000); // 10 seconds

        return () => {
            clearInterval(interval);
        };
    }, [verifySent]);


  const handleBack = () => {
    // Handle back button click
    window.close();
  };


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
              <div className="container">
                  <div className="card">
                      <div className="card-header">Order Detail: (All amount includes tax)</div>
                      <div className="card-body">
                          <div className="d-flex container">
                              <div className="container">
                                  <span>{message1}</span><br/>
                              </div>
                              <div className="container">
                                  <span className="mt-3">{message2}</span>
                              </div>
                              <div className="container">
                                  <div className="d-flex justify-content-center">
                                      <button className="btn btn-primary" style={centerStyle} onClick={handleContinue}>Continue</button>
                                  </div>
                                  <div className="d-flex justify-content-center mt-3">
                                      <button className="btn btn-secondary" style={centerStyle} onClick={handleBack}>Back</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

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
