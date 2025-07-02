import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Fetch cart from backend
  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await res.json();
      if (data.success) setCart(data.cart.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Add item to cart in backend
  const addToCart = async (userId, foodId, quantity = 1) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId, quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart.items);
      return data;
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Remove item from cart in backend
  const removeFromCart = async (userId, foodId) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart.items);
      return data;
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  // Edit quantity in backend
  const editCartItem = async (userId, foodId, quantity) => {
    try {
      const res = await fetch('http://localhost:3000/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodId, quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart.items);
      return data;
    } catch (err) {
      console.error('Error editing cart item:', err);
    }
  };

  // Calculate total cost
  const totalCost = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.food.price * item.quantity), 0), [cart]
  );

  // Clear cart locally (optional)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart,
      fetchCart,
      addToCart,
      removeFromCart,
      editCartItem,
      clearCart,
      totalCost
    }}>
      {children}
    </CartContext.Provider>
  );
}