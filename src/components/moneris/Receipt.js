import React, {useEffect, useRef, useState} from "react";
import authFormField from "../../services/auth-form-field";

const Receipt = () => {
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        setOrderId(urlSearchParams.get("order"));
    }, []);

    useEffect(() => {
        if (orderId && formRef.current) {
            formRef.current.submit();
        }
    }, [orderId])

    return (
        <div>
            {loading && (
                <div>
                    <span className="spinner-border spinner-border-sm"></span>
                </div>
            )}
            {orderId &&
                <form ref={formRef} id="receipt_form" method="POST" action={process.env.REACT_APP_API_URL + "/moneris/receipt"}>
                    <input type="hidden" name="x-auth-token" value={authFormField()} />
                    <input type="hidden" name="order" value={orderId} />
                </form>
            }


        </div>
    )
}

export default Receipt;