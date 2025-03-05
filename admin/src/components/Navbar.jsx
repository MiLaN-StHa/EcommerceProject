import React from 'react'
import logo from '../assets/oglogo2.png'
const Navbar = () => {
  return (
    <div className=' flex items-center py-2 px-[4%] justify-between'>
      <img className='h-[110px] w-[max(8%,80px)]' src={logo} alt="" />
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
