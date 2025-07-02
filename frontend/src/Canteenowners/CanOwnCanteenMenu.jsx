import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Canteen.css';

function CanOwnCanteenMenu() {
  const { canteenId } = useParams();
  const [allFoodDetails, setAllFoodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const fetchCanteenFoodItems = async () => {
      try {
        const res = await fetch(`/api/can/canteenbyid/${canteenId}`);
        const data = await res.json();

        const foodIds = data.canteen.food;
        const foodDetails = [];

        for (let id of foodIds) {
          const res = await fetch(`/api/item/food/${id}`);
          const foodData = await res.json();
          if (foodData.success) {
            foodDetails.push(foodData.food);
          }
        }

        setAllFoodDetails(foodDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food items:', error);
        setLoading(false);
      }
    };

    fetchCanteenFoodItems();
  }, [canteenId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/item/food/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message);
      setAllFoodDetails(prev => prev.filter(item => item._id !== deleteTarget._id));
    } catch (error) {
      alert('Failed to delete item.');
    }

    setDeleteTarget(null);
  };

  const handleEditInputChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openEditModal = (food) => {
    setEditTarget(food);
    setEditForm({
      name: food.name,
      price: food.price,
      description: food.description || '',
    });
  };

  const handleUpdateFood = async () => {
    try {
      const res = await fetch(`/api/item/food/${editTarget._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        alert('Food updated successfully');
        setAllFoodDetails(prev =>
          prev.map(food => (food._id === editTarget._id ? data.food : food))
        );
      } else {
        alert('Failed to update food');
      }
    } catch (err) {
      alert('Server error while updating food');
    }
    setEditTarget(null);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center can-own-food-items-heading mb-4">Canteen Items</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : allFoodDetails.length === 0 ? (
        <div className="text-center">
          <img
            src="https://img.freepik.com/free-vector/choosing-healthy-unhealthy-food_23-2148552452.jpg"
            alt="No items"
            className="w-50 mb-3"
          />
          <h2 className="no-item-text">No food items added yet.</h2>
        </div>
      ) : (
        <div className="row">
          {allFoodDetails.map((eachFood) => (
            <div key={eachFood._id} className="col-12 col-md-4 mb-4">
              <div className="card shadow each-food-card h-100">
                <img
                  src={eachFood.imageUrl || 'https://via.placeholder.com/300'}
                  alt={eachFood.name}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{eachFood.name}</h5>
                  <p className="card-text text-muted mb-2">₹{eachFood.price}</p>
                  <p className="card-text small flex-grow-1">{eachFood.description}</p>
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteConfirmModal"
                      onClick={() => setDeleteTarget(eachFood)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => openEditModal(eachFood)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <div className="modal fade" id="deleteConfirmModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Edit Food Item</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="mb-2">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={editForm.price}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="mb-2">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={editForm.description}
                  onChange={handleEditInputChange}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdateFood}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanOwnCanteenMenu;
