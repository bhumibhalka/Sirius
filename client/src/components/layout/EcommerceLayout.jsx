import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../UI/Navbar'
import { useSelector } from 'react-redux'
import SellerNavbar from '../UI/SellerNavbar'

const EcommerceLayout = () => {


  const {user} = useSelector(state => state.auth)
  return (
    <div>
   

     { user?.role === "user" && 
      <div>
      <Navbar />
     </div>
     }
     
     {user?.role === "seller" && (
      <div className='mb-14'>
      <SellerNavbar />
      </div>
     )}
     
      <main>
        <Outlet />
      </main>

    </div>
  )
}

export default EcommerceLayout