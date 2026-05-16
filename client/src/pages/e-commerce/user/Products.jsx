import { LucideShoppingCart, Search, ShoppingBag, ShoppingCart, ShoppingCartIcon, Star } from 'lucide-react'
import React, { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  fetchProducts, filterProducts } from '../../../store/slices/product.slice';
import { addToCart } from '../../../store/slices/cart.slice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  'all', 'Limited Edition', 'Essentials', 'Accessories',
  'Bags', 'Men', 'Women', 'Shoes', 'Bespoke', 'Statement',
]

const STAR_INDEXES = [1, 2, 3, 4, 5]

const StarRating = memo(({rating}) => (
   <div className='flex'>
             { STAR_INDEXES.map((i) => (
                <div key={i} className=' '>
                   <Star className={` size-sm ${ i <= rating ? "fill-yellow-500 text-yellow-500" :""}`} />
                </div>
              ))}
            </div>  
))
StarRating.displayName = 'StarRating';

const ProductCard = memo(({ product, onAddToCart, onNavigate }) => {
  const price = product?.variants?.[0]?.price
  const imgUrl = product?.media?.[0]?.url
  const rating = product?.metrics?.averageRating ?? 0
  return (
      <div
          key={product._id}
          className='border-white border p-2 rounded-lg hover:scale-103 transition-all duration-300'
          >

            <div className='space-y-2'>
              {/* image */}
            <div className='bg-white rounded-lg hover:scale-103 transition-all duration-300' 
            onClick={() => onNavigate(product._id)}
            >
              <img 
              src={imgUrl} 
              alt={product?.title || 'Product'}
              loading ="lazy" 
              className='h-[60vh] w-full object-contain '/>
            </div>

            {/* price and title */}
            <div className='flex items-center justify-between mx-'>
              <h3 className='text-lg font-semibold'>{product?.title || 'Product'}</h3>
              <h3 className='text-lg font-bold'>${price}</h3>
            </div>


            {/* STARS */}
           <StarRating rating={rating} />

              {/* button */}
            <button 
            className='flex items-center justify-center w-full bg-white text-black py-2 rounded font-semibold gap-1 hover:cursor-pointer hover:scale-102 transition-all duration-300 '
            onClick={() => onAddToCart(product)} 
            >
              <LucideShoppingCart />
              <p>Add to Cart</p>
            </button>
            
          </div>
          </div>
  )
})
ProductCard.displayName = 'ProductCard'

const Products = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(state => state.auth.user);
  const products = useSelector(state => state.product.products)
  console.log(products);
  console.log("user:", user);
  

  // Parse category from URL once, only when search string changes
  const categoryFromURL = useMemo(() => {
    return new URLSearchParams(location.search).get('category') || 'all'
  }, [location.search])

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategory, setfilteredCategory] = useState(categoryFromURL);

    // Sync local state if URL changes externally (e.g. browser back/forward)
  useEffect(()=> {
    setfilteredCategory(categoryFromURL)
  },[categoryFromURL])

  // DEFERRED SEARCH VALUE              

  const deferredSearch = useDeferredValue(searchQuery);

  //  MEMOIZED FILTER PAYLOAD      

  // const filterPayload = useMemo(()=>{
  //   return {
  //     search: deferredSearch,
  //     category: 
  //     filteredCategory === "all"
  //     ? ""
  //     : filteredCategory,
  //     cursor: null,
  //   }
  // },[deferredSearch, filteredCategory])

  // FETCH PRODUCTS       

    // Debounced dispatch – 400 ms after the user stops typing/filtering
  useEffect(() => {
    if(user?.role === "user") {
      const timeout = setTimeout(()=> {

       console.log("USE EFFECT RUNNING")
        dispatch(filterProducts({
        search: deferredSearch,
        category: filteredCategory === 'all' ? '' : filteredCategory,
        cursor: null,
      }))
      },400);

      return () => clearTimeout(timeout);
    }
  }, [dispatch,filteredCategory, deferredSearch, user?.role])


  // MEMOIZED HANDLERS               

  const handleAddToCart = useCallback((product)=> {
    if(!product) return;

    dispatch(addToCart({
      productId : product._id,
      quantity: 1,
    }))
  },[ dispatch])


  const handleNavigate = useCallback((id) => {
    navigate(`/user/product/${id}`)
  },[navigate])

 const handleCategoryChange = useCallback((e)=> {
  const value = e.target.value;
  setfilteredCategory(value);

  navigate(
    value === 'all'
    ? '/user/products'
    :`/user/products?category=${value}`
  )
 },[navigate])



// MEMOIZED PRODUCT GRID   
// avoids recalculating map     

   // useEffect(()=> {
  //   if(user?.role === 'user'){
  //     dispatch(filterProducts({
  //       search: searchQuery, 
  //       category: filteredCategory === 'all' ? ''  : filteredCategory, 
  //       cursor: null  
  //     }))
  //   }
  // },[searchQuery, filteredCategory, dispatch,  user?.role])

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
      {CATEGORY_OPTIONS.map((cat) => (
        <option key={cat} value={cat}>{cat === 'all' ? 'All' : cat}</option>
      ))}
      </select>
    </div>

    {/* products */}

    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-6'>

    {
      products && products.length > 0 
      ? (
        products.map((product) => (
        <ProductCard
        key={product._id}
        product={product}
        onAddToCart={handleAddToCart}
        onNavigate={handleNavigate}
        />
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