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


  return (
          <div>
              {loading && (
                  <div>
                      <span className="spinner-border spinner-border-sm"></span>
                  </div>
              )}
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
