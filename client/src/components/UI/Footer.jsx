import { Link } from 'react-router-dom'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border'>

   <div className='w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 mt-14 pb-6'>

      <div className='col-span-2'>
        <h2 className='font-semibold tracking-widest text-xl mb-6'>LUMIÈRE</h2>
        <p className='text-xs text-slate-600'>DEFINING THE LANDSCAPE OF MODERN LUXURY THROUGH CREATED CRAFTMANSHIP SINCE 1994.</p>
      </div>

      <div>
        <h3 className='text-sm'>BOTIQUE</h3>
        <ul className='text-sm space-y-2 text-slate-700 mt-4'>
          <li><Link to={"/user/products"}>COLLECTIONS</Link></li>
          <li><Link to={"/user/products"}>NEW ARRIVALS</Link></li>
          <li><Link to={"/user/products"}>BESPOKE</Link></li>
        </ul>
      </div>

      <div>
        <h3 className='text-sm'>HERITAGE</h3>
        <ul className='text-sm space-y-2 text-slate-700 mt-4'>
          <li>OUR STORY</li>
          <li>SUSTAINABILITY</li>
          <li>JOURNAL</li>
        </ul>
      </div>

      <div>
        <h3 className='text-sm'>SERVICE</h3>
        <ul className='text-sm space-y-2 text-slate-700 mt-4'>
          <li>CONTACT</li>
          <li>SHIPPING</li>
          <li>RETURNS</li>
        </ul>
      </div>


    {/* footer */}
       <div className='flex items-center justify-between text-xs col-span-5 '>
    <p>&copy; 2024 LUMIÈRE COLLECTIVE ALL RIGHTS RESERVED.</p>

    <div className='space-x-4'>
      <Link>PRIVACY POLICY</Link>
      <Link>TERMS OF SERVICE</Link>
    </div>
   </div>



   </div> 
    </footer>
  )
}

export default Footer