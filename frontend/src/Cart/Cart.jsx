import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import './Cart.css';

function Cart() {
  const location = useLocation();
  const userId = location.state?.userId;

  const {
    cart: contextCart,
    fetchCart,
    editCartItem,
    removeFromCart,
    clearCanteenCart,
    totalCost
  } = useCart();

  const [cart, setCart] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch cart once on mount
  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCart(userId).then(() => setHasFetched(true));
    }
  }, [userId, hasFetched, fetchCart]);

  // Sync contextCart to local cart state when it changes
  useEffect(() => {
    setCart(contextCart);
  }, [contextCart]);

  const handleQuantityChange = async (foodId, newQty) => {
    if (newQty < 1) return;
    await editCartItem(userId, foodId, newQty);
    await fetchCart(userId); // update contextCart to reflect badge and global state
  };

  const handleRemoveFromCart = async (foodId) => {
    await removeFromCart(userId, foodId);
    await fetchCart(userId);

    setCart(prev => {
      const updatedCanteens = prev.canteens
        .map(cg => {
          const newItems = cg.items.filter(item => item.food && item.food._id !== foodId);
          return { ...cg, items: newItems };
        })
        .filter(cg => cg.items.length > 0);
      return { ...prev, canteens: updatedCanteens };
    });
  };

  const handleClearCanteen = async (canteenId) => {
    await clearCanteenCart(userId, canteenId);
    await fetchCart(userId);

    setCart(prev => {
      const updatedCanteens = prev.canteens.filter(cg => cg.canteen._id !== canteenId);
      return { ...prev, canteens: updatedCanteens };
    });
  };

  const handlePlaceOrder = (canteenName) => {
    alert(`Order placed for ${canteenName}!`);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 My Cart</h2>
      {!cart?.canteens || cart.canteens.length === 0 ? (
        <div className="cart-alert">Your cart is empty.</div>
      ) : (
        <div>
          {cart.canteens.map(cg => (
            <div key={cg.canteen._id} className="cart-card">
              <div className="cart-card-header">
                <strong>{cg.canteen.name}</strong>
              </div>
              <ul className="cart-list">
                {cg.items.map(item => {
                  if (!item.food) return null;

                  return (
                    <li key={item.food._id} className="cart-item">
                      <div className="cart-item-details">
                        <strong>{item.food.name}</strong>
                        <div className="cart-item-price">₹{item.food.price} each</div>
                      </div>
                      <div className="cart-actions">
                        <button
                          className="cart-btn cart-btn-qty"
                          onClick={() => handleQuantityChange(item.food._id, item.quantity - 1)}
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.food._id, Number(e.target.value))}
                          className="cart-qty-input"
                        />
                        <button
                          className="cart-btn cart-btn-qty"
                          onClick={() => handleQuantityChange(item.food._id, item.quantity + 1)}
                        >+</button>
                        <button
                          className="cart-btn cart-btn-remove"
                          onClick={() => handleRemoveFromCart(item.food._id)}
                        >Remove</button>
                      </div>
                      <div className="cart-item-total">
                        ₹{item.food.price * item.quantity}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="cart-card-footer">
                <span>
                  Subtotal: ₹{cg.items.reduce((s, item) => {
                    if (!item.food || typeof item.food.price !== 'number') return s;
                    return s + item.food.price * item.quantity;
                  }, 0)}
                </span>
                <div className="cart-footer-actions">
                  <button
                    className="cart-btn cart-btn-clear"
                    onClick={() => handleClearCanteen(cg.canteen._id)}
                  >Clear Cart</button>
                  <button
                    className="cart-btn cart-btn-order"
                    onClick={() => handlePlaceOrder(cg.canteen.name)}
                  >Order</button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-card-footer">
            <span className="fs-5">Total: ₹{totalCost}</span>
            <button className="cart-btn cart-btn-checkout" disabled={totalCost === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
