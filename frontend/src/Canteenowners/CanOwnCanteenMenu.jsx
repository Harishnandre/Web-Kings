import {React,useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import "./Canteen.css"
function CanOwnCanteenMenu() {
    let {canteenId} = useParams();
    //get foodIds of canteen
    const [foodItemIds,getFoodIds] = useState([])
     useEffect(()=>{
      const FoodIds = async() => {
        const res = await fetch("/api/can/canteenbyid/"+canteenId,{
            method : "GET"
        });
        const data = await res.json();
      window.onload = getFoodIds(data.canteen.food)
     }
   FoodIds()
    },[canteenId])
  
  
   //get all foods by foodIds
   const [allFoodDetails,getFoodDetails] = useState([])
   useEffect(()=>{
    const FetchFoodDetails = async() => {
       const foodDetails = []
       for(let eachId of foodItemIds){
         const res = await fetch(`/api/item/food/${eachId}`)
         const data = await res.json()
         foodDetails.push(data.food)
       }
       getFoodDetails(foodDetails)
    }
   FetchFoodDetails()
   },[foodItemIds])
   console.log(allFoodDetails)

   //Remove a food item in canteen
   const RemoveItem =(eachFood) => async() => {
    const res = await fetch(`/api/item/food/${eachFood.eachFood._id}`,{
        method : "DELETE" 
    })
       const data = await res.json();
       window.location.reload()
       alert(data.message)
    }

  return (
    <div className='container'>
    <div className='row'>
        <h1 className='can-own-food-items-heading mt-3'>Canteen Items</h1>
        {
        (allFoodDetails.length === 0) ? (
          <div className='col-12 text-center'>
            <img src="https://img.freepik.com/free-vector/choosing-healthy-unhealthy-food_23-2148552452.jpg" alt='' className='w-50'/>
          <h1 className='no-item-text'>No Food Items added yet in this Canteen</h1>
            </div>
          ) :  
         allFoodDetails.map((eachFood)=>{
          if(eachFood.imageUrl === undefined) return <p></p>;
          else{
             return (
                <div className='col-12 col-md-4'>
                <div className='each-food-card mb-3'> 
              <img src={eachFood.imageUrl} alt='' className='w-100'/>
                 <h2>{eachFood.name}</h2>
                 <p>{eachFood.price}/-</p>
                <button className='btn btn-outline-danger' onClick={RemoveItem({eachFood})}>Remove Item</button>
                </div>
                </div>
             )}
         })
        }
    </div>
    </div>
  )
}

export default CanOwnCanteenMenu
