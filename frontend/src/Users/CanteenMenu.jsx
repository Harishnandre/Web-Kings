import {React,useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import "./Home.css"
function CanteenMenu() {
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
  return (
    
    <div className='container'>
     
      <div className='row'>
        
        <h1 className='canteen-menu-heading mt-5'>Food Items</h1>
        {
     (allFoodDetails.length === 0) ? (
      <div className='col-12 text-center'>
        <img src="https://img.freepik.com/free-vector/choosing-healthy-unhealthy-food_23-2148552452.jpg" alt='' className='w-50'/>
      <h2 className='no-item-text'>No Food Items added yet in this Canteen</h2>
        </div>
      ) :   
          allFoodDetails.map((eachFood)=>{
             return (
              <div className='col-12 col-md-4'>
                <div className='each-food-card mb-3'> 
                 <img src={eachFood.imageUrl} alt='' className='w-100'/>
                 <h2>{eachFood.name}</h2>
                 <p>{eachFood.price}/-</p>
                 <button className='btn btn-primary'>Add to Cart</button>
                </div>
                </div>
             )
          })
        }
      </div>
    </div>
  )
}

export default CanteenMenu
