import React, {useEffect, useState} from "react";
import adminService from "../services/admin.service";
import ClientDiscountItem from "./ClientDiscountItem";
import {clearMessage} from "../slices/message";
import {useDispatch} from "react-redux";

const ClientDiscount = () => {
  const [clients, setClients] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [displayClients, setDisplayClients] = useState([]);
  let timeout;

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);


  useEffect(() => {
    setLoading(true);

      adminService.getClients().then(
          (response) => {
              setClients(response.data);
              setDisplayClients(response.data);
              setLoading(false);
          },
          (error) => {
              const _content =
                  (error.response &&
                      error.response.data) ||
                  error.message ||
                  error.toString();
              console.log(error);

              setMessage(_content);
              setLoading(false);
          }
      );

  }, []);

  useEffect(() => {
    setLoading(true);

      adminService.getDiscountSub().then(
          (response) => {
              setSubs(response.data);
              setLoading(false);
          },
          (error) => {
              const _content =
                  (error.response &&
                      error.response.data) ||
                  error.message ||
                  error.toString();
              console.log(error);

              setMessage(_content);
              setLoading(false);
          }
      );

  }, []);

  const handleFilterNameChange = (event) => {
      setFilterAddress("");
      setFilterCity("");
      setFilterOwner("");
      setFilterName(event.target.value);
      clearTimeout(timeout);
      // Set a new timeout of 0.5 seconds
      timeout = setTimeout(() => {
        let da = [];
        clients.map((c) => {
            if (c.clientName.toLowerCase().includes(event.target.value.toLowerCase())) {
                da.push(c);
            }
          });
        setDisplayClients(da);
      }, 500);
  }

  const handleFilterOwnerChange = (event) => {
      setFilterAddress("");
      setFilterCity("");
      setFilterName("");
      setFilterOwner(event.target.value);
      clearTimeout(timeout);
      // Set a new timeout of 0.5 seconds
      timeout = setTimeout(() => {
        let da = [];
        clients.map((c) => {
            if (c.email.toLowerCase().includes(event.target.value.toLowerCase())) {
                da.push(c);
            }
          });
        setDisplayClients(da);
      }, 500);
  }

  const handleFilterAddressChange = (event) => {
      setFilterName("");
      setFilterCity("");
      setFilterOwner("");
      setFilterAddress(event.target.value);
      clearTimeout(timeout);
      // Set a new timeout of 0.5 seconds
      timeout = setTimeout(() => {
          let da = [];
          clients.map((c) => {
              if (c.address.toLowerCase().includes(event.target.value.toLowerCase())) {
                  da.push(c);
              }
          });
          setDisplayClients(da);
      }, 500);

  }

  const handleFilterCityChange = (event) => {
      setFilterName("");
      setFilterAddress("");
      setFilterOwner("");
      setFilterCity(event.target.value);
      clearTimeout(timeout);
      // Set a new timeout of 0.5 seconds
      timeout = setTimeout(() => {
          let da = [];
          clients.map((c) => {
              if (c.city.toLowerCase().includes(event.target.value.toLowerCase())) {
                  da.push(c);
              }
          });
          setDisplayClients(da);
      }, 500);

  }

  return (
      <div>
        {loading && (
            <span className="spinner-border spinner-border-sm"></span>
        )}
        {message && (
            <div className="form-group pt-50">
              <div
                  className="alert alert-danger"
                  role="alert"
              >
                {
                  message
                }
              </div>
            </div>
        )}
        <div className="row mt-5">
          <table className="table">
            <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Owner</th>
              <th scope="col">Address</th>
              <th scope="col">City</th>
              <th scope="col">Subscription</th>
              <th scope="col">Discount (% off)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><input type="text" value={filterName} onChange={handleFilterNameChange} /></td>
                <td><input type="text" value={filterOwner} onChange={handleFilterOwnerChange} /></td>
                <td><input type="text" value={filterAddress} onChange={handleFilterAddressChange} /></td>
                <td><input type="text" value={filterCity} onChange={handleFilterCityChange} /></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            {displayClients && displayClients.length > 0 && subs && subs.length > 0 && displayClients.map((c, index) => (
                <ClientDiscountItem key={c.oid} item={c} subs={subs}/>
            ))}
            </tbody>
          </table>
        </div>
      </div>

  );
};

export default ClientDiscount;
