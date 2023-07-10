import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import {Link, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import partsService from "../services/parts.service";

const Inventory = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [responseCode, setResponseCode] = useState(400);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [parts, setParts] = useState([]);
  const [inventory, setInventory] = useState([]);

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
        console.log(error);

        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    partsService.getPartsListInfo().then(
      (response) => {
        if (response.data) {
          const newInfo = response.data;
          const v = newInfo.version;
          const n = newInfo.numberOfParts;
          const m = newInfo.maxId;
          const info = JSON.parse(localStorage.getItem("partsInfo"));
          if (!info || v !== info.version || n !== info.numberOfParts || m !== info.maxId) {
            partsService.getPartsListInfoWithList().then(
                (resp) => {
                  const xInfo = resp.data;
                  localStorage.setItem("partsInfo", JSON.stringify(xInfo));
                  setParts(xInfo.partsList);
                },
                (err) => {
                  const _content =
                      (err.response &&
                          err.response.data) ||
                      err.message ||
                      err.toString();

                  console.log(err);
                  setContent(_content);
                  setResponseCode(err.response.status);
                  setLoading(false);
                }
            )
          } else {
            setParts(info.partsList);
          }

          setResponseCode(200);
          setLoading(false);
        } else {
          setContent("Failed to load parts info");
          setResponseCode(500);
          setLoading(false);
        }
      },
      (error) => {
        const _content =
            (error.response &&
                error.response.data) ||
            error.message ||
            error.toString();

        console.log(error);
        setContent(_content);
        setResponseCode(error.response.status);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!currentUser || !selectedOption) return;
    setLoading(true);
    partsService.getClientPartsList(selectedOption).then(
        (response) => {
          setInventory(response.data);
          setResponseCode(200);
          setLoading(false);
        },
        (error) => {
          const _content =
              (error.response &&
                  error.response.data) ||
              error.message ||
              error.toString();

          console.log(error);
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
              <th scope="col">Parts Type</th>
              <th scope="col">Parts Number</th>
              <th scope="col">Location</th>
              <th scope="col">Qty</th>
            </tr>
            </thead>
            <tbody>

            {inventory && inventory instanceof Array && inventory.length > 0 && inventory.map((inv, index) => (
                <tr>
                  <th scope="row">{inv.parts.partsName}</th>
                  <td>{inv.partsNumber}</td>
                  <td>{inv.location}</td>
                  <td>{inv.qty}</td>
                </tr>

            ))}

            </tbody>
          </table>
        </div>
      </div>

  );
};

export default Inventory;
