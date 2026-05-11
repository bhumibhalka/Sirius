import { HomeIcon, MessageCircle, Plus, Search, User2Icon, Video, VideoIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSearchOpen, toggleUploadPost } from '../../store/slices/popup.slice';
import { Link } from 'react-router-dom';
import AddPost from '../popups/AddPost';
import SearchSidebar from '../popups/SearchSidebar';
import { fetchUsers } from '../../store/slices/social-media/user.slice';

const EcommerceSidebar = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {isUploadPostModalOpen, isSearchOpen} = useSelector(state => state.popup) 

  const [search, setSearch] = useState("");

  const handleToggleUpload = () => {
    dispatch(toggleUploadPost())
  }

  const toggleSearch = () => {
    dispatch(toggleSearchOpen())
  }

  
   useEffect(()=> {
    const delay = setTimeout(()=> {
      dispatch(fetchUsers({search: "", cursor: null }))  // ← always empty string!
    },400)
    return ()=> clearTimeout(delay);
  },[dispatch, search])  // ← 'search' state changes but never gets passed
    

  return (
    <header className='max-sm:hidden border-r border-slate-500 p-6 max-w-sm w-full min-h-screen text-white'>
      <nav className='space-y-3'>

        {/* <div className='relative'>
          <Search className='absolute top-2 size-5 left-2 text-slate-400' />

          <input
            type="text"
            className='input-rounded'
            placeholder='...'
          />
        </div> */}

        <div className='font-semibold'>

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link className='flex gap-2 p-2' to={'/social/'}>
              <HomeIcon />
              <p>Home</p>
            </Link>
          </div>

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link className='flex gap-2 p-2'>
              <VideoIcon />
              <p>Reels</p>
            </Link>
          </div>


          <div className=' hover:bg-slate-700 rounded-lg '
          onClick={toggleSearch}
          > 
          <Link className='flex gap-2 p-2 ' >
          <Search /> 
          <p>Search</p>
          </Link>
          </div>


          <div
            className='hover:bg-slate-700 rounded-lg flex gap-2 p-2 hover:cursor-pointer'
            onClick={handleToggleUpload}
          >
            <Plus />
            <p>Upload</p>
          </div>
          

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link className='flex gap-2 p-2' to={'/social/posts'}>
              <Video />
              <p>Posts</p>
            </Link>
          </div>

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link className='flex gap-2 p-2'>
              <MessageCircle />
              <p>Notifications</p>
            </Link>
          </div>

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link
              className='flex gap-2 p-2'
              to={`/social/profile/${user?.username}`}
            >
              <User2Icon />
              <p>Profile</p>
            </Link>
          </div>

        </div>
      </nav>
           {/* Upload modal */}
     {
      isUploadPostModalOpen && <AddPost />
     }

      {
      isSearchOpen && <SearchSidebar />
     }

    </header>



  )
}

export default EcommerceSidebar