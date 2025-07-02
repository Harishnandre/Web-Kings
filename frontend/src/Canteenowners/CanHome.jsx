import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Canteen.css';

function CanHome() {
  const location = useLocation();
  const canowndetails = location.state.canown;
  const canownemail = canowndetails.email;

  const [canteen, setCanteen] = useState({ name: "", openingtime: "", closingtime: "" });
  const [canOwnCanteens, getCanOwnCanteens] = useState([]);
  const [food, setFood] = useState({ CantenName: "", name: "", price: "", imageUrl: "", description: "" });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCanteenData, setUpdateCanteenData] = useState({ _id: "", name: "", openingtime: "", closingtime: "" });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setCanteen({ ...canteen, [name]: value });
  };

  const AddingFoodHandleInputs = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
  };

  const handleUpdateInputs = (e) => {
    const { name, value } = e.target;
    setUpdateCanteenData((prev) => ({ ...prev, [name]: value }));
  };

  const PostCanteen = async (e) => {
    e.preventDefault();
    const { name, openingtime, closingtime } = canteen;
    const res = await fetch("/api/can/canteen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, openingtime, closingtime, creator: canownemail })
    });
    const data = await res.json();
    if (data.success) {
      alert("Successfully canteen added");
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  const AddItemInCanteen = async (e) => {
    e.preventDefault();
    const { name, price, imageUrl, description, CantenName } = food;
    const res = await fetch("/api/item/food/" + CantenName, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, imageUrl, description, creator: canownemail })
    });
    const data = await res.json();
    if (data.success) {
      alert("Successfull Item Added");
      window.location.reload();
    } else {
      alert("Please Check Your Details");
    }
  };

  const RemoveCanteen = (eachCanteen) => async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete \"${eachCanteen.eachCanteen.name}\" canteen?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/can/canteen/${eachCanteen.eachCanteen._id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    alert(data.message);
    window.location.reload();
  };

  const openUpdateModal = (canteen) => () => {
    setUpdateCanteenData({ ...canteen });
    setShowUpdateModal(true);
  };

  const updateCanteen = async () => {
    const { _id, name, openingtime, closingtime } = updateCanteenData;
    const res = await fetch(`/api/can/canteen/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, openingtime, closingtime })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Canteen updated successfully!");
      window.location.reload();
    } else {
      alert(data.message || "Update failed!");
    }
  };

  useEffect(() => {
    const ShowCanteens = async () => {
      const res = await fetch(`/api/can/canteen/${canownemail}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      getCanOwnCanteens(data.canteens);
    };
    ShowCanteens();
  }, [canownemail]);

  return (
    <div className='container'>
      <div className='row'>
        <h1 className='text-center canteen-home-heading mt-5'>Hi {canowndetails.name}</h1>
        <div className="col-3"></div>
        <div className='col-6'>
          <div className='add-canteen-card text-center shadow'>
            <form method='POST'>
              <input className='form-control' name='name' value={canteen.name} placeholder='Enter Canteen Name' onChange={handleInputs} />
              <label>Opening time</label>
              <input type='time' name="openingtime" className='m-2' value={canteen.openingtime} onChange={handleInputs} />
              <label>Closing time</label>
              <input type='time' name='closingtime' className='m-2' value={canteen.closingtime} onChange={handleInputs} />
              <button className='btn btn-primary' onClick={PostCanteen}>Add Canteen</button>
            </form>
          </div>
        </div>
        <div className="col-3"></div>

        <div className='col-12 text-center mt-3'>
          <button className='btn btn-outline-danger' data-bs-toggle="modal" data-bs-target="#exampleModal">Add Items</button>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Items in Canteen</h3>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form method='POST'>
                <div className="modal-body">
                  <input name="CantenName" value={food.CantenName} className='form-control mb-1' placeholder='Canteen Name' onChange={AddingFoodHandleInputs} />
                  <input name="name" value={food.name} className='form-control mb-1' placeholder='Food Item Name' onChange={AddingFoodHandleInputs} />
                  <input name="price" value={food.price} className='form-control mb-1' placeholder='Price' onChange={AddingFoodHandleInputs} />
                  <input name="imageUrl" value={food.imageUrl} className='form-control mb-1' placeholder='Image Url' onChange={AddingFoodHandleInputs} />
                  <textarea name="description" value={food.description} className='form-control mb-1' placeholder='Item Description' onChange={AddingFoodHandleInputs}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={AddItemInCanteen}>Add Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <h1 className='canteen-home-heading mt-3'>Your Canteens List</h1>
        {canOwnCanteens.map((eachCanteen) => (
          <div key={eachCanteen._id} className='col-12 col-md-6'>
            <div className='canteen-cards'>
              <h2 className='canteen-cards-heading'>{eachCanteen.name}</h2>
              <p>Timings: {eachCanteen.openingtime} to {eachCanteen.closingtime}</p>
              <button className='btn' onClick={RemoveCanteen({ eachCanteen })}>Remove Canteen</button>
              <button className='btn' onClick={openUpdateModal(eachCanteen)}>Update Canteen</button>
              <Link to={`/canteenownmenu/${eachCanteen._id}`} className='btn'>Show Menu</Link>
            </div>
          </div>
        ))}
      </div>

      {showUpdateModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Canteen</h5>
                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className='form-control mb-2' name='name' value={updateCanteenData.name} onChange={handleUpdateInputs} placeholder='Canteen Name' />
                <label>Opening Time</label>
                <input className='form-control mb-2' type="time" name='openingtime' value={updateCanteenData.openingtime} onChange={handleUpdateInputs} />
                <label>Closing Time</label>
                <input className='form-control' type="time" name='closingtime' value={updateCanteenData.closingtime} onChange={handleUpdateInputs} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={updateCanteen}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CanHome;
