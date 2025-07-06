import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:3000/api/orders';

  const request = async (url, method = 'GET', body = null) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      console.error('Order error:', err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Place an order
  const placeOrder = async ({ canteenId, items, userId }) => {
    // Assuming backend uses req.body.userId if token isn't provided
    return await request(API_BASE, 'POST', { canteenId, items, userId });
  };

  // 👤 Get user orders
  const getUserOrders = async (userId) => {
    return await request(`${API_BASE}/user/${userId}`);
  };

  // 🏪 Get canteen orders
  const getCanteenOrders = async (canteenId) => {
    return await request(`${API_BASE}/canteen/${canteenId}`);
  };

  // 🔄 Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    return await request(`${API_BASE}/${orderId}/status`, 'PATCH', { status: newStatus });
  };

   const cancelOrder = async (orderId) => {
    return await request(`${API_BASE}/cancel/${orderId}`, 'PATCH');
  };
  
  const clearError = () => setError(null);

  return (
    <OrderContext.Provider
      value={{
        placeOrder,
        getUserOrders,
        getCanteenOrders,
        updateOrderStatus,
        cancelOrder,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
