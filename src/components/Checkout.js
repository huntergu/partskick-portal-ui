import React, {useEffect, useRef, useState} from "react";
import monerisService from "../services/moneris.service";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const formRef = useRef(null);

  const handleContinue = () => {
    // Handle continue button click
    console.log('Continue clicked');
      if (formRef.current) {
          formRef.current.submit();
      }
  };

  const handleBack = () => {
    // Handle back button click
    console.log('Cancel clicked');
    window.close();
  };

  const storedOrderId = localStorage.getItem("orderId");
  localStorage.removeItem("orderId");

  useEffect(() => {
    if (!storedOrderId) {
      alert("failed to retrieve order ID.")
      window.close();
    }
    setLoading(true);
    monerisService.fetchOrder(storedOrderId).then(
      (response) => {
        var data = response.data;
        setContent(data);
        console.log(data);
        if (data.recurUnit === "eom") {
            // monthly
            if (data.recurStartNow) {
                const amt = data.chargeTotal - data.chargeTotalTax;
                setMessage1("Amount will be charged now is " + data.chargeTotal.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'CAD',
                    }) + " (" + amt.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'CAD',
                }) + " + " + data.chargeTotalTax.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'CAD',
                    })
                    +" tax), this is the subscription fee from " + data.selectedStartDate + " - " + data.recurStartDate);
            }
            const recAmt = data.recurAmount - data.recurAmountTax;
           setMessage2("Amount will be charged on " + data.recurStartDate + " is " + data.recurAmount.toLocaleString('en-US', {
                   style: 'currency',
                   currency: 'CAD',
               }) + " (" + recAmt.toLocaleString('en-US', {
               style: 'currency',
               currency: 'CAD',
           }) + " + " + data.recurAmountTax.toLocaleString('en-US', {
                   style: 'currency',
                   currency: 'CAD',
               })
               + " tax) (same amount will be charged on every month end for following month's subscription)");
        } else {
            // annual
            const amt = data.chargeTotal - data.chargeTotalTax;
            setMessage1("Amount will be charged now is " + data.chargeTotal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'CAD',
                }) + " (" +  amt.toLocaleString('en-US', {
                style: 'currency',
                currency: 'CAD',
            }) + " + " + data.chargeTotalTax.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'CAD',
                })
                + " tax) (Subscription fee for " + data.selectedStartDate + " - " + data.recurStartDate + ", and the same amount will be charged every year)");
        }
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        alert("failed to retrieve order.")
        window.close();
      }
    );
  }, []);

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
                      <div className="card-header">Order Detail:</div>
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
                                      <button className="btn btn-secondary" style={centerStyle} onClick={handleBack}>Cancel</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {content &&
              <form ref={formRef} id="moneris_form" method="POST" action={process.env.REACT_APP_MONERIS_URL}>
                  <input type="hidden" name="hpp_id" value={process.env.REACT_APP_MONERIS_STORE} />
                  <input type="hidden" name="hpp_preload" />
                  <input type="hidden" name="ticket" value={content.ticket} />
              </form>
              }


          </div>
  );
};

export default Checkout;
