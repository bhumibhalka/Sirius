import { LogOut, X } from 'lucide-react'
import React, { memo, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toggleMenu } from '../../store/slices/popup.slice'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/auth.slice'

const userLinks = [
  {
    title: `Collection` ,
    path: '/user/products',
  },
  {
    title: 'Men',
    path: '/user/products?category=Men',
  },
  {
    title: 'Women',
    path: '/user/products?category=Women',
  },
  {
    title: 'Statement',
    path: '/user/products?category=Statement',
  },
  {
    title: 'Social Media',
    path: '/social'
  }

]

const sellerLinks = [
  {
    title: 'Manage Products ',
    path: '/seller/manage-products',
  },
  {
    title: 'Manage Orders ',
    path: '/seller/manage-orders',
  },
  {
    title: 'Manage Products ',
    path: '/seller/manage-products',
  },
  {
    title: 'Social Media ',
    path: '/social',
  },

]

const Menu = () => {

  const dispatch = useDispatch();
  const {user, loading, isMenuOpen} = useSelector((state) => ({
    user: state.auth.user,
    loading: state.auth.loading,
    isMenuOpen: state.popup.isMenuOpen,
  }),
  shallowEqual
)
   const closeMenu = useCallback(() => {
    dispatch(toggleMenu());
   },[dispatch])

   
   const handleLogout = useCallback(() => {
    dispatch(logout())
    closeMenu()
   },[dispatch, closeMenu])

   const navigationLinks = useMemo(() => {

    if(user?.role === 'seller'){
      return sellerLinks(user?.username);
    }

    return userLinks;
   },[user])

   if(!isMenuOpen) return null;


  return (
    <div 
    className={`
      ${user?.role === "user" 
        ? "bg-blue-300/50 " 
        : "bg-black/50 "
      }
         z-50 inset-0 fixed flex items-center justify-center backdrop-blur-sm  `}
    >

     <div
      className={`
      ${user?.role === "user" 
      ? "bg-blue-400/50" 
      : "bg-black/50"
     }
      p-4 w-full max-w-md rounded-lg border border-white/50 pb-10 shadow-lg`}
     >

        {/* CLOSE BUTTON */}
      <div className='flex justify-end'>
        <button
        onClick={closeMenu}
        aria-label='Close Menu'
        >

        <X className='text-white hover:scale-110 transition-all duration-300 hover:shadow-sm' />

        </button>

        </div>

   
        <ul className='flex items-center justify-center flex-col gap-2 text-white'>

          {
            navigationLinks.map((item)=> (
               <li 
               key={item.title}
               className='hover:scale-105 transition-all duration-300'
           onClick={closeMenu}>
              <Link to={item.path}
              onClick={closeMenu}
              >
              {item.title}
              </Link>
            </li>
            ))
          }
        </ul>

          {/* LOGOUT */}
         <div className=''>
          <button
          className='flex gap-2 text-center items-center justify-center w-full mt-4 text-lg font-semibold text-white hover:scale-110 transition-all duration-300'
          onClick={handleLogout}
          disabled={loading}
          >

            <LogOut />

             {loading? "Logging out..." : "Logout"}

          </button>

        </div>

     </div>
     
    </div>
  )
}

export default memo(Menu) ;