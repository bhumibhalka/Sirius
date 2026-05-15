import React, { memo, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/slices/cart.slice';

const products = [
  {
    id: '6a0094833f99c88c70b73817',
    title: 'Stripe Shirt',
    price: '$499.00',
    image: '/shop_the_look_shirt.avif',
  },
  {
    id: '6a0095023f99c88c70b7381a',
    title: 'Beige Trousers',
    price: '$999.00',
    image: '/shop_the_look_pants.avif',
  },
]

const ProductCard = memo(({ product, handleAddToCart }) => {

  return (
    <div className='group'>

      <div className='relative overflow-hidden'>

        {/* PRODUCT IMAGE */}
        <Link to={`/user/product/${product.id}`}>

          <img
            src={product.image}
            alt={product.title}
            className='w-full object-cover'
            loading='lazy'
            decoding='async'
          />

        </Link>

        {/* ADD TO CART */}
        <button
          className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-amber-800 font-semibold px-4 py-4 opacity-0 group-hover:opacity-100 transition-all duration-300 w-full'
          onClick={() => handleAddToCart(product.id)}
        >
          Add To Cart
        </button>

      </div>

      {/* PRODUCT INFO */}
      <div className='flex items-center justify-between mt-2'>

        <span className='text-xl text-amber-800 font-semibold'>
          {product.title}
        </span>

        <span className='text-xl font-bold text-amber-800'>
          {product.price}
        </span>

      </div>

    </div>
  )
})

const ShopTheLook = () => {

  const dispatch = useDispatch();

  const handleAddToCart = useCallback((id) => {
    dispatch(
      addToCart({
      productId: id ,
       quantity: 1
    })
  )
  },[dispatch])

  const memoizedProducts = useMemo(() => products, []);

  return (
    <section className='min-h-screen w-full max-w-7xl mx-auto   pb-6'>
      
      {/* HEADER */}
      <div className='flex flex-col justify-center mt-20 mb-10'>
      <h3 className='text-2xl font-semibold'>Shop the Look</h3>
      <p className='text-xs'>Shop the look from the best models</p>
      </div>

      {/* LAYOUT */}
      <div className='grid gird-cols-1 md:grid-cols-3 gap-6'>
        
        {/* MAIN IMAGE */}
        <div className='md:col-span-2'>
          <img src="/shop_the_look_main.avif" alt="" />
        </div>
      
      {/* PRODUCTS */}
      <div className='space-y-6'>

  {
            memoizedProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              />

            ))
          }
        
      </div>

      </div>


    </section>
  )
}

export default memo(ShopTheLook) ;