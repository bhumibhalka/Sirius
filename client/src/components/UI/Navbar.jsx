import React from 'react'
import { MenuIcon, Search, ShoppingBag, ShoppingCart} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMenu } from '../../store/slices/popup.slice';
import Menu from './Menu';

const Navbar = () => {

  const dispatch = useDispatch();
  const {isMenuOpen} = useSelector(state => state.popup);

  return (
    <div className='flex items-center justify-center mx-6 md:mx-10' >

      <div className='flex items-center justify-between h-14 w-full max-w-6xl '>
      <div className='max-sm:hidden'>
          <ul className='flex justify-evenly gap-5 text-sm'>
            <li><a href="/collection">Collection</a></li>
            <li><a href="/men">Mens</a></li>
            <li><a href="/women">Women</a></li>
            <li><a href="/statement">Statement</a></li>
          </ul>
      </div>

      <div className='sm:hidden' onClick={()=> dispatch(toggleMenu())}><MenuIcon /></div>
      

      <div className='flex items-center justify-center'>
        <h3 className='tracking-widest font-bold text-lg'>LUMIÈRE</h3>
      </div>


      <div className='flex items-center gap-6'>
        <div className='flex'>
          <input type="text" />
         <Search />
        </div>
        <ShoppingBag />
      </div>

      </div>

      {/* menu */}
      {
        isMenuOpen && <Menu />
      }
    </div>
  )
}

export default Navbar