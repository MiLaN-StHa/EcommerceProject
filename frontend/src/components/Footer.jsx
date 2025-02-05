import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'> 
            <div>
                <img src={logo} className='mb-5 w-28 h-[110px] ' alt="" />
                <p className='w-full md:w-[65%] text-gray-600'>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias quidem quia accusantium ipsum harum maxime veritatis, magni debitis deserunt eaque adipisci eligendi omnis exercitationem beatae repudiandae odio quasi obcaecati veniam.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+977-9832983434</li>
                    <li>contact@naomicollection.com</li>
                </ul>
            </div>
      </div>
    </div>
  )
}

export default Footer
