import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Footer from '../LoaderPage/Footer';
import './Home.css';
import { useCart } from '../Context/CartContext';
import { useRatings } from '../Context/RatingsContext'; // ✅ Added

function Home() {
  const expand = 'md';
  const location = useLocation();
  const userdetails = location.state.userdetails;
  const [canteens, setCanteen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState({}); // ✅ New state

  const { cart, fetchCart } = useCart();
  const { rateCanteen } = useRatings(); // ✅ Use context method

  useEffect(() => {
    if (userdetails?._id) {
      fetchCart(userdetails._id);
    }
  }, [userdetails, fetchCart]);

  useEffect(() => {
    const showCanteens = async () => {
      try {
        const res = await fetch('/api/can/canteen');
        const data = await res.json();
        setCanteen(data.canteens || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching canteens:', error);
        setLoading(false);
      }
    };
    showCanteens();
  }, []);

  // Load user's existing ratings
  useEffect(() => {
    const initialRatings = {};
    canteens.forEach((c) => {
      const userRating = c.ratings?.find((r) => r.user === userdetails._id);
      if (userRating) initialRatings[c._id] = userRating.rating;
    });
    setUserRatings(initialRatings);
  }, [canteens, userdetails]);

  const handleCanteenRating = async (canteenId, rating) => {
    const result = await rateCanteen(canteenId, userdetails._id, rating);
    if (result) {
      const updatedCanteens = canteens.map((c) => {
        if (c._id === canteenId) {
          const hasExisting = c.ratings?.some((r) => r.user === userdetails._id);
          const updatedRatings = hasExisting
            ? c.ratings.map((r) => (r.user === userdetails._id ? { ...r, rating } : r))
            : [...(c.ratings || []), { user: userdetails._id, rating }];
          return {
            ...c,
            avgRating: result.avgRating,
            ratings: updatedRatings,
          };
        }
        return c;
      });
      setCanteen(updatedCanteens);
      setUserRatings((prev) => ({ ...prev, [canteenId]: rating }));
    }
  };

  const cartCount = cart?.canteens?.reduce((sum, cg) => sum + cg.items.length, 0) || 0;

  return (
    <>
      <div className="user-home-bg-container">
        <Navbar key={expand} expand={expand} className="Home-page-nav-bar shadow-sm" fixed="top" bg="light">
          <Container fluid>
            <Navbar.Brand className="loader-page-nav-links fw-bold fs-4 text-danger">🍴 Feed ME Now</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Welcome, {userdetails.name}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="ms-auto">
                  <Nav.Link as={Link} to="/userHome"  state={{ userdetails}}>Home</Nav.Link>
                  <Nav.Link as={Link} to="/usercart" state={{ userId: userdetails._id }}>
                    My Cart
                    {cartCount > 0 && (
                      <span className="badge bg-danger ms-2">{cartCount}</span>
                    )}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/userorders" state={{ userId: userdetails._id }}>
                    My Orders
                  </Nav.Link>
                  {/* <Nav.Link as={Link} to="#">Contact Us</Nav.Link> */}
                  <Nav.Link disabled>{userdetails.name}</Nav.Link>
                  <Link to="/" className="btn btn-outline-danger ms-3">Logout</Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        <div className="container mt-5 pt-5">
          <h1 className="text-center mb-4 canteen-list-heading">Available Canteens</h1>

          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : canteens.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center my-5">
              <h2 className="text-danger mb-2">No Canteens Available</h2>
              <p className="text-muted">Please check back later. We’ll have delicious options soon!</p>
            </div>
          ) : (
            <div className="row g-4">
              {canteens.map((canteen) => (
                <div key={canteen._id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow canteens-cards">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="card-title text-danger">{canteen.name}</h5>
                        <p className="card-text text-muted">Timings: {canteen.openingtime} - {canteen.closingtime}</p>
                        
                        {/* ⭐ Avg Rating */}
                        <p className="text-warning mb-1">
                          ⭐ {canteen.avgRating?.toFixed(1) || '0.0'}{' '}
                          <span className="text-muted small">
                            ({canteen.ratings?.length || 0} rating{canteen.ratings?.length === 1 ? '' : 's'})
                          </span>
                        </p>

                        {/* ⭐ User Rating Input */}
                        <div>
                          <label className="form-label small mb-1">Your Rating:</label>
                          <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                role="button"
                                style={{
                                  color: star <= (userRatings[canteen._id] || 0) ? '#ffc107' : '#e4e5e9',
                                  fontSize: '1.3rem',
                                  marginRight: '4px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleCanteenRating(canteen._id, star)}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/usercanteenmenu/${canteen._id}`}
                        state={{ userId: userdetails._id }}
                        className="btn btn-outline-danger mt-3"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
