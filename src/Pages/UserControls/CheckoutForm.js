import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useHistory } from 'react-router-dom';
import '../../Styles/UserPageStyles/CheckoutForm.css'; 
import getAllUserAddresses from "./AllUserAddresses";
import AddAddress from "./AddAddress";
import configDetails from "../../ConfigureDetails/redirectConfig";
import '../../Styles/AdminStyles/Spinner.css'

const CheckoutForm = ({ authIdToken, onClose, userEmail, totalCartPrice, name, phoneNumber, addressId, allUserCartItems }) => {
    const [allUserAddresses, setAllUserAddresses] = useState([]);
    const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [paymentError, setPaymentError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        async function fetchUserAddresses() {
            try {
                const addresses = await getAllUserAddresses(userEmail, authIdToken);
                setAllUserAddresses(addresses);
            } catch (error) {
                console.error("Error fetching user addresses:", error);
            }
        }

        fetchUserAddresses(); 

    }, [userEmail]);

    const handleAddAddress = () => {
        setShowAddAddressPopup(true);
    };

    const handleAddAddressClose = async () => {
        setShowAddAddressPopup(false);
        try {
            const addresses = await getAllUserAddresses(userEmail, authIdToken);
            setAllUserAddresses(addresses);
        } catch (error) {
            console.error("Error fetching user addresses:", error);
        }
    };

    const handleAddressSelect = (event) => {
        const selectedAddress23 = JSON.parse(event.target.value);
        setSelectedAddress(selectedAddress23);
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !selectedAddress) {
        return;
    }

    setPaymentLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            email: userEmail,
            address: {
                city: selectedAddress.city,
                state: selectedAddress.state,
                postal_code: selectedAddress.zip,
                line1: selectedAddress.address1,
                line2: selectedAddress.address2,
            }
        },
    });

    setPaymentLoading(false);

    if (error) {
        console.error('Payment Method Error:', error);
        setPaymentError(error.message);
    } else {
        console.log('Payment Method:', paymentMethod);

        // Extracting cart item ids
        const cartItemIds = allUserCartItems.map(item => item.id);

        // Combine order address into string format
        const orderAddressString = `${selectedAddress.name}, ${selectedAddress.address1}, ${selectedAddress.address2}, ${selectedAddress.city}, ${selectedAddress.state} - zip: ${selectedAddress.zip} Phone: ${phoneNumber}`;

        // Prepare data to send to the backend
        const queryParams = new URLSearchParams({
            cartItems: cartItemIds,
            email: userEmail,
            paymentId: paymentMethod.id,
            orderPrice: totalCartPrice,
            orderAddress: orderAddressString
        }).toString();

        fetch(`${configDetails.baseUrl}${configDetails.placeOrder}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':authIdToken
            }
        })
        .then(response => {
            if (response.ok) {
                // Redirect to success page after successful order placement
                history.push('/orders');
            } else {
                throw new Error('Failed to place order');
            }
        })
        .catch(error => {
            console.error('Error placing order:', error);
            // Handle error scenario
        });
    }
};

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                {paymentLoading && <div className="loading-container">
                                        <div className="loading-spinner"></div>
                                        <p style={{textAlign:'center'}}>Processing the payment, Please wait...</p> 
                                    </div>}
                <h2>Checkout</h2>
                <div>
                    <h3>Select Address</h3>
                    <select value={selectedAddress ? JSON.stringify(selectedAddress) : ""} onChange={handleAddressSelect}>
                        <option value="">Select Address</option>
                        {allUserAddresses.map(address => (
                            <option key={address.id} value={JSON.stringify(address)}>
                                {address.name}, {address.address1} {address.address2}, {address.city}, {address.state} - {address.zip}, Ph: {address.phone}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleAddAddress} style={{width:'auto'}}>Add New Address</button>
                </div>
                {showAddAddressPopup && <AddAddress onClose={handleAddAddressClose} userEmail={userEmail} authIdToken={authIdToken} />}
                <form onSubmit={handleSubmit}>
                    <label>
                        Credit/Debit Card Details:
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                            className="CardElement"
                        />
                    </label>
                    {paymentError && <div className="error-message">{paymentError}</div>}
                    <button type="submit" disabled={!stripe || paymentLoading} style={{width:'50%', backgroundColor:'green'}}>
                        {paymentLoading ? 'Processing...' : 'Pay'}
                    </button>
                </form>
                <button className="cancel-btn" onClick={handleCancel} style={{width:'50%', backgroundColor:'red'}}>Cancel</button>
            </div>
        </div>
    );
};

export default CheckoutForm;
