import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../store/slices/auth.slice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    user
  } = useSelector((state) => ({
    loading: state.auth.loading,
    user: state.auth.user,
  }))

  const [formData, setFormData] = useState({
    username: '',
    email: "",
    password: "",
    displayName: '',
    role: ""
  });

  const handleChange = useCallback((e) => {
     
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  },[])

  const handleSubmit = useCallback(async(e) => {
    e.preventDefault()

    try {

     await dispatch(register(formData)).unwrap();

    } catch (error) {
      console.log(error);
    }
    //  navigate('/')
  },[dispatch])

  useEffect(()=> {
    if(!user) return;

    if(user?.role === 'seller'){
      navigate('/seller')
    }else{
      navigate('/user')
    }
  },[navigate, user])

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

          {/* USERNAME */}
          <div className='space-y-2'>
            <label className='label'>Username <sup>*</sup></label>
            <input 
            type="text"
            name='username'
            className='input-black'
            placeholder='...'
            value={formData.username}
            onChange={handleChange}
            autoComplete='username'
            required
            />
          </div>

          {/* DISPLAYNAME */}
           <div className='space-y-2'>
            <label className='label'>Display name <sup>*</sup>
             </label>
            <input 
            type="text"
            name='displayName'
            className='input-black'
            placeholder='...'
            value={formData.displayName}
            onChange={handleChange}
            autoComplete='name'
            required
            />
          </div>

          {/* ROLE */}
           <div className='space-y-2'>
           <label className='label'>Role <sup>*</sup></label>
            <select
            className='input text-sm'
            name='role'
            value={formData.role}
            onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className='space-y-2'>
            <label className='label'>Email <sup>*</sup></label>
            <input 
            type="email"
            name='email'
            className='input-black'
            placeholder='...'
            value={formData.email}
            onChange={handleChange}
            autoComplete='email'
            required
            />
          </div>

          {/* PASSWORD */}
          <div className='space-y-2'>
            <label className='label' >Password <sup>*</sup></label>
            <input
             type="password"
             name='password'
             className='input-black'
             placeholder='...'
             value={formData.password}
             onChange={handleChange}
             autoComplete='new-password'
             required
            />
          </div>

        <div className='space-y-1'>

          {/* BUTTON */}
          <div className=' '>
            <button
            type='submit'
            className='btn'
            disabled={
              loading ||
              !formData.username.trim() ||
              !formData.displayName.trim() ||
              !formData.email.trim() ||
              !formData.password.trim() || 
              !formData.role
            }
            >
              {
               loading
                  ? "Registering..." 
                  : "Register"
              }
            </button>
          </div>

         {/* TERMS */}
          <div className='text-xs space-x-1 flex items-center '>
            <input type="checkbox" required />
            <span >
            By loggin in, you agree to our {" "}
            <Link 
            to={'/terms_conditions'}
            >
              Terms & Conditions
           </Link>

            {' '} and {' '}
             <Link to={'/privacy_policy'}>
             Privacy Policy
             </Link>

             </span>
          </div>

        </div>

      </form>

      {/* LOGIN */}
      <div className='text-sm space-x-1 '>
        <span>Alread have an account?</span> 
        <Link to={"/login"} className='underline text-blue-500'> Click here </Link>
      </div>

      </div>
    </div>
  )
}

export default memo(Register) ;
