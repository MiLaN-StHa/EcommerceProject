import React from 'react'
import logo from '../assets/oglogo2.png'
import { Link } from 'react-router-dom'
const Navbar = ({setToken}) => {
  return (
    <div className=' flex items-center py-2 px-[4%] justify-between'>
      <Link to='/'><img className='h-[90px] w-[max(8%,80px)]' src={logo} alt="" /></Link>
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
