import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../../store/slices/social-media/profile.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { Bookmark, Ellipse, Ellipsis, EllipsisVertical, Grid, Plus, Settings, Settings2, User2 } from 'lucide-react';
import { useState } from 'react';
import EditProfile from '../../components/popups/EditProfile';
import { toggleEditProfileModal } from '../../store/slices/popup.slice';
import { getUserPosts, resetProfilePosts } from '../../store/slices/social-media/post.slice';
import { fetchSavedPost } from '../../store/slices/social-media/save.slice';

const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector(state => state.auth)
  const {activeProfile, loading, error} = useSelector(state => state.profile)
  const {userPosts} = useSelector(state => state.post);
  const {isEditProfileOpen} = useSelector(state => state.popup);
  const {library} = useSelector(state => state.save);
  const {items} = useSelector(state => state.follow);
  console.log("user",user);
  console.log('library:',library);
  console.log("activeProfile",activeProfile);
  console.log("follow data",items);
  // console.log('posts:', userPosts);
  const {username} = useParams();

  const [filterPosts, setFilterPost] = useState('all')
  // const [selectedProfile, setSelectedProfile] = useState(null);

  // const filteredPosts = posts?.filterPosts(post => {
  //   const matchesFilter = filterPosts === 'all' || post.
  // })

  const filteredPosts = filterPosts === "saved" ? library : userPosts;

  console.log(filteredPosts);

  const openEditProfile = () => {
    dispatch(toggleEditProfileModal())
  }

useEffect(() => {
  if (username) {
      console.log("USE EFFECT RUNNING");
    dispatch(resetProfilePosts()); // ✅ clear old feed posts
    dispatch(getProfile(username)); // profile info
    dispatch(getUserPosts(username)); // ✅ fetch ONLY this user's posts
    console.log("fetching saved posts");
    dispatch(fetchSavedPost({cursor: null}))
  }
}, [username, dispatch]);
  return (
    <div className='bg-black min-h-screen p-6 text-white'>
     
     <div className=''>
      {/* profile content */}
     <div className='mx-auto'>
     <div>
     <div className='space-y-6 p-4 w-full max-w-2xl mx-auto'>

      {/* profile info */}
      <div className='flex gap-6'>
      <div className='  '>
        <img    src={ activeProfile?.avatar?.url}
alt="img" className='size-18   rounded-full object-cover   '/>
      </div>
      <div className='space-y-2'>
        <div>
        <div className='flex gap-2 items-center'>
          <h3 className='text-2xl font-bold'>{activeProfile?.displayName}</h3>
          <Settings  className={`size-5 ${activeProfile?.relationship?.isSelf ? "block" : "hidden"}`} onClick={() => navigate('/settings')}/>
            <Ellipsis className={`${activeProfile?.relationship?.isSelf ? "hidden" : "block"}`} />
          </div>
        
        <p >{activeProfile?.username}</p>
        </div>

        {/* stats */}
        <div className='flex gap-4 items-center'>
          {/* Posts */}
          <div className='flex items-center gap-1 '>
            <p className='font-semibold'>{activeProfile?.stats?.posts  || 0}</p>
            <p className='text-sm'>posts</p>
          </div>
          {/* Followers */}
          <div className='flex items-center gap-1 '>
            <p className='font-semibold'>{activeProfile?.stats?.followers  || 0}</p>
            <p className='text-sm'>followers</p>
          </div>
          {/* Following */}
          <div className='flex items-center gap-1 '>
            <p className='font-semibold'>{activeProfile?.stats?.following  || 0}</p>
            <p className='text-sm'>following</p>
          </div>
        </div>


      </div>
      </div>
 
      {/* buttons */}
      <div className={`flex gap-2 items-center ${activeProfile?.relationship?.isSelf ?  " block" : "hidden"} `}>
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

      {/* not self btns */}
      <div className={`flex gap-2 items-center ${activeProfile?.relationship?.isSelf ? "hidden" : "block"} `}>
        <button
        className=' py-1.5 bg-blue-500 font-semibold w-full rounded-lg hover:bg-blue-600 transition-colors duration-300 hover:cursor-pointer text-sm'
        >
          Follow
        </button>
        <button
        className=' py-1.5 bg-slate-500 font-semibold w-full rounded-lg hover:bg-slate-400 transition-colors duration-300 hover:cursor-pointer text-sm'
        >
          Message
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
        filteredPosts && filteredPosts.length > 0 
        ? (
          filteredPosts?.map((post) => (
            <div
            key={post._id}
            className='bg-white flex'
            >
              {
              post?.media?.[0]?.type === 'images' && (

                  <img src={post?.media?.[0]?.url} alt="post" className='object-cover ' />

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