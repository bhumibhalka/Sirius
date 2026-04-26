import React from 'react'

const TheEssentials = () => {
  return (
    <section className=''>
      
    <div className='w-full max-w-7xl h-screen mt-20 mx-auto'>
  
    {/* HEADER */}
     <div className='flex items-center justify-between'>
      <h3 className='text-2xl font-semibold'>THE ESSENTIALS</h3>
      <button>View All</button>
     </div>

     <div className='grid grid-cols-1 md:grid-cols-4 gap-3  mt-8 '>

{/* onclick open model amd on view all navigate them to essentials */}
      <div>
        <img src="/women_essentials.webp" alt="" className='' />

        <div className='flex justify-between items-center mt-3'>
          <span className='text-blue-900 text-lg font-semibold'>Blue Suit</span>
          <span className='text-blue-900 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

      <div>
        <img src="/men_essentials.jpeg" alt="" className='h-[466px]' />

        <div className='flex justify-between items-center mt-3'>
          <span className='text-amber-900 text-lg font-semibold'>Blue Suit</span>
          <span className='text-amber-900 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

      <div>
        <img src="/perfume_01.webp" alt="" className='h-[466px] object-contain' />

        <div className='flex justify-between items-center mt-3'>
          <span className='text-amber-950 text-lg font-semibold'>Blue Suit</span>
          <span className='text-amber-950 text-lg font-semibold'>$1299.00</span>
        </div>
      </div>

      <div>
        <img src="/prada_boots.webp" alt="" className='h-[466px] object-contain' />

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