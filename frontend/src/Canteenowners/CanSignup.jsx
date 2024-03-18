import {React,useState}from 'react'
import './Canteen.css'
import { Link ,useNavigate} from 'react-router-dom'


function CanSignup() {
  const history = useNavigate()
    const [canown,setUser] = useState({
        name : "",email: "",password: ""
    });
    let name,value;
    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({...canown,[name]:value})
    }
    const CanSignup = async(e) => {
     e.preventDefault();
     const {name,email,password}  = canown

     const res = await fetch("/api/canowner/signup",{
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
            name ,email ,password 
         })
     });
     const data  = await res.json();
     console.log(data.success)

     if(data.success){
       alert("Successfully Registered")
      history("/canteenlogin");
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
    <label htmlFor='name'>Name</label>
    <input type='name'  name='name' value={canown.name} className='form-control mb-2' onChange={handleInputs} placeholder='Name' required/>
    <label htmlFor='email'>Email</label>
    <input type='email' name="email" value={canown.email} className='form-control mb-2'  onChange={handleInputs} placeholder='Email' required/>
    <label htmlFor='password'>Password</label>
    <input type='password' name="password" value={canown.password} className='form-control mb-2'  onChange={handleInputs} placeholder='Password' required/>
   
    <div className='text-center'>
      <button className='btn btn-outline-danger mb-2 w-100' onClick={CanSignup}>Submit</button>
    <br/>
    <Link to="/canteenlogin" className='text-center' >Have Account</Link>
    </div>

 </form>
 </div>
 </div>
 </div>
 </div>
    </div>
  )
}

export default CanSignup
