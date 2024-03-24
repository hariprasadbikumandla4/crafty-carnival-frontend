import React, { useState } from "react";
import '../../Styles/UserPageStyles/AddAddress.css'; 
import configDetails from "../../ConfigureDetails/redirectConfig";

const AddAddress = ({ onClose, userEmail, authIdToken }) => {
    const [addressDetails, setAddressDetails] = useState({
        name:"",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        phone: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleAddAddress = async () => {
        console.log(userEmail)
        try {
            const response = await fetch(`${configDetails.baseUrl}${configDetails.addAddress}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                },
                body: JSON.stringify({
                    name: addressDetails.name,
                    email: userEmail,
                    address1: addressDetails.address1,
                    address2: addressDetails.address2,
                    city: addressDetails.city,
                    state: addressDetails.state,
                    zip: parseInt(addressDetails.zip),
                    phone: addressDetails.phone
                })
            });

            if (response.ok) {
                onClose();
            } else {
                console.error('Failed to add address:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content" style={{backgroundColor:'lightgrey'}}>
                <h2>Add New Address</h2>
                <div className="input-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={addressDetails.name} onChange={handleInputChange} placeholder="Name" />
                </div>
                <div className="input-group">
                    <label>Address Line 1:</label>
                    <input type="text" name="address1" value={addressDetails.address1} onChange={handleInputChange} placeholder="Address Line 1" />
                </div>
                <div className="input-group">
                    <label>Address Line 2:</label>
                    <input type="text" name="address2" value={addressDetails.address2} onChange={handleInputChange} placeholder="Address Line 2" />
                </div>
                <div className="input-group">
                    <label>City:</label>
                    <input type="text" name="city" value={addressDetails.city} onChange={handleInputChange} placeholder="City" />
                </div>
                <div className="input-group">
                    <label>State:</label>
                    <input type="text" name="state" value={addressDetails.state} onChange={handleInputChange} placeholder="State" />
                </div>
                <div className="input-group">
                    <label>ZIP Code:</label>
                    <input type="number" name="zip" value={addressDetails.zip} onChange={handleInputChange} placeholder="ZIP Code" />
                </div>
                <div className="input-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phone" value={addressDetails.phone} onChange={handleInputChange} placeholder="Phone Number" />
                </div>
                <div className="button-group">
                    <button onClick={handleAddAddress} style={{width:'auto', backgroundColor:'green'}}>Add Address</button>
                    <button onClick={onClose} style={{width:'auto', backgroundColor:'red'}}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddAddress;
