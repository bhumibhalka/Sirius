import { LucideShoppingCart, Search, ShoppingBag, ShoppingCart, ShoppingCartIcon, Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  fetchProducts, filterProducts } from '../../../store/slices/product.slice';
import { addToCart } from '../../../store/slices/cart.slice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Products = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {products} = useSelector(state => state.product)
  console.log(products);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category')

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategory, setfilteredCategory] = useState(category || 'all');
  // const [selectedVariants, setSelectedVariants] = useState({});
  // const [loadingMap, setLoadingMap] = useState({})

  // const filteredProducts = products?.filter((product)=> {
  //   const matchesSearch = 
  //   (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())

  //   return matchesSearch;
  // })

  // const product = filteredProducts.category = category || filteredProducts


  //  const filteredProducts = () => {
  //   filteredProducts({search: searchQuery, category: filteredCategory , cursor: null })
  //  }
  
  const handleAddToCart = async(product) => {
   dispatch(addToCart({productId: product._id, quantity: 1}))
  }

  useEffect(()=> {
    if(user?.role === 'user'){
      dispatch(filterProducts({
        search: searchQuery, 
        category: filteredCategory === 'all' ? ''  : filteredCategory, 
        cursor: null  
      }))
    }
  },[searchQuery, filteredCategory, dispatch,  user?.role])

  return (
    <div className='bg-black text-white min-h-screen overflow-x-auto p-4 space-y-4 '>
    
    {/* Headers */}
    <div className='text-center mb-4'>
      <h3 className='text-2xl font-semibold mb-1'>Products</h3>
        <p className='text-sm'>All the products are selled by our trusted high end luxury brands</p>
    </div>

    {/* Filters */}
    <div className='flex flex-col md:flex-row gap-3 w-full max-w-240 mx-auto'>

      {/* <div> */}
        {/* <label className='text-lg font-semibold'>Search</label> */}
      <div className='relative md:flex-1 '>
        <Search className='absolute left-2 top-1.5 size-5 text-slate-500' />
        <input 
        type="text"
        className='w-full border focus:outline-none px-2 py-1  bg-slate-800 rounded-full pl-8  '
        placeholder=''
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
        />
      </div>
      {/* </div> */}

      <select 
      className='border rounded focus:outline-none px-2 py-1 md:w-26'
      value={filteredCategory}
      onChange={(e)=>{
        const value = e.target.value
         setfilteredCategory(value)
         
         navigate(
          value === 'all'
          ? '/user/products'
          :`/user/products?category=${value}`
         )
      }}
      >
        <option value="all">All</option>
        <option value="Limited Edition">Limited Edition</option>
        <option value="Essentials">Essentials</option>
        <option value="Accessories">Accessories</option>
        <option value="Bags">Bags</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Shoes">Shoes</option>
        <option value="Bespoke">Bespoke</option>
        <option value="Statement">Statement</option>
      </select>
    </div>

    {/* products */}

    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-6'>

    {
      products && products.length > 0 
      ? (
        products.map((product) => (
          <div
          key={product._id}
          className='border-white border p-2 rounded-lg hover:scale-103 transition-all duration-300'
          >

            <div className='space-y-2'>
              {/* image */}
            <div className='bg-white rounded-lg hover:scale-103 transition-all duration-300' 
            onClick={() => navigate(`/user/product/${product._id}`)}
            >
              <img src={product?.media?.[0]?.url} alt="img" className='h-[60vh] w-full object-contain '/>
            </div>

            {/* price and title */}
            <div className='flex items-center justify-between mx-'>
              <h3 className='text-lg font-semibold'>{product?.title}</h3>
              <h3 className='text-lg font-bold'>${product?.variants?.[0]?.price}</h3>
            </div>

            {/* stars */}
            <div className='flex'>
             { [1,2,3,4,5].map((i) => (
                <div key={i} className=' '>
                   <Star className={` size-sm ${ i <= product.metrics.averageRating ? "fill-yellow-500 text-yellow-500" :""}`} />
                </div>
              ))}
            </div>

              {/* button */}
            <button 
            className='flex items-center justify-center w-full bg-white text-black py-2 rounded font-semibold gap-1 hover:cursor-pointer hover:scale-102 transition-all duration-300 '
            onClick={() => handleAddToCart(product)} 
            >
              <LucideShoppingCart />
              <p>Add to Cart</p>
            </button>
            
          </div>
          </div>
        ))
      ) 
      : (<div>
        <p>No products found!!!</p>
      </div>)
    }

    </div>

    </div>
  )
}

export default Products