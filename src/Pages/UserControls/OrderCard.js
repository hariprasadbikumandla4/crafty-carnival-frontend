import React from 'react';
import '../../Styles/UserPageStyles/OrderCard.css'; // Assume you have styling for the cards

const OrderCard = ({ order, onViewDetails }) => {
    return (
        <div className="order-card">
            <div className="order-summary">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Ordered On:</strong> {order.orderedOn.slice(0, 10)}</p>
                <p><strong>Total:</strong> ${order.orderTotalPrice}</p>
            </div>
            <button onClick={onViewDetails} className="details-btn">View Details</button>
        </div>
    );
};

export default OrderCard;
