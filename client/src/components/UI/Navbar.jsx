import React, { lazy, memo, Suspense, useCallback } from 'react'
import { LogOut, MenuIcon, Search, ShoppingBag} from 'lucide-react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { toggleMenu } from '../../store/slices/popup.slice';
import { logout } from '../../store/slices/auth.slice';
import { Link, useNavigate } from 'react-router-dom';

const Menu = lazy(() => import('./Menu'))

const navLinks = [
  {
    title: 'Collection',
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
    path: '/social',
  },
]


const Navbar = () => {

  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const {isMenuOpen, loading} = useSelector((state) => ({
    isMenuOpen: state.popup.isMenuOpen,
    loading: state.user.loading
  })
  , shallowEqual
)

  const handleLogout  = useCallback(() => {
    try {
      dispatch(logout())
       
      naviagte('/login')
    } catch (error) {
       console.log(error);
    }
  },[dispatch, naviagte])
  
  const openMenu = useCallback(() => {
    dispatch(toggleMenu())
  },[dispatch])
 
  return (
    <header className='flex  relative z-50 items-center justify-center mx-6 md:mx-10 ' >

      <div className='flex items-center justify-between h-14 w-full max-w-6xl '>
      <div className='max-sm:hidden'>
          <ul className='flex justify-evenly gap-5 text-sm'>
            {
              navLinks.map((item => (
                <li
                key={item.title}
                >
                  <Link to={item.path}>
                  {item.title}
                  </Link>
                </li>
              )))
            }
          </ul>
      </div>

          {/* MOBILE MENU */}
      <button 
      className='sm:hidden' 
      onClick={openMenu}
      aria-label='Open Menu'
      >

        <MenuIcon />

      </button>
      

            {/* LOGO */}
      <Link
      to={'/'}
      className='flex items-center justify-center' 
      >

        <h3 className='tracking-widest font-bold text-lg'>LUMIÈRE</h3>

      </Link>

        {/* ACTIONS */}
      <div className='flex items-center gap-6'>
        {/* SEARCH */}
        {/* <div className='flex'>
          <input type="text" />
         <Search />
        </div> */}

            {/* CART */}
            <Link to={'/user/cart'}
            aria-label='Open Cart'
            >

        <ShoppingBag />

            </Link>


            {/* LOGOUT */}
          <button className='sm:block hidden'
          onClick={handleLogout}
          disabled={loading}
          aria-label='Logout'
          >

            <LogOut />

          </button>

        </div>

      </div>

      {/* menu */}
      <Suspense fallback={null}>
      {
        isMenuOpen && <Menu />
      }
      </Suspense>
    </header>
  )
}

export default memo(Navbar) ;