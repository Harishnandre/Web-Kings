import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrders } from '../Context/OrderContext';
import './userOrders.css';

function Order() {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem('userId');

  const {
    getUserOrders,
    cancelOrder,
    loading,
    error,
  } = useOrders();

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getUserOrders(userId);
    if (data) setOrders(data);
  };

  useEffect(() => {
    if (!userId) return;
    fetchOrders();
  }, [userId]);

  const handleCancel = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    const res = await cancelOrder(orderId);
    if (res) fetchOrders(); // Re-fetch orders on success
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 My Orders</h2>

      {loading ? (
        <p className="order-loading">Loading your orders...</p>
      ) : error ? (
        <p className="order-error">❌ {error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <strong>Order Number:</strong> {order.orderNumber}
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-canteen">
              <strong>Canteen:</strong> {order.canteen?.name || 'Unknown'}
            </div>

            <ul className="order-items">
              {order.items.map(item => (
                <li key={item.food?._id} className="order-item">
                  <span>{item.food?.name}</span>
                  <span>₹{item.food?.price} × {item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="order-footer">
              <strong>Total:</strong> ₹{order.totalAmount}
              <span className="order-time">
                {new Date(order.placedAt).toLocaleString()}
              </span>
            </div>

            {order.status === 'Placed' && (
              <button
                className="cancel-order-btn"
                onClick={() => handleCancel(order._id)}
              >
                ❌ Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Order;
