import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../store/slices/auth.slice';

const Register = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, user} = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    email: "",
    password: "",
    displayName: '',
    role: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault()
     dispatch(register(formData))
    //  navigate('/')
  }

  return (
    <div className='h-screen flex items-center justify-center bg-black/50 text-white px-8 '  >
      <div className='bg-slate-800 p-6 px-10 rounded-lg w-full max-w-lg pb-10'>
        {/* header */}
        <div className='text-center mb-4'>
          <h3 className='text-3xl font-bold mb-2'>Register</h3>
          <p className='text-xs text-slate-500'>Register to continue</p>
        </div>

        <hr />

      {/* form */}
      <form className='space-y-4 mt-4 mb-8'
      onSubmit={handleSubmit}
      >

          <div className='space-y-2'>
            <label className='label'>Username <sup>*</sup></label>
            <input 
            type="text"
            className='input-black'
            placeholder='...'
            value={formData.username}
            onChange={(e)=> setFormData({...formData, username:e.target.value})}
            required
            />
          </div>

           <div className='space-y-2'>
            <label className='label'>Display name <sup>*</sup>
             </label>
            <input 
            type="text"
            className='input-black'
            placeholder='...'
            value={formData.displayName}
            onChange={(e)=> setFormData({...formData, displayName: e.target.value})}
            required
            />
          </div>

           <div className='space-y-2'>
           <label className='label'>Role <sup>*</sup></label>
            <select
            className='input text-sm'
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>


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
              {loading ? "Registering..." : "Register"}
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
        <span>Alread have an account?</span> 
        <Link to={"/login"} className='underline text-blue-500'> Click here </Link>
      </div>

      </div>
    </div>
  )
}

export default Register