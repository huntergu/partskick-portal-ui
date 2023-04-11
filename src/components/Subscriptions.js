import React, {useEffect, useState} from "react";
import userService from "../services/user.service";
import {Link} from "react-router-dom";
import Pk1m10 from "../paypal/pk1m10";
import Pk1y10 from "../paypal/pk1y10";

const Subscriptions = () => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('c');
    const [isLoading, setIsLoading] = useState(false);
    const [clientInfo, setClientInfo] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedSub, setSelectedSub] = useState("pk1m10");

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
        setSelectedSub(event.target.value);
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
                <div className="card-footer">
                    <div className="d-flex container">
                        <span className="text-nowrap">Subscription:</span>
                        <div className="container">
                            <div className="dropdown">
                                <select
                                    value={selectedSub}
                                    className="form-select"
                                    onChange={handleSelection}
                                >
                                        <option value="pk1m10" >
                                            10 workstations for 1 month
                                        </option>

                                        <option value="pk1y10">
                                            10 workstations for 1 year
                                        </option>

                                </select>
                            </div>
                        </div>
                        <div className="container">
                            {
                                selectedSub === "pk1m10" ? <Pk1m10 /> : <Pk1y10 />
                            }
                        </div>
                    </div>
                </div>
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