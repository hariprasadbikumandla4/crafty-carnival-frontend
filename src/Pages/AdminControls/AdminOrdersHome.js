import React, { useState, useEffect } from 'react';
import getAllUserOrders from './GetAllOrders';
import getOrderCartItems from './GetOrderCartItems';
import '../../Styles/UserPageStyles/ViewOrder.css'
import configDetails from '../../ConfigureDetails/redirectConfig';

const AdminOrdersHome = ({ userEmail, authIdToken }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userOrders = await getAllUserOrders(authIdToken);
                const sortedOrders = userOrders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
                setOrders(sortedOrders);
                console.log(orders)
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userEmail]);

    const handleViewOrder = async (order) => {
        try {
            const items = await getOrderCartItems(order.items, authIdToken);
            setCartItems(items);
            console.log(items)
            setSelectedOrder(order)
            setShowPopup(true); 
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const closePopup = () => {
        setCartItems([]); 
        setShowPopup(false); 
    };

    if (loading) {
        return <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p style={{textAlign:'center'}}>Loading Orders...</p> 
                </div>;
    }

    if (error) {
        return <div style={{textAlign:'center'}}>Error: Failed to fetch Orders, please hit Fetch Order button or try after sometime.</div>;
    }

    const getStatusClass = (currentStatus, statusToCheck) => {
        const statusOrder = ['PLACED', 'INTRANSIT', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const checkIndex = statusOrder.indexOf(statusToCheck);
        if (currentIndex > checkIndex) {
            return 'active completed'; 
        } else if (currentIndex === checkIndex) {
            return 'active'; 
        }
        return ''; 
    };


    const OrderStatus = ({ currentStatus }) => (
    <div className="status-container">
        {['PLACED', 'INTRANSIT', 'DELIVERED'].map((status, index) => (
        <div key={index} className={`status-dot ${getStatusClass(currentStatus, status)}`}>
            <span className="status-text">{status}</span>
        </div>
        ))}
    </div>
    );

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${configDetails.baseUrl}${configDetails.updateOrderStatus}?orderId=${orderId}&status=${newStatus}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrders = [...orders];
            const orderIndex = updatedOrders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                updatedOrders[orderIndex].status = newStatus;
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };



    return (
        <div>
            <h2 style={{ textAlign: 'center', backgroundColor:'aqua', margin:'10px',borderRadius:'5px' }}>All Orders</h2>
            {orders.length === 0 ? (
                <div>No orders found at thius time. Please try again after sometime.</div>
            ) : (
                <table style={{ margin: '20px' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Order ID</th>
                            <th style={tableHeaderStyle}>Order Status</th>
                            <th style={tableHeaderStyle}>Payment Status</th>
                            <th style={tableHeaderStyle}>Delivery Address</th>
                            <th style={tableHeaderStyle}>Ordered By</th>
                            <th style={tableHeaderStyle}>Ordered On</th>
                            <th style={tableHeaderStyle}>Total Price</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td style={tableCellStyle}>{order.id}</td>
                                <td style={tableCellStyle}>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    style={{ padding: '5px' }}
                                >
                                    <option value="PLACED">PLACED</option>
                                    <option value="INTRANSIT">INTRANSIT</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELLED">CANCELLED</option> {/* Add a CANCELLED option */}
                                </select>
                                </td>
                                <td style={tableCellStyle}>{order.paymentId ? 'SUCCESS' : 'NA'}</td>
                                <td style={tableCellStyle}>{order.orderAddress}</td>
                                <td style={tableCellStyle}>{order.userEmail}</td>
                                <td style={tableCellStyle}>{order.orderedOn ? order.orderedOn.slice(0, 10) : 'NA'} (UTC)</td>
                                <td style={tableCellStyle}>${order.orderTotalPrice}</td>
                                <td style={tableCellStyle}>
                                    <button onClick={() => handleViewOrder(order)}>View Order</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        <h3 style={{textAlign:'center', backgroundColor:'aqua'}}>Order Details</h3>
                        <div>
                            <p><strong>Order ID:</strong> {selectedOrder.id} <strong>Ordered On:</strong> {selectedOrder.orderedOn ? selectedOrder.orderedOn.slice(0, 10) + " (UTC)" : 'NA'}</p>
                            <div style={{margin:'20px'}}>
                                <p ><strong>Status:</strong></p>
                                <OrderStatus currentStatus={selectedOrder.status} />
                            </div >
                            <p style={{marginTop:'40px'}}><strong>Payment Status:</strong> {selectedOrder.paymentId ? 'SUCCESS' : 'NA'}</p>
                            <p><strong>Delivery Address:</strong> {selectedOrder.orderAddress}</p>
                        </div>
                        <div className="cart-items">
                            {cartItems? cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="item-image">
                                <img src={item.product.imageUrls} style={{ width: '100px', height: '100px' }} alt="Item" />
                                </div>
                                <div className="item-details">
                                <div className="item-info">
                                    <span className="item-name" style={{ margin: '5px' }}>{item.product.name}</span>
                                </div>
                                <div className="item-quantity">
                                    <span>Quantity: {item.quantity}x</span>${item.product.price}
                                    <p>Total Price: <strong>${item.product.price * item.quantity}</strong></p>
                                </div>
                                </div>
                            </div>
                            )):""}
                        </div>
                        <div>
                            <p style={{textAlign:'end'}}><strong>Total Order Price:</strong> ${selectedOrder.orderTotalPrice}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const tableHeaderStyle = {
    border: '1px solid #ddd',
    background: 'pink',
    padding: '8px',
    textAlign: 'left',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    background: 'white',
    padding: '8px',
};

export default AdminOrdersHome;

