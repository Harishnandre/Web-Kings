import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import UserLogin from './Users/UserLogin';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './Users/Home';
import Signup from './Users/Signup'
import CanLogin from './Canteenowners/CanLogin';
import CanHome from './Canteenowners/CanHome';
import CanSignup from './Canteenowners/CanSignup';
import Loader from './LoaderPage/Loader';
import CanteenMenu from './Users/CanteenMenu';
import CanOwnCanteenMenu from './Canteenowners/CanOwnCanteenMenu';
import UserCart from './Users/UserCart';

function App() {
  return (
    
    <div className="App">
    
   <Router>
      
      <Routes>
      <Route path="/" element={<Loader/>}></Route>
        <Route path="/canteenlogin" element={<CanLogin/>}></Route>
        <Route path="/canteensignup" element={<CanSignup/>}></Route>
        <Route path='/canteenHome' element={<CanHome/>}></Route>
        <Route path="/userlogin" element={<UserLogin/>}></Route>
        <Route path="/usersignup" element={<Signup/>}></Route>
       <Route path='/userHome' element={<Home/>}></Route>
       <Route path='/usercanteenmenu/:canteenId' element={<CanteenMenu/>}></Route>
       <Route path='/canteenownmenu/:canteenId' element={<CanOwnCanteenMenu/>}></Route>
       <Route path='/usercart' element={<UserCart/>}></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
