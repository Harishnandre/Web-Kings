import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Home.css';

function CanteenMenu() {
  const { canteenId } = useParams();
  const [foodItemIds, setFoodItemIds] = useState([]);
  const [allFoodDetails, setFoodDetails] = useState([]);
  const [cart, setCart] = useState({}); // key: foodId, value: quantity

  // Fetch food IDs for the canteen
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

  // Fetch food item details
  useEffect(() => {
    const fetchFoodDetails = async () => {
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
    };
    if (foodItemIds.length > 0) fetchFoodDetails();
  }, [foodItemIds]);

  const addToCart = (foodId) => {
    setCart((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));
  };

  return (
    <div className="container mt-4">
      <h1 className="canteen-menu-heading text-center mb-4">Food Items</h1>

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
                  <p className="card-text text-muted mb-2">₹{food.price}</p>
                  <p className="card-text small flex-grow-1">{food.description}</p>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => addToCart(food._id)}
                  >
                    Add to Cart
                    {cart[food._id] ? (
                      <span className="badge bg-light text-dark ms-2">
                        {cart[food._id]}
                      </span>
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CanteenMenu;
