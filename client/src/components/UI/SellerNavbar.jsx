import {  MenuIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleMenu } from '../../store/slices/popup.slice'
import Menu from './Menu'

const SellerNavbar = () => {

  const dispatch = useDispatch()
  const {isMenuOpen} = useSelector(state => state.popup)

  const openMenu = () => {
    dispatch(toggleMenu())
  }

  return (
    <>
    <header  className=' bg-black/60 inset-0 backdrop-blur-sm z-50 fixed shadow-2xs h-14 text-white block'  >
      <nav className='flex items-center justify-between max-w-4xl mx-auto px-10  h-14'>
 
         <div className='w-full tracking-widest text-lg font-bold'>
          {/* <img src="" alt="" /> */}
          LUMIÈRE
          </div>       

          <ul className='flex items-center justify-evenly w-full max-sm:hidden '>
          <li><Link>Products</Link></li>
          <li><Link>Products</Link></li>
          <li><Link>Products</Link></li>
        </ul>

        <div className='sm:hidden block'
        onClick={openMenu}
        >
          <MenuIcon />
        </div>

      </nav>

    </header>
      {isMenuOpen && <Menu />}
      </>
  )
}

export default SellerNavbar

//manage products
//manage order
//social media profile