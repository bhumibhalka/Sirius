import {  MenuIcon } from 'lucide-react'
import React, { memo, useCallback } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleMenu } from '../../store/slices/popup.slice'
import Menu from './Menu'

const navLinks = [
  {
    name: "Manage Products",
    path: "/seller/manage-products"
  },
  {
    name: "Manage Orders",
    path: "/seller/manage-orders",
  },
  {
    name: "Social Media",
    path: "/social",
  },
]

const SellerNavbar = () => {

  const dispatch = useDispatch()
  const {isMenuOpen} = useSelector((state) => ({
    isMenuOpen: state.popup.isMenuOpen,
  }),
shallowEqual
)

  const openMenu = useCallback(() => {
    dispatch(toggleMenu())
  },[dispatch])

  return (
    <>
    <header  className=' bg-black/60 inset-0 backdrop-blur-sm z-50 fixed shadow-2xs h-14 text-white block'  >
      <nav className='flex items-center justify-between max-w-6xl mx-auto px-10  h-14'>
 
         <div className='w-full tracking-widest text-lg font-bold '
         
         >
          {/* <img src="" alt="" /> */}
          LUMIÈRE
          </div>       

          <ul className='flex items-center justify-evenly w-full max-sm:hidden text-sm  '>

        {
          navLinks.map((link) => (
            <li
            key={link.name}
            className='hover:scale-105 transition-all duration-300 '
            >
              <Link to={link.path}>
              {link.name}
              </Link>
            </li>
          ))
        }

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

export default memo(SellerNavbar)

//manage products
//manage order
//social media profile