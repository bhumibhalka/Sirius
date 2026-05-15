import React, { memo } from 'react'

import { Link } from 'react-router-dom'

const essentialProducts = [
  {
    id: '69f0ae291024fb46ca6486c7',
    title: 'Blue Suit',
    price: '$1299.00',
    image: '/women_essentials.webp',
    textColor: 'text-blue-900',
  },
  {
    id: '6a0095693f99c88c70b7381d',
    title: 'Blue Suit',
    price: '$1299.00',
    image: '/men_essentials.jpeg',
    textColor: 'text-amber-900',
  },
  {
    id: '69f1302e7e492d4ad06ab95e',
    title: 'Blue Suit',
    price: '$1299.00',
    image: '/perfume_01.webp',
    textColor: 'text-amber-950',
  },
  {
    id: '6a0095c03f99c88c70b73820',
    title: 'Blue Suit',
    price: '$1299.00',
    image: '/prada_boots.webp',
    textColor: 'text-black',
  },
]

const EssentialCard = memo(({ product }) => {

  return (
    <div>

      {/* PRODUCT IMAGE */}
      <Link
        to={`/user/product/${product.id}`}
        className='block overflow-hidden bg-white'
      >

        <img
          src={product.image}
          alt={product.title}
          className='h-[466px] w-full object-cover hover:scale-105 transition-transform duration-300'
          loading='lazy'
          decoding='async'
        />

      </Link>

      {/* PRODUCT INFO */}
      <div className='flex justify-between items-center mt-3'>

        <span className={`${product.textColor} text-lg font-semibold`}>
          {product.title}
        </span>

        <span className={`${product.textColor} text-lg font-semibold`}>
          {product.price}
        </span>

      </div>

    </div>
  )
})

const TheEssentials = () => {

  return (
    <section>

      <div className='w-full max-w-7xl mt-20 mx-auto p-4'>

        {/* HEADER */}
        <div className='flex items-center justify-between'>

          <h3 className='text-2xl font-semibold'>
            THE ESSENTIALS
          </h3>

          <Link to="/user/products">
            View All
          </Link>

        </div>

        {/* PRODUCTS */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-8'>

          {
            essentialProducts.map((product) => (

              <EssentialCard
                key={product.id}
                product={product}
              />

            ))
          }

        </div>

      </div>

    </section>
  )
}

export default memo(TheEssentials)