import { HomeIcon, Link, MessageCircle, Plus, Search, User2Icon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleUploadPost } from '../../store/slices/popup.slice';

const EcommerceSidebar = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
    const handleToggleUpload = () => {
      dispatch(toggleUploadPost())
    }

  return (
    //  <header className='border-r text-white border-right border-slate-500 p-6 max-w-sm max-sm:w-fit w-full h-screen '>
    //   <nav className='space-y-3'>

    //     <div className='relative'>
    //       <Search className='absolute top-2 size-5 left-2 text-slate-400' />
    //       <input 
    //       type="text"
    //        className='input-rounded' 
    //        placeholder='...'
    //       />
    //     </div>


    //     <div className='font-semibold '>

    //       <div className=' hover:bg-slate-700 rounded-lg '> 
    //         <Link className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700' >
    //         <HomeIcon  size={20}/>
    //       <p className='max-sm:hidden'>Home</p> 
    //         </Link>
            
    //       </div>

    //       <div className=' hover:bg-slate-700 rounded-lg '> 
    //       <Link className='flex gap-2 p-2 ' >
    //       <VideoIcon /> 
    //       <p>Reels</p>
    //       </Link>
    //       </div>

    //       <div className=' hover:bg-slate-700 rounded-lg flex gap-2 p-2 '
    //       onClick={handleToggleUpload}
    //       > 
    //         <Plus />
    //         <p className='max-sm:hidden hover:block'>Upload</p>
    //       </div>

    //       <div className=' hover:bg-slate-700  rounded-lg '> 
    //       <Link className='flex gap-2 p-2 '>
    //         <Video />
    //        <p>Posts</p>
    //       </Link>
    //       </div>

    //       <div className=' hover:bg-slate-700 rounded-lg  '> 
    //       <Link className='flex gap-2 p-2 '>
    //         <MessageCircle />
    //       <p>Notifications</p>
    //       </Link>
    //       </div>

    //       <div className=' hover:bg-slate-700 rounded-lg  '> 
    //       <Link className='flex gap-2 p-2 ' to={'/social/profile'}>
    //         < User2Icon />
    //       <p>Profile</p>
    //       </Link>
    //       </div>

    //     </div>
    //   </nav>
    //  </header>
          <header className='border-r text-white border-right border-slate-500 p-6 max-w-sm w-full h-screen '>
      <nav className='space-y-3'>

        <div className='relative'>
          <Search className='absolute top-2 size-5 left-2 text-slate-400' />
          <input 
          type="text"
           className='input-rounded' 
           placeholder='...'
          />
        </div>


        <div className='font-semibold '>

          <div className=' hover:bg-slate-700 rounded-lg '> 
            <Link className='hover:bg-slate-700 rounded-lg flex gap-2 p-2' >
            <HomeIcon />
          <p>Home</p> 
            </Link>
            
          </div>

          <div className=' hover:bg-slate-700 rounded-lg '> 
          <Link className='flex gap-2 p-2 ' >
          <VideoIcon /> 
          <p>Reels</p>
          </Link>
          </div>

          <div className=' hover:bg-slate-700 rounded-lg flex gap-2 p-2 '
          onClick={handleToggleUpload}
          > 
            <Plus />
            <p>Upload</p>
          </div>

          <div className=' hover:bg-slate-700  rounded-lg '> 
          <Link className='flex gap-2 p-2 ' to={'/social/posts'}>
            <Video />
           <p>Posts</p>
          </Link>
          </div>

          <div className=' hover:bg-slate-700 rounded-lg  '> 
          <Link className='flex gap-2 p-2 '>
            <MessageCircle />
          <p>Notifications</p>
          </Link>
          </div>

          <div className=' hover:bg-slate-700 rounded-lg '> 
          <Link className='flex gap-2 p-2 ' to={`/social/profile/${user?.username}`}>
            < User2Icon />
          <p>Profile</p>
          </Link>
          </div>

        </div>
      </nav>
     </header>

  )
}

export default EcommerceSidebar