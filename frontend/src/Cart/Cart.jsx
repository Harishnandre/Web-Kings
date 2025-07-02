import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

function Cart() {
  const location = useLocation();
  const userId = location.state?.userId;
  const { cart, fetchCart, removeFromCart, editCartItem, totalCost } = useCart();

  useEffect(() => {
    if (userId) fetchCart(userId);
  }, [userId, fetchCart]);

  const handleQuantityChange = (foodId, newQty) => {
    if (newQty < 1) return;
    editCartItem(userId, foodId, newQty);
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">🛒 My Cart</h2>
      {cart.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="card shadow">
          <ul className="list-group list-group-flush">
            {cart.map(item => (
              <li key={item.food._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.food.name}</strong>
                  <div className="text-muted small">₹{item.food.price} each</div>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => handleQuantityChange(item.food._id, item.quantity - 1)}
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(item.food._id, Number(e.target.value))}
                    className="form-control form-control-sm text-center"
                    style={{ width: 50 }}
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={() => handleQuantityChange(item.food._id, item.quantity + 1)}
                  >+</button>
                  <button
                    className="btn btn-danger btn-sm ms-3"
                    onClick={() => removeFromCart(userId, item.food._id)}
                  >Remove</button>
                </div>
                <div className="ms-3 fw-bold">
                  ₹{item.food.price * item.quantity}
                </div>
              </li>
            ))}
          </ul>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-5">Total: ₹{totalCost}</span>
            <button className="btn btn-success" disabled={cart.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;