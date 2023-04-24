import React, {useEffect, useState} from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import userService from "../services/user.service";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../slices/message";

const ButtonWrapper = ({ type, startDate, clientIds, subId, amount, tax, callback }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [successful, setSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { message } = useSelector((state) => state.message);
    const reduxDispatch = useDispatch();
    const [ppMsg, setPpMsg] = useState(null);
    const [ppSucc, setPpSucc] = useState(true);

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                intent: "capture",
            },
        });
    }, [type, startDate, subId]);

    const handleClearMessage = () => {
        reduxDispatch(clearMessage());
    }

    const paypalOnError = (err) => {
        console.log(err);
        setPpSucc(false);
        setPpMsg(err);
    }

    const handleClearPPMsg = () => {
        setPpMsg("");
    };

    return (
        <div>
            {isPending || isLoading? <div className="spinner" /> : null}
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: amount * (100 + tax)/100.0,
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                }}
                onApprove={(data, actions) => {
                    // call the backend api to store transaction details
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$");
                    console.log(data);
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$");
                    const paymentId = data.orderID;
                    setPpSucc(true);
                    setPpMsg("Payment ID: [" + paymentId + "], please provide this ID for any enquire about the payment.");
                    setSuccessful(false);
                    setIsLoading(true);

                    reduxDispatch(userService.createClientSubscription({clientIds, subId, paymentId, startDate}))
                        .unwrap()
                        .then(() => {

                            setSuccessful(true);
                            setIsLoading(false);
                            setTimeout(handleClearMessage, 5000);
                            callback();
                        })
                        .catch(() => {
                            setSuccessful(false);
                            setIsLoading(false);
                        });
                }}
                catchError={paypalOnError}
                onError={paypalOnError}
                style={{
                    label: "checkout",
                }}
            />
            {message && (
                <div className="form-group">
                    <div
                        className={successful ? "alert alert-success" : "alert alert-danger"}
                        role="alert"
                    >
                        {message}
                    </div>
                </div>
            )}
            {ppMsg && (
                <div className="form-group">
                    <div
                        className={ppSucc ? "alert alert-success" : "alert alert-danger"}
                        role="alert"
                    >
                        <p>{(typeof ppMsg) == "string" ? ppMsg : ppMsg.message}</p>
                        <button onClick={handleClearPPMsg}>Clear</button>
                    </div>
                </div>
            )}
        </div>);
}


const PaypalCheckout = ({startDate, clientIds, subId, amount, tax, currency, callback}) => {
    const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

    return (
        <PayPalScriptProvider
            options={{
                "client-id": PAYPAL_CLIENT_ID,
                components: "buttons",
                intent: "capture",
                currency: currency
            }}
        >
            <ButtonWrapper type="checkout" startDate={startDate} clientIds={clientIds} subId={subId} amount={amount} tax={tax} callback={callback} />
        </PayPalScriptProvider>
    );
}

export default PaypalCheckout;