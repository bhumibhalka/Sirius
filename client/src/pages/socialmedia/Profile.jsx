import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Profile = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  console.log(user);

  return (
    <div className='bg-black min-h-screen p-6'>
     
     <div>
      <div>
        {/* <img src={user?.} alt="" /> */}
      </div>
      <div></div>
     </div>

    </div>
  )
}

export default Profile