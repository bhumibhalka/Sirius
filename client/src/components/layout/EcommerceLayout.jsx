import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../UI/Navbar'

const EcommerceLayout = () => {
  return (
    <div>
   
     <div>
      <Navbar />
     </div>
     
      <main>
        <Outlet />
      </main>

    </div>
  )
}

export default EcommerceLayout