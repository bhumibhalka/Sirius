import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { getProduct } from '../../../store/slices/product.slice';
import { addToCart } from '../../../store/slices/cart.slice';

const Product = () => {

  const dispatch = useDispatch();
  const {product} = useSelector(state => state.product) 
  const {id} = useParams();

  const handleAddToCart =() => {
    dispatch(addToCart({productId: product._id, quantity: 1}))
  }

  const stats = [
    {
      title: 'Trusted Luxury Brands',
      description: 'We partner only with globally recognized luxury brands, ensuring every product meets the highest standards of authenticity and excellence.',
    },
    {
      title: 'Finest Materials',
      description: 'Each product is crafted using premium-quality materials, carefully selected for durability, comfort, and a refined finish.',
    },
    {
      title: 'Expert Craftsmanship',
      description: 'Designed and perfected by skilled artisans, every piece reflects precision, attention to detail, and timeless craftsmanship.',
    },
  ]

  useEffect(()=>{
    dispatch(getProduct(id))
  },[id ,dispatch])



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
          <h2 className='text-lg font-semibold'>${product?.variants?.[0]?.price}</h2>
        </div>

        <button
        className='bg-black text-white w-full py-2 rounded-lg mt-4 hover:scale-103 transition-all duration-300 font-semibold'
        onClick={()=> handleAddToCart()}
        >
          Add To Cart
          </button>
        </div>

        {/* image */}
        <div className='bg-black'>
          <img src={product?.media?.[0]?.url} alt="product-image" className='h-[80vh] w-[60vw] object-contain ' />
        </div>
      </div>

      <div className='bg-black grid grid-cols-1 md:grid-cols-3 gap-4 py-8 '>
        {
          stats.map((card) => (
            <div className='card mx-8 text-center'>
              <h3 className='text-2xl font-semibold mb-3'>{card.title}</h3>
              <p className=''>{card.description}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Product