import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getProduct } from '../../../store/slices/product.slice';
import { addToCart } from '../../../store/slices/cart.slice';
import { Loader } from 'lucide-react';

 // static data memoized
   const TRUST_STATS  = [
    {
      title: 'Trusted Luxury Brands',
      description:
        'We partner only with globally recognized luxury brands, ensuring every product meets the highest standards of authenticity and excellence.',
    },
    {
      title: 'Finest Materials',
      description:
        'Each product is crafted using premium-quality materials, carefully selected for durability, comfort, and a refined finish.',
    },
    {
      title: 'Expert Craftsmanship',
      description:
        'Designed and perfected by skilled artisans, every piece reflects precision, attention to detail, and timeless craftsmanship.',
    },
  ]

  const TrustCard = memo(({title, description}) => {
    return (
      <div className='card mx-8 text-center'>
         <h3 className='text-2xl font-semibold mb-3'>{title}</h3>
         <p className=''>{description}</p>
       </div>
    )
  })
  TrustCard.displayName = 'TrustCard';

const Product = () => {

  const dispatch = useDispatch();
  const {id} = useParams();
  
  const product = useSelector(state => state.product.product); 
  const loading = useSelector(state => state.product.loading);

  useEffect(()=> {
    if(id) {
      dispatch(getProduct(id));
    }
  },[id, dispatch])

  const handleAddToCart = useCallback(() => {
    if (!product?._id) return
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
  }, [dispatch, product?._id]) // depend only on the id, not the whole product object

  
  if(loading || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader className='animate-spin' />
        <p>Loading product...</p>
      </div>
    )
  }


  // Read values directly in JSX – no useMemo needed for simple property access
  // memoized product values
  const productImage  = product?.media?.[0]?.url || ''

  const productPrice = product?.variants?.[0]?.price ?? 0

  console.log(product);
  return (
    <div className='mt-5 md:mt-10 space-y-4 '>
      <div className='flex mx-8 md:mx-12 max-sm:flex-col-reverse'>
        <div className='flex-1 p-4 '>
        {/* text content */}
        <div className=' space-y-4 '>
          <div>
          <p className='text-sm'>{product?.category}</p>
          <h2 className='text-2xl font-semibold'>{product?.title}</h2>
          </div>

          <p>{product?.description}</p>
          <h2 className='text-lg font-semibold'>${productPrice}</h2>
        </div>

        <button
        className='bg-black text-white w-full py-2 rounded-lg mt-4 hover:scale-103 transition-all duration-300 font-semibold'
        onClick={ handleAddToCart}
        >
          Add To Cart
          </button>
        </div>

        {/* image */}
        <div className='bg-black flex items-center justify-center'>
          <img src={productImage} alt="product-image" className='h-[80vh] w-[60vw] object-contain ' />
        </div>
      </div>

      <div className='bg-black grid grid-cols-1 md:grid-cols-3 gap-4 py-8 '>
        {
          TRUST_STATS.map((card) => (
            <TrustCard
             key={card.title} 
            title={card.title}
            description={card.description}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Product