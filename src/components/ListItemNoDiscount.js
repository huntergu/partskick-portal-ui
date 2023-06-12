import React, {useState} from 'react';

const ListItemNoDiscount = ({ item, displayDiscount, subscription, selected, handleCheck }) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
    });

  return (
                  <tr>
                      <th scope="row">
                          <div>
                          <label>
                              <input
                                  type="radio"
                                  name="itemSelection"
                                  checked={selected}
                                  onChange={() => handleCheck(item, subscription)}
                              />
                              {item.clientName}
                          </label>
                      </div>
                      </th>
                      <td>{subscription.subscriptionName}</td>
                      <td>{currencyFormatter.format(subscription.price)}</td>
                      <td>{item.subTax}%</td>
                      {
                          displayDiscount && (
                              <td>N/A</td>
                          )
                      }
                  </tr>
  );
}

export default ListItemNoDiscount;