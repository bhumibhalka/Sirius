import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../../store/slices/social-media/profile.slice';
import { useParams } from 'react-router-dom';
import { Bookmark, Grid, Plus, Settings, Settings2, User2 } from 'lucide-react';
import { useState } from 'react';
import EditProfile from '../../components/popups/EditProfile';
import { toggleEditProfileModal } from '../../store/slices/popup.slice';
import { getUserPosts, resetProfilePosts } from '../../store/slices/social-media/post.slice';

const Profile = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {activeProfile, loading, error} = useSelector(state => state.profile)
  const {posts} = useSelector(state => state.post);
  const {isEditProfileOpen} = useSelector(state => state.popup);
  // console.log(user);
  console.log(activeProfile);
  console.log('posts:', posts);
  const {username} = useParams();

  const [filterPosts, setFilterPost] = useState('all')
  // const [selectedProfile, setSelectedProfile] = useState(null);

  // const filteredPosts = posts?.filterPosts(post => {
  //   const matchesFilter = filterPosts === 'all' || post.
  // })

  const openEditProfile = () => {
    dispatch(toggleEditProfileModal())
  }

useEffect(() => {
  if (username) {
    dispatch(resetProfilePosts()); // ✅ clear old feed posts
    dispatch(getProfile(username)); // profile info
    dispatch(getUserPosts()); // ✅ fetch ONLY this user's posts
  }
}, [username]);
  return (
    <div className='bg-black min-h-screen p-6 text-white'>
     
     <div className=''>
      {/* profile content */}
     <div className='mx-auto'>
     <div>
     <div className='space-y-6 p-4 w-full max-w-2xl mx-auto'>

      {/* profile info */}
      <div className='flex gap-6'>
      <div className='bg-white '>
        <img src={activeProfile?.avatar || "/men_essentails.jpeg"} alt="img" className='size-18 rounded-full object-cover'/>
      </div>
      <div className='space-y-2'>
        <div>
        <div className='flex gap-2 items-center'>
          <h3 className='text-xl font-semibold'>{activeProfile?.displayName}</h3>
          <Settings  className='size-5'/>
          </div>
        
        <p className='text-xs'>{activeProfile?.username}</p>
        </div>

        {/* stats */}
        <div className='flex gap-4 items-center'>
          {/* Posts */}
          <div className='flex items-center gap-1 text-xs font-semibold'>
            <p>{activeProfile?.stats?.followers  || 0}</p>
            <p>posts</p>
          </div>
          {/* Followers */}
          <div className='flex items-center gap-1 text-xs font-semibold'>
            <p>{activeProfile?.stats?.followers  || 0}</p>
            <p>followers</p>
          </div>
          {/* Following */}
          <div className='flex items-center gap-1 text-xs font-semibold'>
            <p>{activeProfile?.stats?.following  || 0}</p>
            <p>following</p>
          </div>
        </div>


      </div>
      </div>
 
      {/* buttons */}
      <div className='flex gap-2 items-center'>
        <button
        className='w-full bg-slate-400 font-semibold py-1 rounded hover:bg-slate-500 transition-colors duration-300'
        onClick={openEditProfile}
        >
          Edit Profile         
        </button>
        <button
        className='w-full bg-slate-400 font-semibold py-1 rounded hover:bg-slate-500 transition-colors duration-300'
        >
          Edit archive
        </button>
      </div>

      {/* stories */}
      <div className='mb-2'>
        {/* map on the stores if length is 0 the show this */}
        <div className='relative'>
        <div className='inline-flex border-2 border-slate-400 rounded-full p-1'>
          <p className='bg-slate-400 p-3 rounded-full'><Plus className='size-7' /></p>
        </div>
        <p className='text-xs absolute left-5 -bottom-5'>New</p>
        </div>
      </div>

      {/* controls */}
      <div className='mt-12 flex items-center justify-evenly'>
        <div   className={`pb-2 ${
    filterPosts === 'all'
      ? "border-b-2 border-white"
      : "border-b-2 border-transparent"
  }`} >
          <Grid onClick={() => setFilterPost('all')} />
        </div>

        <div className={`pb-2 ${filterPosts === 'saved' ? "border-b-2 border-white " : "border-b-2 border-transparent"}`}>
          <Bookmark onClick={() => setFilterPost('saved')} />
        </div>
        <div>
          <User2 />
        </div>
      </div>

     </div>
     </div>
     </div>


      <hr className='-mt-3 w-full max-w-6xl mx-auto' />

     {/* posts */}

     <div className='w-full max-w-6xl mx-auto grid grid-cols-3 mt-4'>
      
      {
        posts && posts.length > 0 
        ? (
          posts?.map((post) => (
            <div
            key={post._id}
            className='bg-white'
            >
              {
              post?.media?.[0]?.type === 'images' && (
                <img src={post?.media?.[0]?.url} alt="post" className='object-contain ' />
              )
              }
            </div>
          ))
        ) 
        : (<div>
          <p>No posts yet!!! <span>Post now</span></p>
        </div>)
      }
        
     </div>
      </div>

      {
        isEditProfileOpen && <EditProfile />
      }
    </div>
  )
}

export default Profile;