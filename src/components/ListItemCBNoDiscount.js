import React, {useState} from 'react';

const ListItemCBDiscount = ({ item, displayDiscount, subscription, handleCheck }) => {
    const [isChecked, setIsChecked] = useState(false);
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
    });
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        handleCheck(item, subscription, event.target.checked);
    };

  return (
                  <tr>
                      <th scope="row">
                          <div>
                          <label>
                              <input type="checkbox"  checked={isChecked} onChange={handleChange} />
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

export default ListItemCBDiscount;