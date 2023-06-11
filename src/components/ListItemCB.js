import React, {useState} from 'react';

const ListItemCB = ({ item, handleCheck }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
        handleCheck(item, event.target.checked);
    };

  return (
    <div>
      <label>
        <input type="checkbox"  checked={isChecked} onChange={handleChange} />
        {item.clientName}
      </label>
    </div>
  );
}

export default ListItemCB;