import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr] gap-14 my-10 mt-40 text-sm'> 
            <div>
            <p className='text-xl font-medium mb-5'>NAOMI COLLECTION</p>
                <p className='w-full md:w-[65%] text-gray-600'>
                Naomi Collection is dedicated to crafting elegant, handmade accessories and fine silver jewelry that blend traditional craftsmanship with modern designs. Each piece is carefully created to reflect individuality, timeless beauty, and expert artistry, offering our customers unique, high-quality products that elevate their style.
                </p>
            </div>
            
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+977-9832983434</li>
                    <li>contact@naomicollection.com</li>
                </ul>
            </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@naomicollection.com - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
