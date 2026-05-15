import React, { memo, useCallback, useEffect, useState } from 'react'
import {shallowEqual, useDispatch, useSelector} from "react-redux"
import {Link, useNavigate} from "react-router-dom"
import { login } from '../../store/slices/auth.slice';
const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading , user} = useSelector((state) => ({
   loading: state.auth.loading,
   user: state.auth.user,
  }),
shallowEqual)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback((e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

  }, [dispatch])

  const handleSubmit = useCallback(async(e) => {
    e.preventDefault()

    try {

     await dispatch(login(formData)).unwrap();
      
    } catch (error) {
      console.log(error);
    }
  },[dispatch, formData])

  useEffect(() => {
  
    if(!user) return;

  if (user?.role === 'seller') {
    navigate("/seller"); // or based on role
  }else{
    navigate('/user')
  }
}, [user, navigate]);

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

        {/* EMAIL */}
          <div className='space-y-2'>
            <label className='label'>Email <sup>*</sup></label>
            
            <input 
            type="email"
            name='eamil'
            className='input-black'
            placeholder='Enter your email'
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
             autoComplete='current-password'
             required
            />
          </div>

        <div className='space-y-1'>

          {/*  LOGIN BUTTON */}
          <div className=' '>
            <button
            type='submit'
            className='btn'
            disabled={
              loading ||
              !formData.email.trim() || 
              !formData.password.trim()
            }
            >
              {
              loading 
              ? "Logging in..." 
              : "Login"
              }
            </button>
          </div>

         {/* TERMS */}
          <div className='text-xs space-x-1 flex items-center '>
            <input type="checkbox" required  />
            <span >
              By loggin in, you agree to our {" "}
               <Link
                to={'/terms_conditions'}
                >
                  Terms & Conditions
              </Link>

                {" "}   and {" "}

              <Link
               to={'/privacy_policy'}
              >
              Privacy Policy
              </Link>
              </span>
          </div>

        </div>

      </form>

      {/* REGSITER*/}
      <div className='text-sm space-x-1 '>
        <span>Create a new account?</span> 
        <Link to={"/register"} className='underline text-blue-500'> Click here </Link>
      </div>

      </div>
    </div>
  )
}

export default memo(Login) ;