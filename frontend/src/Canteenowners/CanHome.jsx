import {  useEffect, useState} from 'react'
import React from 'react'
import { useLocation } from 'react-router-dom'
import './Canteen.css'
import { Link } from 'react-router-dom'

function CanHome() {
  const location = useLocation()
  const canowndetails = location.state.canown
  const canownemail = canowndetails.email
  
  
  
  const [canteen,setCanteen] = useState({
   name : "",openingtime: "",closingtime:""
  });
  let name,value;
  const handleInputs = (e) => {
      console.log(e);
      name = e.target.name;
      value = e.target.value;
      setCanteen({...canteen,[name]:value})
  }
  
  const PostCanteen = async(e) => {
   e.preventDefault();
   const {name,openingtime,closingtime}  = canteen

   const res = await fetch("/api/can/canteen",{
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
       name,openingtime,closingtime ,"creator" : canownemail
       })
   });
   const data  = await res.json();
  
   if(data.success){
      alert("Successfully canteen added")
   }
   else {
     alert(data.message)
   }
   window.location.reload();
  }

  //all canteens for each canowner using
  let [canOwnCanteens,getCanOwnCanteens] = useState([],canownemail)
 
   useEffect(()=>{
    const ShowCanteens = async() => {
      let url = "/api/can/canteen/" + canownemail
      const res = await fetch(url,{
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
     
    getCanOwnCanteens(data.canteens)
   }
   window.onload = ShowCanteens() 
  },[canownemail])
 console.log(canOwnCanteens)





 //Adding fooditems
 const [food,setFood] = useState({
 CantenName : "", name : "",price : "",imageUrl:"",description:""
});

 const AddingFoodHandleInputs = (e) => {
  console.log(e);
  name = e.target.name;
  value = e.target.value;
  setFood({...food,[name]:value})
}
console.log(food)
const AddItemInCanteen = async(e) => {
e.preventDefault()
 const {name,price,imageUrl,description,CantenName} = food 
const res = await fetch("/api/item/food/"+CantenName,{
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
      name,price,imageUrl,description,creator:canownemail
   })
});
const data  = await res.json();
 if(data.success ){
  alert("Successfull Item Added")
  window.location.reload();
 }
 else{
  alert("Please Check Your Details")
 }
}

//Remove Canteen 
const RemoveCanteen =(eachCanteen) => async() => {
  const res = await fetch(`/api/can/canteen/${eachCanteen.eachCanteen._id}`,{
    method : "DELETE" 
})
   const data = await res.json();
   window.location.reload()
   alert(data.message)
  }



  return (
    <div className='container'>
      <div className='row'>
      <h1 className='text-center canteen-home-heading mt-5' >Hi {canowndetails.name}</h1>
      <div className="col-3"></div>
     <div className='col-6'>
      <div className='add-canteen-card text-center shadow'>
      <form method='POST'>
        <input className='form-control ' name='name' value={canteen.name} placeholder='Enter Canteen Name' onChange={handleInputs}></input>
        <label htmlFor='openingTime' >Opening time</label>
        <input type='time' id="openingTime" name="openingtime" className='m-2' value={canteen.openingtime}   onChange={handleInputs}/>
        <br/>
        <label htmlFor='closingTime' >Closing time </label>
        <input type='time' id="colsingTime" className='m-2' onChange={handleInputs} name='closingtime' value={canteen.closingtime}/>
        <br/>
        <button className='btn btn-primary' onClick={PostCanteen}>Add Canteen</button>
      </form>
      
</div></div>
<div className="col-3"></div>

<div className='col-12 text-center mt-3' ><button className='btn btn-outline-danger' data-bs-toggle="modal" data-bs-target="#exampleModal">Add Items</button>       </div>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 >Add Items in Canteen</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form method='POST'>
      <div class="modal-body">
      <input type='text' name="CantenName" value={food.CantenName} className='form-control mb-1' placeholder='Enter Canteen Name' onChange={AddingFoodHandleInputs}/>
          <input type='text' name="name" value={food.name} className='form-control mb-1' placeholder='Enter Food Item Name' onChange={AddingFoodHandleInputs}/>
          <input type='text' name="price" value={food.price} className='form-control mb-1' placeholder='Enter Price' onChange={AddingFoodHandleInputs}/>
          <input type='text' name="imageUrl" value={food.imageUrl} className='form-control mb-1' placeholder='Image Url' onChange={AddingFoodHandleInputs}/>
          <textarea type='text' name="description" value={food.description} className='cols-3 w-100 form-control mb-1' placeholder='Enter Item Description' onChange={AddingFoodHandleInputs}></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onClick={AddItemInCanteen}>Add Item</button>
        </div>
        </form>
  
    </div>
  </div>
</div>


<h1 className='canteen-home-heading mt-3'>Your Canteens List</h1>
      {
        
        canOwnCanteens.map((eachCanteen)=>{
         return( 
           <div className='col-12 col-md-6'> 
            <div className='canteen-cards '> 
             <h2 className='canteen-cards-heading'>{eachCanteen.name}</h2>
             <p>Timings:- {eachCanteen.openingtime} to {eachCanteen.closingtime}</p>
             <button className='btn'  onClick={RemoveCanteen({eachCanteen})}>Remove Canteen</button>
             <button className='btn' >Update Canteen</button>
             <Link to={`/canteenownmenu/${eachCanteen._id}`} className='btn' >Show Menu</Link>
            </div>
           </div> 
         )
        })
      } 

</div>
    </div>
  )
}

export default CanHome
