import { X } from 'lucide-react'
import React, { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../../store/slices/social-media/profile.slice';
import { toggleEditProfileModal } from '../../store/slices/popup.slice';

const EditProfile = () => {

  const dispatch = useDispatch();
  const {
    activeProfile, 
    isUpdating, 
    isEditProfileOpen
  } = useSelector((state) =>({
    activeProfile: state.profile.activeProfile,
    isUpdating: state.profile.isUpdating,
    isEditProfileOpen: state.popup.isEditProfileOpen,
  }),
shallowEqual
);
  console.log(activeProfile);

  const initialFormData = useMemo(()=> ({
     username: activeProfile?.username || '',
    displayName: activeProfile?.displayName || '' ,
    bio: activeProfile?.bio || '',
    location: activeProfile?.location || '',
  }),[activeProfile])

  const [formData, setFormData] = useState(initialFormData);
  const [profilePic, setProfilePic] = useState(null);
  
  const defferedBio = useDeferredValue(formData.bio);
  
  useEffect(()=> {
    if(!activeProfile) return;

    setFormData({
      username: activeProfile.username || '',
      displayName: activeProfile.displayName || '',
      bio: activeProfile.bio || '',
      location: activeProfile.location || '',
    })
  }, [activeProfile])

 const closeModal = useCallback(() => {
  dispatch(toggleEditProfileModal())
 },[dispatch])

 const handleInputChange = useCallback((e)=> {

  const {name, value} = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }))
   
 },[])

 const handleSubmit = useCallback(async(e) => {
   e.preventDefault();

   const data = new FormData();
 
   Object.entries(formData).forEach(([key, value]) => {
  data.append(key, value)
   })

   if(profilePic){
     data.append("avatar", profilePic)
   }
   
   // dispatch(updateProfile(data)).then((res => {
   //   if(res.fulfillef)
   // }))
 
   try {
   const res = await dispatch(updateProfile(data));

   if(res.meta.requestStatus === "fulfilled"){

    closeModal();

    setProfilePic(null)
   }
   } catch (error) {
    console.log(error);
   }

  },[dispatch, formData, profilePic, closeModal])

  if(!isEditProfileOpen) return null;

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
      {/* HEADER */}
        <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>Edit Profile</h3>
        <X className='hover:scale-105 transition-all duration-300 hover:shadow-md ' onClick={closeModal} />
        </div>

      <hr />

      {/* form */}
      <form className='space-y-4  overflow-x-scroll' onSubmit={handleSubmit}>
        {/* USERNAME */}
        <div>
            <label className='label'>Username <sup>*</sup></label>
            <input 
            type="text"
            name='username'
            className='input text-slate-400'
            value={formData.username}
            onChange={handleInputChange}
            />
        </div>

      {/* DISPLAYNAME */}
        <div>
            <label className='label'>DisplayName <sup>*</sup></label>
            <input type="text"
            name='displayName'
            className='input text-slate-400'
            value={formData.displayName}
            onChange={handleInputChange}
            />
        </div>

        {/* LOCATION */}
        <div>
            <label className='label'>Location <sup>*</sup></label>
            <input type="text"
            name='location'
            className='input text-slate-400'
            value={formData.location}
            onChange={handleInputChange}
            />
        </div>

        {/* AVATAR */}
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

        {/* BIO */}
        <div>
          <label className='label'>Bio <sup>*</sup></label>
           <textarea 
          name='bio'
           className='border border-slate-400 w-full rounded focus:outline-none p-2'
           rows={8}
          value={formData.bio}
          onChange={handleInputChange}
           />
        </div>

        {/* BUTTON */}
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

export default memo(EditProfile) ;