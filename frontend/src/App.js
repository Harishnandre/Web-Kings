import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import UserLogin from './Users/UserLogin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Users/Home';
import Signup from './Users/Signup'
import CanLogin from './Canteenowners/CanLogin';
import CanHome from './Canteenowners/CanHome';
import CanSignup from './Canteenowners/CanSignup';
import Loader from './LoaderPage/Loader';
import CanteenMenu from './Users/CanteenMenu';
import CanOwnCanteenMenu from './Canteenowners/CanOwnCanteenMenu';
import Cart from './Cart/Cart';
import { CartProvider } from './Context/CartContext';// <-- Import CartProvider
import { RatingsProvider } from './Context/RatingsContext'; // <-- Import RatingsProvider
import { OrderProvider } from './Context/OrderContext'; // <-- Import OrderProvider
import Order from './Order/userOrders'
import CanOrders from './Order/canteenOrders'; 

function App() {
  return (
    <CartProvider> <RatingsProvider>
       <OrderProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Loader />} />
            <Route path="/canteenlogin" element={<CanLogin />} />
            <Route path="/canteensignup" element={<CanSignup />} />
            <Route path='/canteenHome' element={<CanHome />} />
            <Route path="/userlogin" element={<UserLogin />} />
            <Route path="/usersignup" element={<Signup />} />
            <Route path='/userHome' element={<Home />} />
            <Route path='/usercanteenmenu/:canteenId' element={<CanteenMenu />} />
            <Route path='/canteenownmenu/:canteenId' element={<CanOwnCanteenMenu />} />
            <Route path='/usercart' element={<Cart />} />
            <Route path='/userorders' element={<Order />} />
            <Route path='/canteenorders/:canteenId' element={<CanOrders />} />
          </Routes>
        </Router>
      </div>
      </OrderProvider>
      </RatingsProvider>
    </CartProvider>
  );
}

export default App;
