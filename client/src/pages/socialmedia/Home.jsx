import { HomeIcon, MessageCircle, Plus, Search, User2Icon, UserIcon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleUploadPost } from '../../store/slices/popup.slice'
import AddPost from '../../components/popups/AddPost'
import { useEffect } from 'react'
import { clearFeed, fetchHomeFeed } from '../../store/slices/social-media/post.slice'
import { useCallback } from 'react'

const Home = () => {

  const dispatch = useDispatch();
  const {isUploadPostModalOpen} = useSelector(state => state.popup)
  const {posts, nextCursor, status, isRefreshing} = useSelector(state => state.post);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([])
console.log(posts);

  const handleToggleUpload = () => {
    dispatch(toggleUploadPost())
  }

  useEffect(()=> {
    if(posts.length === 0) {
      dispatch(fetchHomeFeed({cursor: null}))
    }
  },[dispatch])

  const loadMore = useCallback(()=> {
    if(status !== 'loading' && nextCursor){
      dispatch(fetchHomeFeed({cursor: nextCursor}))
    }
  },[dispatch, nextCursor, status])

  const handleRefresh = () => {
    dispatch(clearFeed())
    dispatch(fetchHomeFeed({cursor: null}))
  }

  const handleScroll = (e) => {
 const bottom =
  e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if(bottom) loadMore()
  }
  
  return (
    <div className='bg-black min-h-screen text-white  grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 gap-4'>
      {/* navbar */}
     <header className='border-r border-right border-slate-500 p-6 max-w-sm w-full h-screen '>
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
            <Link className='flex gap-2 p-2 ' >
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
          <Link className='flex gap-2 p-2 '>
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

          <div className=' hover:bg-slate-700 rounded-lg  '> 
          <Link className='flex gap-2 p-2 '>
            < User2Icon />
          <p>Profile</p>
          </Link>
          </div>

        </div>
      </nav>
     </header>

      {/* posts */}
     <div>
       {
        posts && posts.length > 0 ? (
        posts.map((post)=> (
          <div
          key={post._id}
          >
            {/* head */}
            <div>
              <div className='flex items-center gap-2'>
                <div className='bg-white inline-flex rounded-full'>
                  <img src={post?.author?.avatar  ||<UserIcon /> } alt="img" className='object-cover size-8' />
                </div>
                <h3>{post?.author?.displayName}</h3>
              </div>
            </div>
          </div>
        ))
        ) 
        : (<div>
            <p>No posts yet!!! Be the first one to upload the post </p>
        </div>)
       }
     </div>

      {/* message */}
     <div>

     </div>

     {/* Upload modal */}
     {
      isUploadPostModalOpen && <AddPost />
     }

    </div>
  )
}

export default Home