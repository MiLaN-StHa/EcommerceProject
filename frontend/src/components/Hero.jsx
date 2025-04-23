import React from 'react'
import homeimg from '../assets/hero.jpg'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero left side */}
      <div className='w-full sm:w-[50%] flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141] px-6 sm:px-12'>
          <div className='flex items-center gap-2 mb-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base tracking-wider'>NAOMI COLLECTION</p>
          </div>
          <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed font-light italic'>
            She Shines, Always
          </h1>
          <p className='text-sm md:text-base text-gray-600 mt-2 max-w-sm'>
            Discover handcrafted elegance designed to reflect your story. Wear beauty, wear Naomi.
          </p>
          <div className='flex items-center gap-2 mt-4'>
            <p className='font-semibold text-sm md:text-base underline underline-offset-4'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Hero right */}
      <img className='w-full sm:w-[50%] object-cover' src={homeimg} alt="Jewelry from Naomi Collection" />
    </div>
  )
}

export default Hero
