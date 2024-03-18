import React, { useState } from 'react'
import { Link, useNavigate} from "react-router-dom"
import './Users.css'
function Signup() {

  
   const history = useNavigate()
    const [user,setUser] = useState({
        name : "",email: "",password: "",college_id:""
    });
    let name,value;
    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({...user,[name]:value})
    }
    const PostData = async(e) => {
     e.preventDefault();
     const {name,email,password,college_id}  = user

     const res = await fetch("/api/users/signup",{
         method : "POST",
         headers : {
          "Content-Type": "application/json",
           "User-Agent"  : "PostmanRuntime/7.37.0",
           "Accept" : "*/*",
           "Accept-Encoding" : "gzip, deflate, br",
           "Connection" : "Connection"
          }
         ,
         body : JSON.stringify({
            name ,email ,password ,college_id 
         })
     });
     const data  = await res.json();
   

     if(data.success){
       alert("Successfully Registered")
      history("/userlogin");
     }
     else{
      alert(data.message)
   
     }
     
    }
  return (

 <div className='usersignup-bg-container' >
 <div className='container '>
 <div className='row '>
  <div className='col-3'></div>
  <div className='col-6 '>
    <div className='signup-form shadow'>
 <form method='POST'>
    <h1 className='text-center signup-heading' >Signup</h1>
    <label htmlFor='name'>Username</label>
    <input type='name'  name='name' value={user.name} className='form-control mb-2' onChange={handleInputs} placeholder='User Name' required/>
    <label htmlFor='email'>Email</label>
    <input type='email' name="email" value={user.email} className='form-control mb-2'  onChange={handleInputs} placeholder='Email' required/>
    <label htmlFor='password'>Password</label>
    <input type='password' name="password" value={user.password} className='form-control mb-2'  onChange={handleInputs} placeholder='Password' required/>
    <label htmlFor='college_id'>College Identity</label>
    <input type='text' name="college_id" value={user.college_id} className='form-control mb-2'  onChange={handleInputs} placeholder='College Identity' required/>
   

    <div className='text-center'>
      <button className='btn btn-outline-danger mb-2 w-100' onClick={PostData}>Submit</button>
    <br/>
    <Link to="/userlogin" className='text-center' >Have Account</Link>
    </div>

 </form>
 </div>
 </div>
 </div>
 </div>
    </div>
  )
 
}

export default Signup
