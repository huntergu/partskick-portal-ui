import React, {useEffect, useState} from "react";
import userService from "../services/user.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch} from "react-redux";
import {clearMessage} from "../slices/message";

const ClientSubscriptions = () => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('c');
    const [isLoading, setIsLoading] = useState(false);
    const [clientInfo, setClientInfo] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [subs, setSubs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clientSubscriptionInfo, setClientSubscriptionInfo] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const getMinDate = () => {
        const today = new Date();
        // today.setHours(0, 0, 0, 0);
        return today;
    };

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
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
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
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(_content);
                setIsLoading(false);
            }
        );
    }, [clientId]);

    const refreshSubInfo = () => {
        setIsLoading(true);
        userService.getClientSubscriptionInfo(clientId).then(
            (response) => {
                setClientSubscriptionInfo(response.data);
                setIsLoading(false);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(_content);
                setIsLoading(false);
            }
        );
    }

    useEffect(() => {
        refreshSubInfo();
    }, []);

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
                        <label>{clientInfo.clientName}</label>
                    </div>

                    <div className="form-group">
                        <label>{clientInfo.address1}&nbsp;{clientInfo.address2}, {clientInfo.city}</label>
                        <label>{clientInfo.province}&nbsp;{clientInfo.postCode}</label>
                    </div>
                    <div className="form-group">
                        <label>{clientInfo.country}</label>
                    </div>
                    <div className="form-group">
                        <label>Contact Person:</label>
                        <label>{clientInfo.contactPerson}</label>
                    </div>
                    <div className="form-group">
                        <label>{clientInfo.phone}</label>
                    </div>
                    <div className="form-group">
                        <label>{clientInfo.email}</label>
                    </div>
                </div>
                {
                    selectedSub &&
                    <div className="card-footer">
                        <div className="d-flex container mb-3">
                            <span className="text-nowrap mr-3">Subscription:</span>
                            <div className="mr-3">
                                <div className="dropdown">
                                    <select
                                        value={selectedSub.id}
                                        className="form-select"
                                        onChange={handleSelection}
                                    >
                                        {
                                            subs && subs.map((sub, index) => (
                                                <option value={sub.id} >
                                                    {sub.subscriptionName + "  " + sub.price}
                                                </option>

                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <span className="text-nowrap mr-3">Start Date:</span>
                            <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={date => setSelectedDate(date)}
                                    minDate={getMinDate()}
                                    popperPlacement="top-start"
                                    popperModifiers={{
                                        preventOverflow: {
                                            enabled: true,
                                            escapeWithReference: false,
                                            boundariesElement: 'viewport',
                                        },
                                        flip: {
                                            enabled: true,
                                        },
                                        offset: {
                                            enabled: true,
                                            offset: '5px, 10px'
                                        },
                                    }}
                                    style={{zIndex: 9999}}
                                />
                            </div>
                        </div>
                        <div className="d-flex container">
                            <div>
                            {/*    subscription*/}
                            </div>
                        </div>
                    </div>
                }
            </div>
            }
            {
                clientSubscriptionInfo &&
                <div className="row mt-5">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Subscription</th>
                            <th scope="col">Max Workstation</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Payment ID</th>
                            <th scope="col">Active</th>
                            <th scope="col">Enrolled Workstation</th>

                        </tr>
                        </thead>
                        <tbody>
                        {clientSubscriptionInfo instanceof Array && clientSubscriptionInfo.length > 0 && clientSubscriptionInfo.map((cs, index) => (
                            <tr className={cs.active ? "bg-white" : "bg-light"}>
                                <th scope="row">{cs.subscriptionName}</th>
                                <td>{cs.maxWS}</td>
                                <td>{cs.startDate}</td>
                                <td>{cs.endDate}</td>
                                <td>{cs.paymentId}</td>
                                <td>{cs.active && <span>&#x2713;</span> || <span>X</span>}</td>
                                <td>{cs.enrolledWS}</td>
                            </tr>

                        ))}
                        </tbody>
                    </table>
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

export default ClientSubscriptions;