import React, {useState} from 'react';

const ListItemCBDiscount = ({ item, handleCheck }) => {
    const [isChecked, setIsChecked] = useState(false);
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
    });
    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        handleCheck(item, event.target.checked);
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
                      <td>{item.subName}</td>
                      <td>{currencyFormatter.format(item.subPrice)}</td>
                      <td>{item.subDiscount}</td>
                  </tr>
  );
}

export default ListItemCBDiscount;