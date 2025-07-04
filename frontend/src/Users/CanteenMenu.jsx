import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useRatings } from '../Context/RatingsContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

function CanteenMenu() {
  const { canteenId } = useParams();
  const location = useLocation();
  const userId = location.state?.userId;

  const { addToCart, cart, fetchCart } = useCart();
  const { rateFood } = useRatings();

  const [foodItemIds, setFoodItemIds] = useState([]);
  const [allFoodDetails, setFoodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchFoodIds = async () => {
      try {
        const res = await fetch(`/api/can/canteenbyid/${canteenId}`);
        const data = await res.json();
        setFoodItemIds(data.canteen.food || []);
      } catch (err) {
        console.error('Error fetching food IDs:', err);
      }
    };
    fetchFoodIds();
  }, [canteenId]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      const details = [];
      for (let id of foodItemIds) {
        try {
          const res = await fetch(`/api/item/food/${id}`);
          const data = await res.json();
          if (data.success) details.push(data.food);
        } catch (err) {
          console.error(`Failed to fetch food for ID ${id}`, err);
        }
      }
      setFoodDetails(details);
      setLoading(false);
    };
    if (foodItemIds.length > 0) fetchFoodDetails();
    else setLoading(false);
  }, [foodItemIds]);

  useEffect(() => {
    const initialRatings = {};
    allFoodDetails.forEach((food) => {
      const userRating = food.ratings?.find((r) => r.user === userId);
      if (userRating) initialRatings[food._id] = userRating.rating;
    });
    setUserRatings(initialRatings);
  }, [allFoodDetails, userId]);

  const handleAddToCart = async (foodId, foodName) => {
    if (!userId) {
      toast.error('Please login to add items to cart.');
      return;
    }
    await addToCart(userId, foodId, 1);
    toast.success(`Added "${foodName}" to cart!`);
    await fetchCart(userId);
  };

  const handleRatingChange = async (foodId, newRating) => {
    if (!userId) {
      toast.error('Login required to rate.');
      return;
    }

    const result = await rateFood(foodId, userId, newRating);
    if (result) {
      toast.success('Rating submitted!');

      const updatedFoods = allFoodDetails.map((f) => {
        if (f._id === foodId) {
          const hasExisting = f.ratings?.some((r) => r.user === userId);
          const updatedRatings = hasExisting
            ? f.ratings.map((r) =>
                r.user === userId ? { ...r, rating: newRating } : r
              )
            : [...(f.ratings || []), { user: userId, rating: newRating }];

          return {
            ...f,
            avgRating: result.avgRating,
            ratings: updatedRatings,
          };
        }
        return f;
      });

      setFoodDetails(updatedFoods);
      setUserRatings((prev) => ({ ...prev, [foodId]: newRating }));
    }
  };

  const cartCount = cart?.canteens?.reduce((sum, cg) => sum + cg.items.length, 0) || 0;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={1500} />
      {/* Cart summary */}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Link
          to="/usercart"
          state={{ userId }}
          className="btn btn-outline-primary position-relative"
        >
          <span role="img" aria-label="cart">🛒</span> My Cart
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <h1 className="canteen-menu-heading text-center mb-4">Food Items</h1>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {allFoodDetails.length === 0 ? (
            <div className="col-12 text-center">
              <img
                src="https://img.freepik.com/free-vector/choosing-healthy-unhealthy-food_23-2148552452.jpg"
                alt="No items"
                className="w-50 mb-3"
              />
              <h2 className="no-item-text">No Food Items available in this Canteen</h2>
            </div>
          ) : (
            allFoodDetails.map((food) => (
              <div key={food._id} className="col-12 col-md-4 mb-4">
                <div className="card h-100 shadow-sm each-food-card">
                  <img
                    src={food.imageUrl || 'https://via.placeholder.com/300'}
                    className="card-img-top"
                    alt={food.name}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{food.name}</h5>

                    {/* ⭐ Rating Display */}
                    <p className="text-warning mb-1">
                      ⭐ {food.avgRating?.toFixed(1) || '0.0'}{' '}
                      <span className="text-muted small">
                        ({food.ratings?.length || 0} rating{food.ratings?.length === 1 ? '' : 's'})
                      </span>
                    </p>

                    {/* ⭐ Star-based Rating Input */}
                    <div className="mb-2">
                      <label className="form-label small mb-1">Your Rating:</label>
                      <div>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <span
                            key={r}
                            role="button"
                            className="star-button"
                            style={{
                              color: r <= (userRatings[food._id] || 0) ? '#ffc107' : '#e4e5e9',
                              fontSize: '1.3rem',
                              marginRight: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleRatingChange(food._id, r)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="card-text text-muted mb-2">₹{food.price}</p>
                    <p className="card-text small flex-grow-1">{food.description}</p>
                    <button
                      className="btn btn-success mt-2"
                      onClick={() => handleAddToCart(food._id, food.name)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CanteenMenu;
