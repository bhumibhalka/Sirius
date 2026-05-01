import { Bookmark, EllipsisVertical, Heart, HomeIcon, MessageCircle, Plus, Search, Share, User2Icon, UserIcon, Video, VideoIcon } from 'lucide-react'
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

          <div className=' hover:bg-slate-700 rounded-lg '> 
          <Link className='flex gap-2 p-2 ' to={'/social/profile'}>
            < User2Icon />
          <p>Profile</p>
          </Link>
          </div>

        </div>
      </nav>
     </header>

      {/* posts */}
     <div className='space-y-2'>
       {
        posts && posts.length > 0 ? (
        posts.map((post)=> (
          <div
          key={post._id}
          className='p-4 space-y-4'
          >
            {/* head */}
            <div className='flex  items-center justify-between '>
              <div className='flex items-center gap-2'>
                <div className='bg-white inline-flex rounded-full'>
                  <img src={post?.author?.avatar  ||<UserIcon /> } alt="img" className='object-cover size-8' />
                </div>
                <h3>{post?.author?.displayName}</h3>
              </div>

              {/* buttons */}
              <div className='flex items-center gap-2'>
                <button
                className='bg-slate-600 px-3 font-semibold py-1 rounded-lg'
                >
                  Follow
                </button>
                <EllipsisVertical />
              </div>
            </div>

            {/* content */}

            {post?.media?.[0]?.type === 'images' && (
              <div className=' bg-white '>
              <img src={post?.media?.[0]?.url} alt="image" className='object-contain h-[500px] w-[450px] ' />
            </div>
            )}

            {post?.media?.[0]?.type === 'videos' && (
              <div className=' bg-white '>
              <video src={post?.media?.[0]?.url} alt="image" className='h-[500px] w-[450px] '
              controls
              />
            </div>
            )}
            
            {/* bottom */}
            <div className='space-y-2'>
              {/* buttons */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                {/* likes */}
                <button className='flex items-center gap-1'>
                  <Heart />
                  <p>{post?.stats?.likeCount}</p>
                </button>
                {/* comments */}
                <button className='flex items-center gap-1'>
                  <MessageCircle />
                  <p>{post?.stats?.commentCount}</p>
                </button>
                {/* share */}
                <button className='flex items-center gap-1'>
                  <Share />
                  <p>{post?.stats?.shareCount}</p>
                </button>
              </div>

              <button>
                <Bookmark />
              </button>
            </div>
            
            {/* text content */}
            <div className='flex items-center gap-1'>
              <h3 className='font-semibold'>{post?.author?.displayName}</h3>
              <p>{post?.caption}</p>
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