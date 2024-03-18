import {React,useState} from 'react'
import {useNavigate ,Link } from 'react-router-dom';
function CanLogin() {
  const history = useNavigate();
  const [canown,setUser] = useState({
    email:"",  password: ""
  });
  let name,value;
  const handleInputs = (e) => {
      console.log(e);
      name = e.target.name;
      value = e.target.value;
      setUser({...canown,[name]:value})
  }
  const CanLoginData = async(e) => {
   e.preventDefault();
   const {password,email}  = canown

   const res = await fetch("/api/canowner/login",{
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
       password ,email
       })
   });
   const data  = await res.json();
  
   if(data.message === "Logged in!"){
      alert("Login Successfull")
      history("/canteenHome",{state:{canown:data.user}});
   }
   else {
     alert(data.message)
   }
  }

  return (
    <div className='usersignup-bg-container'>
    <div className='container '>
    <div className='row '>
     <div className='col-3'></div>
     <div className='col-6 '>
       <div className='signup-form shadow'>
    <form method='POST'>
       <h1 className='text-center signup-heading'>Login</h1>
       <label htmlFor='Email'>Email</label>
       <input type='text' name="email" value={canown.email} className='form-control mb-2'  onChange={handleInputs} placeholder='Email' required/>
       <label htmlFor='password'>Password</label>
       <input type='password' name="password" value={canown.password} className='form-control mb-2'  onChange={handleInputs} placeholder='Password' required/>
     
     
   
       <div className='text-center'>
         <button className='btn btn-outline-danger mb-3 w-100' onClick={CanLoginData}>Login</button>
       <br/>
       <Link to="/canteensignup" className='text-center' >Don't you have Account?</Link>
       </div>
   
    </form>
    </div>
    </div>
    </div>
    </div>
       </div>





    
  )
}

export default CanLogin
