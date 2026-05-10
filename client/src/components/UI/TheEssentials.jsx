import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TheEssentials = () => {

  const navigate = useNavigate();

  return (
    <section className=''>
      
    <div className='w-full max-w-7xl  mt-20 mx-auto p-4'>
  
    {/* HEADER */}
     <div className='flex items-center justify-between'>
      <h3 className='text-2xl font-semibold'>THE ESSENTIALS</h3>
      <Link to={'/user/products'}>View All</Link>
     </div>

     <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-8 '>

{/* onclick open model amd on view all navigate them to essentials */}

      {/* women */}
      <div >
        <div className='flex items-center justify-center bg-white hover:scale-105 transition-all duration-300'
        onClick={()=> navigate(`/user/product/${'69f0ae291024fb46ca6486c7'}`)}
        >
        <img src="/women_essentials.webp" alt="" className='h-[466px] ' />
        </div>

        <div className='flex justify-between items-center mt-3'>
          <span className='text-blue-900 text-lg font-semibold'>Blue Suit</span>
          <span className='text-blue-900 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

        {/* men */}
      <div>
        <div className='flex items-center justify-center bg-white hover:scale-105 transition-all duration-300'
        onClick={()=> navigate(`/user/product/${'6a0095693f99c88c70b7381d'}`)}
        >
        <img src="/men_essentials.jpeg" alt="" className='h-[466px] ' />
        </div>

        <div className='flex justify-between items-center mt-3'>
          <span className='text-amber-900 text-lg font-semibold'>Blue Suit</span>
          <span className='text-amber-900 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

      {/* perfume */}
      <div>
       <div className='flex items-center justify-center bg-white hover:scale-105 transition-all duration-300'
       onClick={()=> navigate(`/user/product/${'69f1302e7e492d4ad06ab95e'}`)}
       >
        <img src="/perfume_01.webp" alt="" className='h-[466px] ' />
        </div>

        <div className='flex justify-between items-center mt-3'>
          <span className='text-amber-950 text-lg font-semibold'>Blue Suit</span>
          <span className='text-amber-950 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

      {/* boots */}
      <div>
       <div className='flex items-center justify-center bg-white hover:scale-105 transition-all duration-300'
       onClick={()=> navigate(`/user/product/${'6a0095c03f99c88c70b73820'}`)}
       >
        <img src="/prada_boots.webp" alt="" className='h-[466px] ' />
        </div>


        <div className='flex justify-between items-center mt-3'>
          <span className='text-black text-lg font-semibold'>Blue Suit</span>
          <span className='text-black text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

     </div>

    </div>

    </section>
  )
}

export default TheEssentials