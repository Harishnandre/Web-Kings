import {React,useState} from 'react'
import {useNavigate ,Link } from 'react-router-dom';

function  UserLogin() {
 
   const history = useNavigate();
    const [user,setUser] = useState({
      college_id: "",  password: ""
    });
    let name,value;
    const handleInputs = (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setUser({...user,[name]:value})
    }
    const LoginData = async(e) => {
      e.preventDefault();
      const {password, college_id} = user;
    
      try {
        const res = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "PostmanRuntime/7.37.0",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "Connection"
          },
          body: JSON.stringify({ password, college_id })
        });
    
        // Log the raw response text
        const textData = await res.text();
        console.log('Response Text:', textData);
    
        // Try to parse the response as JSON
        let data;
        try {
          data = JSON.parse(textData);
        } catch (jsonError) {
          console.error('JSON Parsing Error:', jsonError.message);
          alert('Failed to parse server response');
          return;
        }
    
        // Handle the parsed JSON data
        if (data.message === "Logged in!") {
          alert("Login Successful");
          history("/userHome", { state: { userdetails: data.user } });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Fetch Error:', error.message);
        alert('Failed to connect to the server');
      }
    };
    
    
  return (
    <div className='usersignup-bg-container'>
    <div className='container '>
    <div className='row '>
     <div className='col-3'></div>
     <div className='col-6 '>
       <div className='signup-form shadow'>
    <form method='POST'>
       <h1 className='text-center signup-heading'>Login</h1>
       <label htmlFor='college_id'>College Identity</label>
       <input type='text' name="college_id" value={user.college_id} className='form-control mb-2'  onChange={handleInputs} placeholder='College Identity' required/>
       <label htmlFor='password'>Password</label>
       <input type='password' name="password" value={user.password} className='form-control mb-2'  onChange={handleInputs} placeholder='Password' required/>
     
     
   
       <div className='text-center'>
         <button className='btn btn-outline-danger mb-3 w-100' onClick={LoginData}>Login</button>
       <br/>
       <Link to="/usersignup" className='text-center' >Don't you have Account?</Link>
       </div>
   
    </form>
    </div>
    </div>
    </div>
    </div>
       </div>





    
    
      
  )
}

export default UserLogin
