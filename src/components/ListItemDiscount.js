import React, {useState} from 'react';

const ListItemDiscount = ({ item, selected, handleCheck }) => {
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
                                  onChange={() => handleCheck(item)}
                              />
                              {item.clientName}
                          </label>
                      </div>
                      </th>
                      <td>{item.subName}</td>
                      <td>{currencyFormatter.format(item.subPrice)}</td>
                      <td>{item.subTax}%</td>
                      <td>{item.subDiscount}</td>
                  </tr>
  );
}

export default ListItemDiscount;