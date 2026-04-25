import React from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import HomePage from './pages/e-commerce/HomePage'

const App = () => {

  const navigate = useNavigate()

  return (
    <Routes >
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App