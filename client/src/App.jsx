import React, { memo, Suspense, useEffect } from 'react'
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
import { getUser } from './store/slices/auth.slice'
import Products from './pages/e-commerce/user/Products'
import Cart from './pages/e-commerce/user/Cart'
import Product from './pages/e-commerce/user/Product'
import SocialLayout from './components/layout/SocialLayout'
import Home from './pages/socialmedia/Home'
import Profile from './pages/socialmedia/Profile'
import Posts from './pages/socialmedia/Posts'
import PaymentSuccess from './pages/e-commerce/user/PaymentSuccess'
import Checkout from './pages/e-commerce/user/Checkout'
import ManageOrders from './pages/e-commerce/seller/ManageOrders'
import Settings from './components/UI/Settings'
import UserManagement from './pages/admin/UserManagement'
import OrdersManagement from './pages/admin/OrdersManagement'
import ProductManagement from './pages/admin/ProductManagement'
import AdminLayout from './components/layout/AdminLayout'
import { Loader } from 'lucide-react'
import Reels from './pages/socialmedia/Reels'
import Notification from './pages/Notification'



const PageLoader = () => (
  <div className='flex flex-col items-center justify-center h-screen'>
      
      <Loader className='animate-spin' size={28} />
    <p className='font-semibold'>Loading...</p>  
      
      </div>
)

const ROLE_HOME = {
  admin:  '/admin',
  seller: '/seller',
  user:   '/user',
}

const getHomeRoute = (role) => ROLE_HOME[role] ?? '/'

const ProtectedRoute = memo(({children, allowedRoles, user}) => {
  if(!user){
    return <Navigate to={'/login'} replace /> 
  }

  if(allowedRoles?.length && user?.role && !allowedRoles.includes(user.role)){
    return <Navigate 
    to={getHomeRoute(user.role)}
    replace
    />
  }

  return children
})
ProtectedRoute.displayName = 'ProtectedRoute'

const App = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const loading= useSelector(state => state.auth.loading);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.user?.role)
  
  

    
      // Fetch session on mount
  useEffect(()=> {
    dispatch(getUser())
  },[dispatch])

  // Fetch seller products once role is confirme
    useEffect(()=>{
      if(userRole === 'seller'){
        dispatch(fetchUserProducts())
      }
    },[userRole, dispatch])
    
    if (loading) return <PageLoader /> ;
    
  return (

    <Suspense fallback={<PageLoader />} >

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
        <ProtectedRoute allowedRoles={["admin"]} user={user}>
            <AdminLayout />
        </ProtectedRoute>
      }
      >
        <Route index element={<AdminDashboard />}/>
        <Route path='user-management' element={<UserManagement />} />
        <Route path='order-management' element={<OrdersManagement />} />
        <Route path='product-management' element={<ProductManagement />} />
      </Route>

        {/* user e-commerce */}
      <Route 
      path="/user"
      element={
        <ProtectedRoute allowedRoles={["user"]} user={user} >
          <EcommerceLayout />
        </ProtectedRoute>
      }
      >
      <Route index element={<HomePage />} />
      <Route path='products' element={<Products />} />
      <Route path='product/:id' element={<Product />} />
      <Route path='cart' element={<Cart/>} />
      <Route path='checkout' element={<Checkout />} />
      </Route>


      {/* seller */}
      <Route
      path='/seller'
      element={
        <ProtectedRoute allowedRoles={["seller"]} user={user}>
           <EcommerceLayout />
        </ProtectedRoute>
      }
      >
        <Route index element={<SellerDashboard />} />
        <Route path='manage-products' element={<ManageProducts />}/>
        <Route path='manage-orders' element={<ManageOrders />} />
      </Route>
    

     <Route
     path='/social'
     element={<SocialLayout />}
     >
     <Route index element={<Home />} />
     <Route path='profile/:username' element={<Profile />} />
     <Route path='posts' element={<Posts />} />
     <Route path='reels' element={<Reels />} />
     </Route>

  {/* <Route path='/user' element={<HomePage />} /> */}
   
      <Route path='/notifications' element={<Notification />} />
      <Route path='/settings' element={<Settings />} />      
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='*' element={ <PageNotFound />} />
    </Routes>
   </Suspense>
  )
}

export default App