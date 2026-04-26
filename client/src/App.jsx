import React from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import HomePage from './pages/e-commerce/HomePage'
import { useSelector } from 'react-redux'
import PageNotFound from './pages/PageNotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import EcommerceLayout from './components/layout/EcommerceLayout'

const ProtectedRoutes = ({children, allowedRoles}) => {
   const {user, isAuthenticated} = useSelector(state => state.auth)

   const getHomeRoute = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "seller":
      return "/seller";
    case "user":
      return "/";
    default:
      return "/";
  }
};


   if(!isAuthenticated){
      return <Navigate to={"/login"} replace/>
   }

   if(allowedRoles && !allowedRoles.includes(user?.role)){
    return <Navigate to={"/authorized"} replace />
   }
   
  if (isAuthenticated && user) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }
   
   return children
}

const App = () => {

  const navigate = useNavigate()

  return (
    <Routes >
      <Route path='/' element={<Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* addmin */}
      <Route
      to="/admin"
      element={
        <ProtectedRoutes allowedRoles={["admin"]}>
            <AdminDashboard />
        </ProtectedRoutes>
      }
      >
        <Route index element={<AdminDashboard />}/>
      </Route>

        {/* user */}
      <Route 
      to="/user"
      element={
        <ProtectedRoutes allowedRoles={["user"]} >
          <EcommerceLayout />
        </ProtectedRoutes>
      }
      >
      <Route index element={<HomePage />} />
      </Route>

  <Route path='/user' element={<HomePage />} />


      <Route path='*' element={ <PageNotFound />} />
    </Routes>
  )
}

export default App