import { PayPalButton } from "react-paypal-button-v2";
import React from 'react';
export function PayPalBtn(props) {
    const { amount, currency, createSubscription, onApprove, catchError,onError, onCancel} = props;
    const paypalKey = "AXL7AHsefNQFuCcpnjKGjsgE1_69VFRjHA1C4o3WmL3z0tVllUMtI-WmPy15GYxELf8IHrpwFEeoUlBk"
    return (
        <PayPalButton
            amount={amount}
            currency={currency}
            createSubscription={(data, details) => createSubscription(data, details)}
            onApprove={(data, details) => onApprove(data, details)}
            onError={(err) => onError(err)}
            catchError={(err) => catchError(err)}
            onCancel={(err) => onCancel(err)}
            options={{
                clientId: paypalKey,
                vault:true
            }}
            style={{
                shape: 'rect',
                color: 'blue',
                layout: 'horizontal',
                label: 'subscribe',
            }}
        />
    );
}
export default PayPalBtn;