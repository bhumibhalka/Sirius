import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems } from '../../../store/slices/cart.slice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cartItems, loading} = useSelector(state => state.cart)
  const {user} = useSelector(state => state.auth)
  console.log(cartItems);


  const totalPrice = useMemo(()=> {
   return cartItems?.items?.reduce((acc, item) =>  acc + item?.productId?.variants?.[0]?.price * item?.quantity , 0)
  }, [cartItems]) 

   useEffect(()=> {
  dispatch(getCartItems())
  },[])

  // stable navigation callback
  const naviagteToProduct = useCallback((productId) => {
    navigate(`/user/product/${productId}`)
  }, [navigate])

  const handleCheckout = useCallback(()=> {
   navigate(`/user/checkout`)
  },[navigate])

  if(loading) { 
    return ( 
      <div className='bg-black min-h-screen text-white p-6'>
        <p>Loading cart...</p>
      </div>
    )
  }



  return (
    <div className='bg-black min-h-screen text-white p-4 md:px-8 space-y-6'>

      {/* Header */}
      <div className='max-sm:text-center'>
      <h3 className='text-2xl font-semibold capitalize'>{user?.username}'s Cart</h3>  
      <p className='text-sm'>Be a part of something great with great choice's</p>
      </div> 

      {/* CART ITEMS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          cartItems && cartItems?.items?.length > 0
           ? (
            cartItems.items.map((item) => (
              <div 
              key={item._id}
              className=' p-6 rounded-lg shadow bg-white text-black relative hover:cursor-pointer'
              onClick={() => naviagteToProduct()}
              >
               {/* {
                loading ? (<div>Loading...</div>) : (
                  <div>

                  </div>
                )
              } */}


                 <div className='flex gap-3'>
                {/* img */}
                <div>
                  <img src={item?.productId?.media?.[0]?.url} alt="img" className='h-12 w-10 rounded object-contain'/>
                </div>

                <div >
                  <h3 className='font-semibold'>{item?.productId?.title}</h3>
                  <p className='text-xs'>{item?.productId?.description?.slice(0,50) || "No description" }</p>
                </div>
                </div>

                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-black text-xs border px-1 rounded border-slate-400 '> quantity: <strong>{item?.quantity}</strong></p>

                  <p className='text-sm font-semibold'>${item?.productId?.variants?.[0]?.price}</p>
                </div>

                <p className={`absolute text-xs top-6 right-3 ${item?.productId?.variants?.[0]?.stock > 0 ? "bg-green-200 text-green-500" : "bg-red-200 text-red-500" } rounded-full px-1.5`}>
                  {item?.productId?.variants?.[0]?.stock > 0 ? "In stock" : "out of stock"}
                </p>
              </div>
            ))
           ) 
          : (<div>
            <p>No items in the cart yet.</p>
          </div>)
        }
      </div>
       
       <hr />

       <div className='card text-black space-y-1 '>
        {/* Items total */}
        <div className='flex items-center justify-between'>
          <span>Items Total:</span>
          <span>{totalPrice}</span>
        </div>

          {/* Shipping fees */}
        <div className='flex items-center justify-between'>
          <span>Shipping fees:</span>
          <span >$29</span>
        </div>

        <hr />

        {/* total price */}
        <div className='flex items-center justify-between'>
        <span>Total Price:</span>
        <span className='font-semibold'>${totalPrice + 29}</span>
        </div>


       </div>

        {/* checkout */}
       <div>
        <button
         className='btn'
         onClick={handleCheckout}
        >
          Place Order
        </button>
       </div>

    </div>
  )
}

export default Cart

