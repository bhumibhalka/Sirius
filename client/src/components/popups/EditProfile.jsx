import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../../store/slices/social-media/profile.slice';
import { toggleEditProfileModal } from '../../store/slices/popup.slice';

const EditProfile = () => {

  const dispatch = useDispatch();
  const {activeProfile, isUpdating} = useSelector(state => state.profile);
  console.log(activeProfile);
  const [formData, setFormData] = useState({
    username: activeProfile?.username || '',
    displayName: activeProfile?.displayName || '' ,
    bio: activeProfile?.bio || '',
    location: activeProfile?.location || '',
  })
  const [profilePic, setProfilePic] = useState('')
  
 const closeModal = () => {
  dispatch(toggleEditProfileModal())
 }

 const handleSubmit = (e) => {
   e.preventDefault();
   const data = new FormData();
   data.append('username', formData.username);
   data.append('displayName', formData.displayName);
   data.append('bio', formData.bio);
   data.append('location', formData.location);
   data.append("avatar", profilePic)
 
   // dispatch(updateProfile(data)).then((res => {
   //   if(res.fulfillef)
   // }))
 
    dispatch(updateProfile(data)).then(res => {
      if(res.meta.requestStatus === "fulfilled"){
        dispatch(toggleEditProfileModal())
      }
    })
 
    setFormData({
     username: activeProfile?.username || '',
     displayName: activeProfile?.displayName || '' ,
     bio: activeProfile?.bio || '',
     location: activeProfile?.location || '',
    })
    setProfilePic("");
  }
//  useEffect(() => {
//   if (activeProfile) {
//     setFormData({
//       username: activeProfile.username || '',
//       displayName: activeProfile.displayName || '',
//       bio: activeProfile.bio || '',
//       location: activeProfile.location || '',
//     });
//   }
// }, [activeProfile]);

  return (
    <div 
    className='bg-black/50 inset-0 fixed backdrop-blur-sm flex items-center justify-center '
    >
      <div className='bg-white p-5 text-black rounded-lg  w-full max-w-md space-y-3'>
      {/* header */}
        <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Edit Profile</h3>
        <X className='hover:scale-105 transition-all duration-300 hover:shadow-md ' onClick={closeModal} />
        </div>

      <hr />

      {/* form */}
      <form className='space-y-4  overflow-x-scroll' onSubmit={handleSubmit}>
        {/* username */}
        <div>
            <label className='label'>Username <sup>*</sup></label>
            <input type="text"
            className='input text-slate-400'
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
        </div>

      {/* displayName */}
        <div>
            <label className='label'>DisplayName <sup>*</sup></label>
            <input type="text"
            className='input text-slate-400'
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            />
        </div>

        {/* location */}
        <div>
            <label className='label'>Location <sup>*</sup></label>
            <input type="text"
            className='input text-slate-400'
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
        </div>

        {/* avatar */}
        <div className='flex items-center justify-center border border-dashed rounded h-40 border-slate-400'>
          <label htmlFor="avatar">
            Upload Avatar
            <input
             type="file"
             className='hidden'
             onChange={(e) => setProfilePic(e.target.files[0])}
             id='avatar'
             />
          </label>
        </div>

        {/* bio */}
        <div>
          <label className='label'>Bio <sup>*</sup></label>
           <textarea 
           className='border border-slate-400 w-full rounded focus:outline-none p-2'
           rows={8}
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio:e.target.value})}
           />
        </div>

        {/* button */}
        <div className='flex items-center justify-end gap-2'>
          <button
          type='button'
          className='btn-danger'
          onClick={closeModal}
          >
            Cancel
          </button>
          <button
          type='submit'
          className='btn-black'
          disabled={isUpdating || !formData}
          >
              {
                isUpdating ? "Updating..." : "Update"
              }
          </button>
        </div>

      </form>
      </div>


    </div>
  )
}

export default EditProfile