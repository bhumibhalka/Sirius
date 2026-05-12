import React from 'react'
import { LogOut, MenuIcon, Search, ShoppingBag, ShoppingCart} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMenu } from '../../store/slices/popup.slice';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/auth.slice';

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isMenuOpen} = useSelector(state => state.popup);

  const handleLogout  = () => {
    dispatch(logout())
  }
 
  return (
    <header className='flex items-center justify-center mx-6 md:mx-10' >

      <div className='flex items-center justify-between h-14 w-full max-w-6xl '>
      <div className='max-sm:hidden'>
          <ul className='flex justify-evenly gap-5 text-sm'>
            <li onClick={()=> navigate('/user/products')}>Collection</li>
            <li onClick={()=> navigate("/user/products?category=Men")}>Mens</li>
            <li onClick={()=> navigate("/user/products?category=Women")}>Women</li>
            <li onClick={()=> navigate("/user/products?category=Statement")}>Statement</li>
            <li onClick={()=> navigate("/social")}>Social Media</li>
          </ul>
      </div>

      <div className='sm:hidden' onClick={()=> dispatch(toggleMenu())}><MenuIcon /></div>
      

      <div className='flex items-center justify-center' 
      onClick={()=> navigate('/')}
      >
        <h3 className='tracking-widest font-bold text-lg'>LUMIÈRE</h3>
      </div>


      <div className='flex items-center gap-6'>
        {/* search */}
        <div className='flex'>
          <input type="text" />
         <Search />
        </div>


        <ShoppingBag onClick={()=> navigate('/user/cart')} />

          <button className='sm:block hidden'
          onClick={()=> handleLogout()}
          >
            <LogOut />
          </button>
      </div>

      </div>

      {/* menu */}
      {
        isMenuOpen && <Menu />
      }
    </header>
  )
}

export default Navbar