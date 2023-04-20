import React, {useEffect, useState} from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import userService from "../services/user.service";
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "../slices/message";

const ButtonWrapper = ({ type, startDate, planId, clientIds, subId, callback }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [successful, setSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { message } = useSelector((state) => state.message);
    const reduxDispatch = useDispatch();
    const [ppMsg, setPpMsg] = useState(null);
    const [ppSucc, setPpSucc] = useState(true);

    const ppTimestamp = startDate.getTime() + 10 * 60 * 1000;
    const ppDate = new Date(ppTimestamp);
    let dateString = ppDate.toISOString();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate.getFullYear() === today.getFullYear() &&
        startDate.getMonth() === today.getMonth() &&
        startDate.getDate() === today.getDate()) {
        // the date is today. If user selected today, then let paypal decide start from today or tomorrow
    } else {
        const td = new Date(startDate);
        td.setHours(0,0,0,0);
        dateString = td.toISOString();
    }

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                intent: "subscription",
            },
        });
    }, [type, startDate, planId]);

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
            {isPending ? <div className="spinner" /> : null}
            <PayPalButtons
            createSubscription={(data, actions) => {
                return actions.subscription
                    .create({
                        plan_id: planId,
                        start_time: dateString
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            onApprove={(data, detail) => {
                // call the backend api to store transaction details
                const paymentId = data.subscriptionID;
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
                console.log(data.subscriptionID)
            }}
            catchError={paypalOnError}
            onError={paypalOnError}
            style={{
                label: "subscribe",
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
const PaypalSubscription = (props) => {
    const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

    return (
        <PayPalScriptProvider
            options={{
                "client-id": PAYPAL_CLIENT_ID,
                components: "buttons",
                intent: "subscription",
                vault: true,
            }}
        >
            <ButtonWrapper type="subscription" startDate={props.sd} planId={props.pid} clientIds={props.clientIds} subId={props.subId} callback={props.callback} />
        </PayPalScriptProvider>
    );
}

export default PaypalSubscription;