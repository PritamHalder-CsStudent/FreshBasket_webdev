import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.main_banner_bg} alt="" className='w-full hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="" className='w-full  md:hidden' />
      < div className='absolute inset-0 flex flex-col items-center md:items-start justify-center
            px-4 md:pl-20 lg:pl-24 pt-10 md:pt-20'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left
  max-w-[18rem] md:max-w-[22rem] lg:max-w-[28rem] leading-tight lg:leading-[3.5rem]'>Fresh from the Farm to Your Doorstep...</h1>
      
      <div className='flex items-center mt-6 font-medium'>
          <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-green-500 hover:bg-green-600 transition rounded text-white cursor-pointer'>
          Shop Now
          <img className='md: hidden transition group-focus:translate-x-1 ' src={assets.white_arrow_icon} alt="arrow" />
          </Link>

          <Link to={"/products"} className='group hidden md:flex item-center gap-2 px-9 py-3 cursor-pointer'>
          Explore deals
          <img className='transition group-hover:translate-x-1 ' src={assets.black_arrow_icon} alt="arrow" />
          </Link>  
      </div>
     </div>  

    </div>

    

  )
}

export default MainBanner

