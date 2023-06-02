import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import {Link, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const Home = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [responseCode, setResponseCode] = useState(400);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [workstations, setWorkstations] = useState([]);

  useEffect(() => {
    setLoading(true);
    UserService.getClientList().then(
      (response) => {
        setContent(response.data);
        if (response.data instanceof Array && response.data.length > 0) {
            setSelectedOption(response.data[0].oid);
        }
        setLoading(false);
        setResponseCode(200);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data) ||
            error.message ||
            error.toString();

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!currentUser || !selectedOption) return;
    setLoading(true);
    UserService.getWorkstationList(selectedOption).then(
      (response) => {
        setWorkstations(response.data);
        setResponseCode(200);
        setLoading(false);
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data) ||
            error.message ||
            error.toString();

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, [selectedOption, content, currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSelection = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
      <div>
        <div className="d-flex container">
          <span className="text-nowrap">Client:</span>
          <div className="container">
            <div className="dropdown">
              <select
                  value={selectedOption}
                  className="form-select"
                  onChange={handleSelection}
              >
                {!content &&
                    <option value="" disabled>
                      No client registration found
                    </option>
                }

                {responseCode === 200 && content && content.map((client, index) => (
                    <option value={client.oid}>
                      {client.clientName}
                    </option>
                ))}

              </select>
            </div>
          </div>
          <div className="container">
            {loading && (
                <span className="spinner-border spinner-border-sm text-success"></span>
            )}
          </div>
          <div className="container">
            <Link to="/registerNewClient">
              <button className="btn-primary">Register New Client</button>
            </Link>
          </div>
        </div>
        {responseCode >= 400 && content && (
            <div className="form-group pt-50">
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {
                  (typeof content) == "string" ? content : (content.hasOwnProperty("message") ? content.message : "something wrong")
                }
              </div>
            </div>
        )}
        <div className="d-flex container">
          <span className="text-nowrap">ID:</span>
          <div className="container">
            <span>{selectedOption}</span>
          </div>
        </div>
        <div className="row mt-5">
          <table className="table">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Workstation</th>
              <th scope="col">Subscription</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              {/*<th scope="col">Active</th>*/}
            </tr>
            </thead>
            <tbody>
            {workstations && workstations instanceof Array && workstations.length > 0 && workstations.map((ws, index) => (
                <tr>
                  <th scope="row">{ws.id}</th>
                  <td>{ws.name}</td>
                  <td>{ws.subscription}</td>
                  <td>{new Date(ws.startDate).toLocaleDateString()}</td>
                  <td>{new Date(ws.endDate).toLocaleDateString()}</td>
                  {/*<td>{ws.active}</td>*/}
                </tr>

            ))}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default Home;
