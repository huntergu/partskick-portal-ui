import PayPalBtn from "./PaypalBtn";

const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
        'plan_id': "P-5D131030Y7774773XMQZXVFY",
    });
};
const paypalOnError = (err) => {
    console.log(err);
}
const paypalOnApprove = (data, detail) => {
// call the backend api to store transaction details
    console.log(data.subscriptionID)
};

const Pk1m10 = () => {
    return (
        <div>
            <PayPalBtn
                amount = "113.00"
                currency = "CAD"
                createSubscription={paypalSubscribe}
                onApprove={paypalOnApprove}
                catchError={paypalOnError}
                onError={paypalOnError}
                onCancel={paypalOnError}
            />
        </div>
    );
}

export default Pk1m10;