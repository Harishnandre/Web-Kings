import React from 'react'
import { useNavigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Offcanvas from 'react-bootstrap/Offcanvas';
import './Loader.css'
import Footer from './Footer';
function Loader() {
    const history = useNavigate();
    const navigateToUserLogin = () => {history("/userlogin")}
    const navvigateToUserSignUp = () => {history("/usersignup")}
    const navigateToCanSignup = () => {history("/canteenlogin")}
    const navigateToCanLogin = () => {history("/canteensignup")}
    const expand = 'md'
    
  return (
   <div>

<Navbar key={expand} expand={expand} className="bg-body-tertiary" fixed='top'>
          <Container fluid>
            <Navbar.Brand className="loader-page-nav-links" >Feed ME Now</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
               
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={navigateToUserLogin} className='loader-page-nav-links'>User Login</Nav.Link>
      <Nav.Link onClick={navvigateToUserSignUp} className='loader-page-nav-links'>User Signup</Nav.Link>
      <Nav.Link onClick={navigateToCanSignup} className='loader-page-nav-links'>Canteen Login</Nav.Link>
      <Nav.Link onClick={navigateToCanLogin} className='loader-page-nav-links'>Canteen Signup</Nav.Link>
      <Nav.Link className='loader-page-nav-links'>Contact us</Nav.Link>
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        <div id="loaderPageBg" className=' loader-page-bg-image  d-flex flex-column justify-content-center ' style={{backgroundImage:`url('./asserts/loader-page-bg-image.jpg')`}}>
 <div className='loader-page-container'>
 <h1 className='text-center loader-page-container-heading'>Hungry?</h1>
     <p className='loader-page-container-para text-center'> Discover our array of freshly prepared dishes, from hearty breakfast options to savory lunches and delectable snacks...</p>
 </div>
  

 </div>

 <Footer/>
  
    </div>
   
  )
}

export default Loader;



