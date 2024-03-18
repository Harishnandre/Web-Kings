import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Home.css'
import {  useLocation,Link } from 'react-router-dom';
import Footer from '../LoaderPage/Footer';

function Home() {

  const expand = 'md'
  const location = useLocation()
  const userdetails = location.state.userdetails
  const [canteens,setCanteen] = useState([])
   useEffect(()=>{
    const ShowCanteens = async() => {
      const res = await fetch("/api/can/canteen",{
          method : "GET",
          headers : {
           "Content-Type": "application/json",
            "User-Agent"  : "PostmanRuntime/7.37.0",
            "Accept" : "*/*",
            "Accept-Encoding" : "gzip, deflate, br",
            "Connection" : "Connection"
           }
      });
      const data = await res.json();
    setCanteen(data.canteens)
   }
   
   window.onload = ShowCanteens()
  },[])
 console.log(canteens)
     
  return (
    <>
    <div className='user-home-bg-container'>
     <Navbar key={expand} expand={expand} className="Home-page-nav-bar" fixed='top'>
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
               
      <Nav.Link >Home</Nav.Link>
     <Nav.Link  >My Cart</Nav.Link>
      <Nav.Link >Contact us</Nav.Link>
      <Nav.Link >{userdetails.name}</Nav.Link>
      <Link to="/" className='btn btn-outline-danger '>Logout</Link>
      
                </Nav>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

    <div className='container'>
    <h1 className='mt-5 canteen-list-heading'>Canteens</h1>
  <div className='row'>
  {
  (canteens.length === 0) ? (
    <div class=" mt-5 mb-5" id="spinner">
            <div class="d-flex flex-row justify-content-center">
                <div class="spinner-border" role="status">
                </div>
            </div>
        </div>
  ) : 
   canteens.map((eachCanteen)=>{
      return (
       <div className='col-12 col-md-6'>
        <div className='canteens-cards shadow'>
            <h1>{eachCanteen.name}</h1>
            <p>Timings: {eachCanteen.openingtime} to {eachCanteen.closingtime} </p>
  
            <Link to={`/usercanteenmenu/${eachCanteen._id}`} className='btn btn-danger'>Menu</Link>
           </div>
       </div>
      )
    })
  }
  </div>
    </div>
    
   
    

    </div>
  
  <Footer/>
  </>
  )
}

export default Home
