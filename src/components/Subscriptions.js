import React, {useEffect, useState} from "react";
import userService from "../services/user.service";
import PkSubscription from "../paypal/PkSubscription";

const Subscriptions = () => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('c');
    const [isLoading, setIsLoading] = useState(false);
    const [clientInfo, setClientInfo] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [subs, setSubs] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        userService.getSubscription().then(
            (response) => {
                setSubs(response.data);
                if (response.data && response.data instanceof Array && response.data.length > 0) {
                    setSelectedSub(response.data[0])
                }
                setIsLoading(false);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                setMessage(_content);
                setIsLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        setIsLoading(true);
        userService.getClientInfo(clientId).then(
            (response) => {
                setClientInfo(response.data);
                setIsLoading(false);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                setMessage(_content);
                setIsLoading(false);
            }
        );
    }, [clientId]);

    const handleSelection = (event) => {
        setSelectedSub(subs[event.target.selectedIndex]);
    }
    return (
        <div className="container">
            {clientInfo &&
            <div className="card">
                <div className="card-header">Client Information{isLoading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}</div>
                <div className="card-body">
                    <div className="form-group">
                        <label>Name:</label>
                        <label>{clientInfo.clientName}</label>
                    </div>

                    <div className="form-group">
                        <label>Address:</label>
                        <label>{clientInfo.address1}&nbsp;{clientInfo.address2}, {clientInfo.city}</label>
                        <label>{clientInfo.province}&nbsp;{clientInfo.postCode}</label>
                    </div>
                    <div className="form-group">
                        <label>Country:</label>
                        <label>{clientInfo.country}</label>
                    </div>
                    <div className="form-group">
                        <label>Contact Person:</label>
                        <label>{clientInfo.contactPerson}</label>
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <label>{clientInfo.phone}</label>
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <label>{clientInfo.email}</label>
                    </div>
                </div>
                {
                    selectedSub &&
                    <div className="card-footer">
                        <div className="d-flex container">
                            <span className="text-nowrap">Subscription:</span>
                            <div className="container">
                                <div className="dropdown">
                                    <select
                                        value={selectedSub.id}
                                        className="form-select"
                                        onChange={handleSelection}
                                    >
                                        {
                                            subs && subs.map((sub, index) => (
                                                <option value={sub.id} >
                                                    {sub.subscriptionName}
                                                </option>

                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="container">
                                <PkSubscription planId={selectedSub.paypalPlanId} amount={selectedSub.price * (100 + selectedSub.tax)/100.0} currency={selectedSub.currency} clientId={clientId} subId={selectedSub.id}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
            }
            {message && (
                <div className="form-group">
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {message}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Subscriptions;