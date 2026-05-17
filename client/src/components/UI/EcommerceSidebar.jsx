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
    title: 'Reels(currently unavaliable)',
    path: '/social/reels',
  },
  {
    icon: Video,
    title: 'Posts',
    path: '/social/posts',
  },
  {
    icon: MessageCircle,
    title: 'Notifications(currently unavaliable)',
    path: '/notifications'
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
    // max-sm:hidden 
    <header className='fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-slate-800 z-50 px-4 flex flex-row items-center justify-around
    
    /* MD Screens and up (Left Sidebar) */
    md:top-0 md:bottom-auto md:border-t-0 md:border-r md:border-slate-500 md:p-6 md:max-w-[240px] lg:max-w-sm md:w-full md:h-screen md:flex-col md:justify-start md:items-start text-white'>
      <nav className='space-y-3'>

        <div className='/* Mobile: horizontal row of items */
        flex flex-row justify-around items-center w-full
        
        /* MD Screens: vertical column */
        md:flex-col md:items-stretch md:space-y-2 md:font-semibold'>

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
                to={`${item.path}`}
                className='flex gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors duration-300'
                >
                <Icon />
                <p className='max-md:hidden'>{item.title}</p>
                </Link>
              </div>
            )

          })
        }

                  {/* SEARCH */}
          <button
            className='hover:bg-slate-700 rounded-lg w-full text-left '
            onClick={toggleSearch}
          >

            <div className='flex gap-2 p-2'>

              <Search />

              <p className='max-md:hidden'>Search</p>

            </div>

          </button>

        
          {/* UPLOAD */}
          <button
            className='hover:bg-slate-700 rounded-lg flex gap-2 p-2 hover:cursor-pointer w-full'
            onClick={handleToggleUpload}
          >

            <Plus />

            <p className='max-md:hidden'>Upload</p>

          </button>
        
                  {/* PROFILE */}
          <div className='hover:bg-slate-700 rounded-lg'>

            <Link
              className='flex gap-2 p-2'
              to={`/social/profile/${user?.username}`}
            >

              <User2Icon />

              <p className='max-md:hidden'>Profile</p>

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