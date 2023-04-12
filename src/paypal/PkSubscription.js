import PayPalBtn from "./PaypalBtn";
import userService from "../services/user.service";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";


const paypalOnError = (err) => {
    console.log(err);
}

const PkSubscription = (props) => {
    const dispatch = useDispatch();
    const [successful, setSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { message } = useSelector((state) => state.message);

    return (
        <div>
            {isLoading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
        <div>
            <PayPalBtn
                amount = {props.amount}
                currency = {props.currency}
                createSubscription={(data, actions) => {
                    return actions.subscription.create({
                        'plan_id': `${props.planId}`,
                    });
                }}
                onApprove={(data, detail) => {
                    // call the backend api to store transaction details
                    const {clientId, subId} = props;
                    const paymentId = data.subscriptionID;
                    setSuccessful(false);
                    setIsLoading(true);

                    dispatch(userService.createClientSubscription({clientId, subId, paymentId}))
                        .unwrap()
                        .then(() => {

                            setSuccessful(true);
                            setIsLoading(false);
                        })
                        .catch(() => {
                            setSuccessful(false);
                            setIsLoading(false);
                        });
                    ;
                    console.log(data.subscriptionID)
                }}
                catchError={paypalOnError}
                onError={paypalOnError}
                onCancel={paypalOnError}
            />
        </div>
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
        </div>

    );
}

export default PkSubscription;