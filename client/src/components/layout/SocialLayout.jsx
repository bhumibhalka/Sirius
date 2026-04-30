import React from 'react'
import { Outlet } from 'react-router-dom'

const SocialLayout = () => {
  return (
    <div>

      <main>
        <Outlet />
      </main>

    </div>
  )
}

export default SocialLayout