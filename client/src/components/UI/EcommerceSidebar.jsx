import { HomeIcon, MessageCircle, Plus, Search, User2Icon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleUploadPost } from '../../store/slices/popup.slice';
import { Link } from 'react-router-dom';

const EcommerceSidebar = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)

  const handleToggleUpload = () => {
    dispatch(toggleUploadPost())
  }

  return (
    <header className='max-sm:hidden border-r border-slate-500 p-6 max-w-sm w-full min-h-screen text-white'>
      <nav className='space-y-3'>

        <div className='relative'>
          <Search className='absolute top-2 size-5 left-2 text-slate-400' />

          <input
            type="text"
            className='input-rounded'
            placeholder='...'
          />
        </div>

        <div className='font-semibold'>

          <div className='hover:bg-slate-700 rounded-lg'>
            <Link className='flex gap-2 p-2'>
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

          <div
            className='hover:bg-slate-700 rounded-lg flex gap-2 p-2'
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
    </header>
  )
}

export default EcommerceSidebar