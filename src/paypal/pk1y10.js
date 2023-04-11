import PayPalBtn from "./PaypalBtn";

const paypalSubscribe = (data, actions) => {
    return actions.subscription.create({
        'plan_id': "P-71V73219M84948259MQ2MGAQ",
    });
};
const paypalOnError = (err) => {
    console.log(err);
}
const paypalOnApprove = (data, detail) => {
// call the backend api to store transaction details
    console.log(data.subscriptionID)
};

const Pk1y10 = () => {
    return (
        <div>
            <PayPalBtn
                amount = "1130.00"
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

export default Pk1y10;