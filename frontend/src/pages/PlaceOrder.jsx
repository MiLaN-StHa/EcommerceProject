import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import esewa from '../assets/pngegg.png'
import khalti from '../assets/kals.jpg'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const PlaceOrder = () => {

const [method,setMethod]=useState('cod');

const {navigate,backendUrl , token, cartItems, getCartAmount,setCartItems, delivery_fee, products, gerProductData}=useContext(ShopContext);
const [formData, setFormData]=useState({
  firstName:'',
  lastName:'',
  email:'',
  street:'',
  city:'',
  state:'',
  zipcode:'',
  country:'',
  phone:''
})

const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;

  setFormData(data=>({...data,[name]:value}))

}

const onsubmitHandler = async (event) => {
  event.preventDefault();
  try {
    let orderItems = [];

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];  // Get the quantity of the item

      if (quantity > 0) {
        // Find the corresponding product in the products array
        const itemInfo = structuredClone(products.find(product => product._id === itemId));

        if (itemInfo) {
          itemInfo.quantity = quantity; // Set the quantity from the cart
          orderItems.push(itemInfo);    // Push to orderItems array
        }
      }
    }

    let orderData= {
      address:formData,
      items: orderItems,
      amount: getCartAmount()+ delivery_fee
    }

    switch (method) {
      // API calls for COD
      case 'cod' :
        const response = await axios.post(backendUrl+ '/api/order/place', orderData, {headers:{token}})
        if (response.data.success) {
          setCartItems({})
          await gerProductData();
          navigate('/orders')
        }
        else{
          toast.error(response.data.message)
        }
        break;
      case 'esewa':
        navigate('/sorry')
        break;
      case 'khalti':
        navigate('/sorry')
        break;
          
      default:
        break;
    }
    
  } catch (error) {
    console.error(error);  
    toast.error(error.message)
  }
};

  return (
    <form onSubmit={onsubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* ----------------Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className=' text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email Address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />  
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>
      {/* -----------Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'}/>
            {/* ------------------Payment method */}
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div onClick={()=>setMethod('esewa')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='esewa'?'bg-green-400' : ''}`}></p>
                  <img src={esewa} className='h-5 mx-4' alt="" />
              </div>
              <div onClick={()=>setMethod('khalti')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='khalti'?'bg-green-400' : ''}`}></p>
                  <img src={khalti} className='h-8 mx-4' alt="" />
              </div>
              <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-green-400' : ''}`}></p>
                  <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
              </div>
            </div>

          <div className='w-full text-end mt-8'> 
            <button type='submit'className='bg-black text-white px-16 py-3 text-sm cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
