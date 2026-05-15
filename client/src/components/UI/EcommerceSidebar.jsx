import { HomeIcon, MessageCircle, Plus, Search, User2Icon, Video, VideoIcon } from 'lucide-react'
import React, { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { toggleSearchOpen, toggleUploadPost } from '../../store/slices/popup.slice';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../store/slices/social-media/user.slice';

const AddPost = lazy(() => import('../popups/AddPost'))
const SearchSidebar = lazy(() => import('../popups/SearchSidebar'))

const navLinks  = [
  {
    icon: HomeIcon,
    title: 'Home',
    path: '/social',
  },
  {
    icon: VideoIcon,
    title: 'Reels',
    path: '/social/reels',
  },
  {
    icon: Video,
    title: 'Posts',
    path: '/social/posts',
  },
  {
    icon: MessageCircle,
    title: 'Notifications',
    path: '/social/notifications'
  },
]

const EcommerceSidebar = () => {

  const dispatch = useDispatch();
  const { user, isUploadPostModalOpen, isSearchOpen } = useSelector((state) => ({
    user: state.auth.user,
    isUploadPostModalOpen: state.popup.isUploadPostModalOpen,
    isSearchOpen: state.popup.isSearchOpen,
  }),
 shallowEqual
)

 const handleToggleUpload = useCallback(() => {
  dispatch(toggleUploadPost());
 }, [dispatch])

  const [search, setSearch] = useState("");

  const toggleSearch = useCallback(() => {
    dispatch(toggleSearchOpen())
  },[dispatch])

  
 useEffect(() => {

  dispatch(
    fetchUsers({
      search: "",
      cursor: null
    })
  )
 },[dispatch])

  return (
    <header className='max-sm:hidden border-r border-slate-500 p-6 max-w-sm w-full min-h-screen text-white h-screen fixed bg-black '>
      <nav className='space-y-3'>

        <div className='font-semibold'>

        {/* DYNAMIC NAVIGATION */}
        {
          navLinks.map((item) => {

            const Icon = item.icon;

            return (
              <div 
              key={item.title}
              className='hver:bg-slate-700 rounded-lg'
              >
                <Link 
                className='flex gap-2 p-2'
                >
                <Icon />
                <p>{item.title}</p>
                </Link>
              </div>
            )

          })
        }

                  {/* SEARCH */}
          <button
            className='hover:bg-slate-700 rounded-lg w-full text-left'
            onClick={toggleSearch}
          >

            <div className='flex gap-2 p-2'>

              <Search />

              <p>Search</p>

            </div>

          </button>

        
          {/* UPLOAD */}
          <button
            className='hover:bg-slate-700 rounded-lg flex gap-2 p-2 hover:cursor-pointer w-full'
            onClick={handleToggleUpload}
          >

            <Plus />

            <p>Upload</p>

          </button>
        
                  {/* PROFILE */}
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

      <Suspense fallback={null}>
     {
       isUploadPostModalOpen && <AddPost />
      }
      </Suspense>

      <Suspense fallback={null}>
      {
        isSearchOpen && <SearchSidebar />
      }
      </Suspense>

    </header>



  )
}

export default memo(EcommerceSidebar) ;