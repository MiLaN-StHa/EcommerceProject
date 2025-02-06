import React, { useContext, useEffect, useState } from 'react'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

const {products} = useContext(ShopContext);
const [showFilter, setShowFilter]=useState(false);
const [filterProducts,setFilterProducts]=useState([]);
const [category, setCategory]= useState([]);
const [subCategory, setSubCategory] = useState([]);


const toggleCategory =(e)=>{
  
  if (category.includes(e.target.value)) {
      setCategory(prev=>prev.filter(item=> item !==e.target.value))
  }
  else
  {
    setCategory(prev=> [...prev,e.target.value])
  }
}

const toggleSubCategory =(e)=>{
  
  if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=>prev.filter(item=> item !==e.target.value))
  }
  else
  {
    setSubCategory(prev=> [...prev,e.target.value])
  }
}


const applyFilter =()=>{
  
  let productsCopy=products.slice();

  if (category.length>0) {
    productsCopy=productsCopy.filter(item=> category.includes(item.category));
  }

  setFilterProducts(productsCopy)

}


useEffect(()=>{
  setFilterProducts(products)
},[])

useEffect(()=>{
  applyFilter();
},[category,subCategory])


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
    {/* Filter options */}
    <div className=' min-w-60'>
      <p onClick={()=>setShowFilter(!showFilter)} className=' my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
        <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
      </p>
      {/* Category filter */}
      <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
        <p className=' mb-3 text-sm font-medium'>CATEGORIES</p>
        <div className=' flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'Men'} onChange={toggleCategory}/>
            Male
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'Women'} onChange={toggleCategory}/>
            Female
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'Unisex'} onChange={toggleCategory}/>
            Unisex
          </p>
        </div>
      </div>
      {/* SubCategory Filter */}
      <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
        <p className=' mb-3 text-sm font-medium'>TYPE</p>
        <div className=' flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'necklace'} onChange={toggleSubCategory}/>
            Silver Necklace
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'ring'} onChange={toggleSubCategory}/>
            Silver Ring
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'earring'} onChange={toggleSubCategory}/>
            Earring
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'bracelet'} onChange={toggleSubCategory}/>
            Beaded Bracelet
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'pendent'} onChange={toggleSubCategory}/>
            Beaded Pendent
          </p>
          <p className=' flex gap-2'>
            <input type="checkbox" className=' w-3' value={'charm'} onChange={toggleSubCategory}/>
            Charm
          </p>
        </div>
      </div>
    </div>

    {/* Right Side */}
    <div className=' flex-1'>
      <div className='flex justify-between text-base sm:text-2xl mb-4'>
        <Title text1={'ALL'} text2={'COLLECTIONS'} />
        {/* Prodcut sort */}
        <select className=' border-2 border-gray-300 text-sm px-2'>
          <option value="relevent">Sort by: Relevent</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>
    {/* Map products */}
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
      {
        filterProducts.map((item,index)=>(
          <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
        ))
      }
      </div>
    </div>

    </div>
  )
}

export default Collection
