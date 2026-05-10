import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/slices/cart.slice';

const ShopTheLook = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (id) => {
    dispatch(addToCart({productId: id , quantity: 1}))
  }

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
            <div
            onClick={()=> navigate(`/user/product/${'6a0094833f99c88c70b73817'}`)}
            >
           <img src="/shop_the_look_shirt.avif" alt="" className='w-full'  />
            </div>

                <button className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-amber-800 font-semibold px-4 py-4 opacity-0 group-hover:opacity-100 transition duration-300 w-full  '
                onClick={() => handleAddToCart('6a0094833f99c88c70b73817')}
                >
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
         <div onClick={()=> navigate(`/user/product/${'6a0095023f99c88c70b7381a'}`)}>
        <img src="/shop_the_look_pants.avif" alt="" className='w-full'/>
         </div>

        <button className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white py-4 text-amber-800 font-semibold  px-4 opacity-0 group-hover:opacity-100 transition duration-300 w-full '
        onClick={() => handleAddToCart('6a0095023f99c88c70b7381a')}
        >
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