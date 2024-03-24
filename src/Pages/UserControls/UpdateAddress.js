import React, { useState, useEffect } from "react";
import '../../Styles/UserPageStyles/AddAddress.css'; 
import configDetails from "../../ConfigureDetails/redirectConfig";

const UpdateAddress = ({ onClose, userEmail, address, authIdToken }) => {
    const [addressDetails, setAddressDetails] = useState({
        id:address.id,
        name: address.name,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        phone: address.phone
    });

    useEffect(() => {
        // Update address details when the address prop changes
        setAddressDetails({
            name: address.name,
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip: address.zip,
            phone: address.phone
        });
    }, [address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdateAddress = async () => {
        try {
            const response = await fetch(`${configDetails.baseUrl}${configDetails.updateAddress}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                },
                body: JSON.stringify({
                    id:address.id,
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
                console.error('Failed to update address:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Update Address</h2>
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
                <div>
                    <button onClick={handleUpdateAddress}>Update Address</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAddress;
