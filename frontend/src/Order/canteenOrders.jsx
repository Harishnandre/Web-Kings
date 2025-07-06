import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrders } from '../Context/OrderContext';
import './canteenOrders.css';

const statusOptions = ['All', 'Placed', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

// Define valid next statuses based on current status
const statusFlow = {
  Placed: ['Accepted', 'Cancelled'],
  Accepted: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Completed'],
  Completed: [],
  Cancelled: []
};

function CanOrders() {
  const { canteenId } = useParams();
  const { getCanteenOrders, updateOrderStatus, loading, error } = useOrders();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!canteenId) return;
      const data = await getCanteenOrders(canteenId);
      if (isMounted && data) {
        setOrders(data);
        setFilteredOrders(data);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [canteenId]);

  const handleStatusChange = async (orderId, newStatus) => {
    const confirmed = window.confirm(`Change status to "${newStatus}"?`);
    if (!confirmed) return;

    const updated = await updateOrderStatus(orderId, newStatus);
    if (updated) {
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      applyFilter(updatedOrders, statusFilter);
    }
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setStatusFilter(selected);
    applyFilter(orders, selected);
  };

  const applyFilter = (ordersList, filter) => {
    if (filter === 'All') {
      setFilteredOrders(ordersList);
    } else {
      setFilteredOrders(ordersList.filter(order => order.status === filter));
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">🏪 Canteen Orders</h2>

      <div className="filter-container">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select id="statusFilter" value={statusFilter} onChange={handleFilterChange}>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="order-loading">Loading orders...</p>
      ) : error ? (
        <p className="order-error">❌ {error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="no-orders">No orders match the selected status.</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <strong>Order No:</strong> {order.orderNumber || order._id.slice(-6)}
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-user">
              <strong>User:</strong> {order.user?.name || 'Unknown'} ({order.user?.email})
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

            {/* Status control: dropdown or button based on options */}
            {statusFlow[order.status]?.length > 0 && (
              <div className="order-status-control">
                <label>Update Status:</label>
                {statusFlow[order.status].length === 1 ? (
                  <button
                    className="status-btn"
                    onClick={() => handleStatusChange(order._id, statusFlow[order.status][0])}
                  >
                    ➡ {statusFlow[order.status][0]}
                  </button>
                ) : (
                  <select
                    value=""
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="" disabled>Select next</option>
                    {statusFlow[order.status].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CanOrders;
