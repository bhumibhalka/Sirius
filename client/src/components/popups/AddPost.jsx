import { Upload, X } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleUploadPost } from '../../store/slices/popup.slice';
import { useState } from 'react';
import { createPost } from '../../store/slices/social-media/post.slice';

const AddPost = () => {

  const dispatch = useDispatch();
  const {isUploadPostModalOpen} = useSelector(state => state.popup)

  const  [caption, setCaption] = useState('')
  const [media, setMedia] = useState([])
  const {posts, loading} = useSelector(state => state.post);

  const closeModal = () => {
   dispatch(toggleUploadPost())
  }

  const handleMedia = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  }

  const handleSubmit = (e) => {
   e.preventDefault();
   const data = new FormData();
   data.append('caption',caption);
   
   media.forEach((file) => {
    data.append('media', file)
   })

   dispatch(createPost(data)).then(()=>{
    setCaption('');
    setMedia([]);
    dispatch(toggleUploadPost());
   })
  }


  return (
    <div className='bg-white/50 fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center'>

    <div className='black-card max-w-md w-full space-y-4'>
     {/* HEADER */}
     <div className='flex justify-between'>
      {/* text-content */}
      <div>
      <h3 className='text-2xl font-semibold'>Add Post</h3>
       <p className='text-sm'>Upload new post share your life with everyone</p>
       </div>

        {/* btn */}
        <X  className='hover:scale-105 transition-all duration-300 shadow hover:shadow-white' onClick={closeModal}/>
     </div>

     <hr />

    {/* form */}
    <form className='space-y-4' onSubmit={handleSubmit}>

      {/* image */}
       <div className='w-full border border-dashed flex items-center justify-center py-12 rounded'>
        <label htmlFor="post" className='flex flex-col items-center'>
          <Upload />
         <p>Upload</p>  
          <input
           type="file"
           className='hidden'
           id='post'
           onChange={handleMedia}
           accept='image/*,video/*'
           multiple
           required
           />
        </label>
       </div>

      {/* title */}
      <div>
        <label htmlFor="" className='text-sm'>Title<sup>*</sup></label>
        <input 
        type="text"
        className='input bg-white shadow-2xs border-slate-600 text-black'
        value={caption}
        onChange={(e) => setCaption(e.target.value)}

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
        disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
       </div>
    </form>

    </div>
    </div>
  )
}

export default AddPost