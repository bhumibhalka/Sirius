import React from 'react'
import { useNavigate } from 'react-router-dom'

const Reels = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col h-screen items-center justify-center gap-2 text-center '>
    <h3 className='text-2xl font-semibold'>Page is not availabile <br /> it is still in development!!! </h3>
    <button className='btn-blue' onClick={()=> navigate(-1)}> Back </button>
    </div>
  )
}

export default Reels