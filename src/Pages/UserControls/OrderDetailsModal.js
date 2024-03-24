import React, { useState, useEffect } from 'react';
import getOrderCartItems from './GetOrderCartItems';
import '../../Styles/UserPageStyles/OrderDetailsModal.css'; // Assume you have styling for the modal

const OrderDetailsModal = ({ order, onClose }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await getOrderCartItems(order.items, order.authIdToken);
                setCartItems(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItems([]);
            }
        };

        fetchCartItems();
    }, [order]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Order Details</h3>
                <div className="order-info">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Ordered On:</strong> {order.orderedOn ? order.orderedOn.slice(0, 10) + " (UTC)" : 'NA'}</p>
                    <p><strong>Delivery Address:</strong> {order.orderAddress}</p>
                    <p><strong>Payment Status:</strong> {order.paymentId ? 'SUCCESS' : 'NA'}</p>
                </div>
                <h4>Items:</h4>
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="item-details">
                                    <span className="item-name">{item.product.name}</span>
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Price: ${item.product.price}</span>
                                    <span>Total: ${item.product.price * item.quantity}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items found for this order.</p>
                    )}
                </div>
                <div className="total-price">
                    <strong>Total Order Price:</strong> ${order.orderTotalPrice}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
