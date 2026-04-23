import React from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/register'

const App = () => {

  const navigate = useNavigate()

  return (
    <Routes >
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default App