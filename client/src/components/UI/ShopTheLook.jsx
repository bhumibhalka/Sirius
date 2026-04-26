import React from 'react'

const ShopTheLook = () => {
  return (
    <section className='min-h-screen w-full max-w-7xl mx-auto   pb-6'>
      
      {/* head */}
      <div className='flex flex-col justify-center mt-20 mb-10'>
      <h3 className='text-2xl font-semibold'>Shop the Look</h3>
      <p className='text-xs'>Shop the look from the best models</p>
      </div>

      <div className='grid gird-cols-1 md:grid-cols-3 gap-6'>
        
        <div className='md:col-span-2'>
          <img src="/shop_the_look_main.avif" alt="" />
        </div>
      
      <div className='space-y-6'>

        <div className='group ' >

          <div className='relative '>
           <img src="/shop_the_look_shirt.avif" alt="" className='w-full'  />

                <button className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-amber-800 font-semibold px-4 py-4 opacity-0 group-hover:opacity-100 transition duration-300 w-full  '>
             ADD TO CART
           </button>
           </div>

           <div className='flex items-center justify-between mt-2' 
          //  onClick={product/:id model open}
            >
            <span className='text-xl text-amber-800 font-semibold'>Stripe Shirt</span>
            <span className='text-xl font-bold text-amber-800 '>$499.00</span>
           </div>
        </div>
       
       <div className='group'>

        <div className='relative'>
        <img src="/shop_the_look_pants.avif" alt="" className='w-full'/>

        <button className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white py-4 text-amber-800 font-semibold  px-4 opacity-0 group-hover:opacity-100 transition duration-300 w-full '>
          Add To Cart
        </button>
        </div>

         <div className='flex items-center justify-between mt-2' >
            <span className='text-xl text-amber-800 font-semibold'>Beige Trousers</span>
            <span className='text-xl font-bold text-amber-800 '>$999.00</span>
           </div>
       </div>
        
      </div>

      </div>


    </section>
  )
}

export default ShopTheLook