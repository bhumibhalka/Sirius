import { X } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { toggleMenu } from '../../store/slices/popup.slice'
import { useDispatch, useSelector } from 'react-redux'

const Menu = () => {

  const dispatch = useDispatch();
   const {user} = useSelector(state => state.auth)
   const {isMenuOpen} = useSelector(state => state.popup)

   const closeMenu = () => {
    dispatch(toggleMenu());
   }

  return (
    <div className={`${user?.role === "user" ? "bg-blue-300/50 " : "bg-black/50 "}inset-0 fixed flex items-center justify-center backdrop-blur-sm  `}>
     <div className={`${user?.role === "user" ? "bg-blue-400/50" : "bg-black/50"} p-4 w-full max-w-md rounded-lg border border-white/50 pb-10 shadow-lg`}>
      <div className='flex justify-end'>
        <X className='text-white hover:scale-110 transition-all duration-300 hover:shadow-sm' onClick={()=> dispatch(toggleMenu())} />
        </div>

      {
       user?.role === "user" && (
        <div>
        <ul className='flex items-center justify-center flex-col gap-2 text-white'>

           <li className='hover:scale-105 transition-all duration-300'>
            <Link to="/user/product/collection">Collection</Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/user/product/men">
            Mens
            </Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/user/product/women">
            Women
            </Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/user/product/statement">
            Statement
            </Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/social-media">
            Social Media
            </Link>
            </li>

        </ul>
      </div>
       )
      }

      {user?.role === "seller" && (
        <div>
        <ul className='flex items-center justify-center flex-col gap-2 text-white text-lg'>

           <li className='hover:scale-105 duration-300 hover:shadow-2xl'>
            <Link to="/seller/manage-products" onClick={closeMenu}>Manage Products</Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/seller/manage-orders" onClick={closeMenu}>
            Manage Orders
            </Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/notifications" onClick={closeMenu}>
            Notifications
            </Link>
            </li>

            <li className='hover:scale-105 transition-all duration-300'>
              <Link to="/social-media/profile" onClick={closeMenu}>
            Social Profile
            </Link>
            </li>


        </ul>
      </div>
      )}
      



     </div>
    </div>
  )
}

export default Menu