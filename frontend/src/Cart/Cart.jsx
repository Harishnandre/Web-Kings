import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useOrders } from '../Context/OrderContext'; // ✅ Import OrderContext
import './Cart.css';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'; // ✅ Import Nav for navigation
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

  const {
    placeOrder,
    loading: orderLoading,
    error: orderError,
  } = useOrders(); // ✅ Destructure placeOrder

  const [cart, setCart] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (userId && !hasFetched) {
      fetchCart(userId).then(() => setHasFetched(true));
    }
  }, [userId, hasFetched, fetchCart]);

  useEffect(() => {
    setCart(contextCart);
  }, [contextCart]);

  const handleQuantityChange = async (foodId, newQty) => {
    if (newQty < 1) return;
    await editCartItem(userId, foodId, newQty);
    await fetchCart(userId);
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

  const handlePlaceOrder = async (canteenId, canteenName, items) => {
    const formattedItems = items.map(item => ({
      food: item.food._id,
      quantity: item.quantity,
    }));

    const result = await placeOrder({ canteenId, userId, items: formattedItems });

    if (result) {
      alert(`✅ Order placed for ${canteenName}!`);
    } else {
      alert(`❌ Failed to place order for ${canteenName}.`);
    }
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
                    onClick={() => handlePlaceOrder(cg.canteen._id, cg.canteen.name, cg.items)}
                  >
                    {orderLoading ? 'Placing...' : 'Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-card-footer">
            <span className="fs-5">Total: ₹{totalCost}</span>
           <Nav.Link as={Link} to="/userorders" state={{ userId: userId }}>
                    My Orders
                  </Nav.Link>
          </div>
        </div>
      )}
      {orderError && <p className="cart-alert-error">{orderError}</p>}
    </div>
  );
}

export default Cart;
