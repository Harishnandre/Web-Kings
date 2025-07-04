import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Canteen.css';
import './CanHome.css';

function CanHome() {
  const location = useLocation();
  const canowndetails = location.state.canown;
  const canownemail = canowndetails.email;

  const [canteen, setCanteen] = useState({ name: "", openingtime: "", closingtime: "" });
  const [canOwnCanteens, setCanOwnCanteens] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCanteenData, setUpdateCanteenData] = useState({ _id: "", name: "", openingtime: "", closingtime: "" });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setCanteen({ ...canteen, [name]: value });
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

  const RemoveCanteen = (eachCanteen) => async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${eachCanteen.name}" canteen?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/can/canteen/${eachCanteen._id}`, {
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
      setCanOwnCanteens(data.canteens);
    };
    ShowCanteens();
  }, [canownemail]);

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <h1 className='text-center canteen-home-heading mt-5 mb-4'>Hi {canowndetails.name}</h1>
        <div className="col-12 col-md-8 col-lg-6">
          <div className='add-canteen-card text-center shadow p-4 mb-4 rounded'>
            <h3 className="mb-3 text-primary">Add New Canteen</h3>
            <form method='POST'>
              <input className='form-control mb-3' name='name' value={canteen.name} placeholder='Enter Canteen Name' onChange={handleInputs} />
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Opening time</label>
                  <input type='time' name="openingtime" className='form-control' value={canteen.openingtime} onChange={handleInputs} />
                </div>
                <div className="col">
                  <label className="form-label">Closing time</label>
                  <input type='time' name='closingtime' className='form-control' value={canteen.closingtime} onChange={handleInputs} />
                </div>
              </div>
              <button className='btn btn-primary w-100' onClick={PostCanteen}>Add Canteen</button>
            </form>
          </div>
        </div>
      </div>

      <h2 className='canteen-home-heading mt-4 mb-3 text-center'>Your Canteens List</h2>
      <div className="row g-4">
        {canOwnCanteens.length === 0 ? (
          <div className="col-12 text-center">
            <img
              src="https://img.freepik.com/free-vector/empty-concept-illustration_114360-1188.jpg"
              alt="No canteens"
              className="mb-3"
              style={{ maxWidth: '320px', width: '100%' }}
            />
            <h4 className="text-danger">No canteens added yet.</h4>
            <p className="text-muted">Start by adding your first canteen above.</p>
          </div>
        ) : (
          canOwnCanteens.map((eachCanteen) => (
            <div key={eachCanteen._id} className='col-12 col-md-6 col-lg-4'>
              <div className='canteen-cards shadow-sm rounded p-4 h-100 d-flex flex-column justify-content-between'>
                <div>
                  <h4 className='canteen-cards-heading text-primary'>{eachCanteen.name}</h4>
                  <p className="mb-2"><span className="fw-bold">Timings:</span> {eachCanteen.openingtime} to {eachCanteen.closingtime}</p>
                  {/* ⭐ Canteen Rating Display */}
                  {eachCanteen.avgRating !== undefined && (
                    <p className="mb-2 text-warning">
                      ⭐ {eachCanteen.avgRating?.toFixed(1) || '0.0'}
                      <span className="text-muted small"> ({eachCanteen.ratings?.length || 0} rating{eachCanteen.ratings?.length === 1 ? '' : 's'})</span>
                    </p>
                  )}
                </div>
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <button className='btn btn-outline-danger btn-sm' onClick={RemoveCanteen(eachCanteen)}>Remove</button>
                  <button className='btn btn-outline-primary btn-sm' onClick={openUpdateModal(eachCanteen)}>Update</button>
                  <Link to={`/canteenownmenu/${eachCanteen._id}`} className='btn btn-outline-success btn-sm'>Show Menu</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showUpdateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Update Canteen</h5>
                <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className='form-control mb-2' name='name' value={updateCanteenData.name} onChange={handleUpdateInputs} placeholder='Canteen Name' />
                <label className="form-label">Opening Time</label>
                <input className='form-control mb-2' type="time" name='openingtime' value={updateCanteenData.openingtime} onChange={handleUpdateInputs} />
                <label className="form-label">Closing Time</label>
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
