import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import messenger from '../assets/messenger.jpg'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Ranibari marg <br />Lazimpath, Kathmandu</p>
          <p className='text-gray-500'>Tel: +977-9832983434 <br /> Email: naomicollection@gmail.com</p>
          <a 
            href="https://www.messenger.com/t/110048958662485" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <img 
              src={messenger} 
              alt="Messenger" 
              className="w-5 h-5"
            />
            Chat with us
          </a>
         
        </div>
       
          </div>
        </div>
    
   
  )
}

export default Contact
