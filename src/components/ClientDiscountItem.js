import React, {useState} from "react";
import adminService from "../services/admin.service";

const ClientDiscountItem = ( {item, subs} ) => {
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(item.discount);
    const [editedValue, setEditedValue] = useState(item.discount);
    const [isEdited, setIsEdited] = useState(false);
    const [selectedSub, setSelectedSub] = useState(item.sub);
    const checkValid = (v) => /^\d{0,2}(\.\d{0,2})?$/.test(v) && parseFloat(v) >= 0 && parseFloat(v) < 100;
    const handleInputChange = (e) => {
        const newValue = e.target.value;

        // Check if the new value is a valid decimal between 0 and 100
        const isValid = checkValid(newValue);

        setEditedValue(newValue);
        setIsEdited(newValue !== discount && isValid);
        if (!selectedSub) {
            setSelectedSub(subs[0].id);
        }

    };

    const handleSaveClick = () => {
        if (checkValid(editedValue)) {
            setDiscount(editedValue);
            console.log("new value: ", editedValue, "sub: ", selectedSub);
            setLoading(true);
            adminService.updateDiscount(item.oid, selectedSub, editedValue).then(
                (response) => {
                    item.sub = selectedSub;
                    item.discount = editedValue;
                    setIsEdited(false);
                    setLoading(false);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(error);
                    alert(_content);
                    setSelectedSub(item.sub);
                    setEditedValue(item.discount);
                    setIsEdited(false);
                    setLoading(false);
                }
            );
        } else {
            alert("Invalid discount");
        }
    };
    const handleDropdownChange = (e) => {
        setSelectedSub(e.target.value);
        setEditedValue(0);
        setIsEdited(discount !== 0);
    };

    return (
        <tr>
            <td>{item.clientName}</td>
            <td>{item.email}</td>
            <td>{item.address}</td>
            <td>{item.city}</td>
            <td><select value={selectedSub} onChange={handleDropdownChange}>
                {subs.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select></td>
            <td><input type="text" value={editedValue} onChange={handleInputChange} /></td>
            <td>{isEdited && <button onClick={handleSaveClick}>Save</button>}
                <div className="container">
                {loading && (
                    <span className="spinner-border spinner-border-sm text-success"></span>
                )}
            </div>
            </td>
        </tr>
    );
};

export default ClientDiscountItem;