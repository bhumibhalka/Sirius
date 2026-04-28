import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Link, useNavigate} from "react-router-dom"
import { login } from '../../store/slices/auth.slice';
const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, user} = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault()
     dispatch(login(formData))
  }

  useEffect(() => {
  if (user) {
    navigate("/user"); // or based on role
  }
}, [user]);

  return (
    <div className='h-screen flex items-center justify-center bg-black/50 text-white px-8 '  >
      <div className='bg-slate-800 p-6 px-10 rounded-lg w-full max-w-lg pb-10'>
        {/* header */}
        <div className='text-center mb-4'>
          <h3 className='text-3xl font-bold mb-2'>Login</h3>
          <p className='text-xs'>Login to continue</p>
        </div>

        <hr />

      {/* form */}
      <form className='space-y-4 mt-4 mb-8' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <label className='label'>Email <sup>*</sup></label>
            <input 
            type="email"
            className='input-black'
            placeholder='...'
            value={formData.email}
            onChange={(e)=> setFormData({...formData, email: e.target.value})}
            required
            />
          </div>

          <div className='space-y-2'>
            <label className='label' >Password <sup>*</sup></label>
            <input
             type="password"
             className='input-black'
             placeholder='...'
             value={formData.password}
             onChange={(e)=> setFormData({...formData, password: e.target.value})}
             required
            />
          </div>

        <div className='space-y-1'>

          {/* btn */}
          <div className=' '>
            <button
            type='submit'
            className='btn'
            disabled={loading}
            // disabled={loading || !formData.email || !formData.password}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

         {/* terms and conditions */}
          <div className='text-xs space-x-1 flex items-center '>
            <input type="checkbox" required />
            <span >By loggin in, you agree to our <strong onClick={()=> navigate("/terms_conditions")}>Terms & Conditions</strong> and <strong onClick={()=> navigate("/privacy_policy")}>Privacy Policy</strong></span>
          </div>

        </div>

      </form>

      {/* Already have an account */}
      <div className='text-sm space-x-1 '>
        <span>Create a new account?</span> 
        <Link to={"/register"} className='underline text-blue-500'> Click here </Link>
      </div>

      </div>
    </div>
  )
}

export default Login