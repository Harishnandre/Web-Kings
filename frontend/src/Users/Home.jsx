import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Footer from '../LoaderPage/Footer';
import './Home.css';
import { useCart } from '../Context/CartContext'; // Import CartContext

function Home() {
  const expand = 'md';
  const location = useLocation();
  const userdetails = location.state.userdetails;
  const [canteens, setCanteen] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart context
  const { cart, fetchCart } = useCart();

  // Fetch cart on mount if userdetails exists
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
        setCanteen(data.canteens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching canteens:', error);
        setLoading(false);
      }
    };

    showCanteens();
  }, []);

  // Unique items count for cart badge
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
                  <Nav.Link as={Link} to="#">Home</Nav.Link>
                  <Nav.Link as={Link} to="/usercart" state={{ userId: userdetails._id }}>
                    My Cart
                    {cartCount > 0 && (
                      <span className="badge bg-danger ms-2">{cartCount}</span>
                    )}
                  </Nav.Link>
                  <Nav.Link as={Link} to="#">Contact Us</Nav.Link>
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