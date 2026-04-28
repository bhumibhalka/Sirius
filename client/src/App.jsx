import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import HomePage from './pages/e-commerce/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import PageNotFound from './pages/PageNotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import EcommerceLayout from './components/layout/EcommerceLayout'
import SellerDashboard from './pages/e-commerce/seller/SellerDashboard'
import ManageProducts from './pages/e-commerce/seller/ManageProducts'
import { fetchUserProducts } from './store/slices/product.slice'

const getHomeRoute = (role) => {
switch (role) {
 case "admin":
   return "/admin";
 case "seller":
   return "/seller";
 case "user":
   return "/user";
 default:
   return "/";
}
};

const App = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {user,loading, isAuthenticated} = useSelector(state => state.auth);
  
  
  const ProtectedRoute = ({children, allowedRoles}) => {
    if(!user) {
      return <Navigate to={'/login'} replace/>
    }
    
    if(allowedRoles?.length && 
      user?.role && 
      !allowedRoles.includes(user.role)){
        const redirectPath =
        user.role === 'admin'
        ? "/admin"
        : user.role === 'seller'
        ? "/seller"
        : '/user';
        
        
        return <Navigate to={redirectPath} replace />
      }
      return children;
    }
    
    useEffect(()=>{
      if(user?.role === 'seller'){
        dispatch(fetchUserProducts())
      }
    },[user?.role, dispatch])
    
    if (loading) return <div>Loading...</div>;
    
  return (
    <Routes >
      <Route
      path='/'
        element={
    isAuthenticated && user
      ? <Navigate to={getHomeRoute(user?.role)} replace />
      : <Navigate to="/login" replace />
  }
      />
    
    {/* <Route path='/' element={<Navigate to={'/login'} replace />} /> */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* addmin */}
      <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
      }
      >
        <Route index element={<AdminDashboard />}/>
      </Route>

        {/* user */}
      <Route 
      path="/user"
      element={
        <ProtectedRoute allowedRoles={["user"]} >
          <EcommerceLayout />
        </ProtectedRoute>
      }
      >
      <Route index element={<HomePage />} />
      </Route>


      {/* seller */}
      <Route
      path='/seller'
      element={
        <ProtectedRoute allowedRoles={["seller"]}>
           <EcommerceLayout />
        </ProtectedRoute>
      }
      >
        <Route index element={<SellerDashboard />} />
        <Route path='manage-products' element={<ManageProducts />}/>
      </Route>

  {/* <Route path='/user' element={<HomePage />} /> */}


      <Route path='*' element={ <PageNotFound />} />
    </Routes>
  )
}

export default App