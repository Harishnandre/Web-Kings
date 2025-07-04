import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  // Fetch cart from backend
  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await res.json();
      if (data.success) setCart(data.cart || null);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Add item to cart
  const addToCart = async (userId, foodId, quantity = 1) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId, quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart || null);
      return data;
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (userId, foodId) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart || null);
      return data;
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  // Edit item quantity
  const editCartItem = async (userId, foodId, quantity) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId, quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart || null);
      return data;
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };



  // ✅ Clear specific canteen from cart (calls backend)
  const clearCanteenCart = async (userId, canteenId) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, canteenId }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart || null);
      return data;
    } catch (err) {
      console.error('Error clearing canteen cart:', err);
    }
  };

  // Total cost calculation
  const totalCost = useMemo(() => {
    if (!cart?.canteens) return 0;
    return cart.canteens.reduce(
      (sum, cg) => sum + cg.items.reduce((s, item) => s + item.food.price * item.quantity, 0),
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      fetchCart,
      addToCart,
      removeFromCart,
      editCartItem,
      clearCanteenCart,
      totalCost
    }}>
      {children}
    </CartContext.Provider>
  );
}
