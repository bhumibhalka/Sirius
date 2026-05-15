import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, optimisticFollowToggle, toggleFollow } from '../../store/slices/social-media/profile.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBigDown, ArrowDown, ArrowDown01, Bookmark, Ellipse, Ellipsis, EllipsisVertical, Grid, Plus, Settings, Settings2, User2 } from 'lucide-react';
import { useState } from 'react';
import EditProfile from '../../components/popups/EditProfile';
import { toggleEditProfileModal } from '../../store/slices/popup.slice';
import { getUserPosts, resetProfilePosts } from '../../store/slices/social-media/post.slice';
import { fetchSavedPost } from '../../store/slices/social-media/save.slice';
import { fetchFollowData } from '../../store/slices/social-media/follow.slice';

const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector(state => state.auth)
  const {activeProfile, loading, error} = useSelector(state => state.profile)
  const {userPosts} = useSelector(state => state.post);
  const {isEditProfileOpen} = useSelector(state => state.popup);
  const {library} = useSelector(state => state.save);
  const {followers, following} = useSelector(state => state.follow);
  // console.log("user",user);
  // console.log('library:',library);
  // console.log("activeProfile",activeProfile);
  // console.log("follow data",following.list);
  // console.log("follow data",followers.list);
  // console.log('posts:', userPosts);
  const {username} = useParams();

  const [filterPosts, setFilterPost] = useState('all')

  const filteredPosts = filterPosts === "saved" ? library : userPosts;

  // const isFollowing =  followers?.list?.some(item =>{ 
  //   console.log(item);
  //   return( 
  //     item.user?.accountId === user.id
  //   )
  // }) 
  // console.log(isFollowing);

  // console.log(filteredPosts);

  const isFollowing = activeProfile?.relationship?.isFollowing 

  const handleToggleFollow = () => {
    dispatch(optimisticFollowToggle(activeProfile?.accountId))
    dispatch(toggleFollow(activeProfile?.accountId))
  }

  const openEditProfile = () => {
    dispatch(toggleEditProfileModal())
  }

useEffect(() => {
  if (username) {
      console.log("USE EFFECT RUNNING");
    dispatch(resetProfilePosts()); // ✅ clear old feed posts
    dispatch(getProfile(username)); // profile info
    dispatch(getUserPosts(username)); // ✅ fetch ONLY this user's posts
    // console.log("fetching saved posts");
    dispatch(fetchSavedPost({cursor: null}))
  }
}, [username, dispatch]);

useEffect(()=> {
  if(activeProfile?.accountId){
        dispatch(fetchFollowData({userId: activeProfile?.accountId ,type: "followers", cursor: null}))
        dispatch(fetchFollowData({userId: activeProfile?.accountId, type: "following", cursor: null}))
  }
},[activeProfile?.accountId, dispatch])

  return (
    <div className='bg-black min-h-screen p-6 text-white'>
     
     <div className=''>
      {/* profile content */}
     <div className='mx-auto'>
     <div>
     <div className='space-y-6 p-4 w-full max-w-2xl mx-auto'>


     {/* profile info */}
     <div className='space-y-1'>
      {/* profile info */}
      <div className='flex gap-6'>
      <div className='bg-linear-to-tr from-yellow-400 via-orange-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center p-1'>
        <img  src={ activeProfile?.avatar?.url}
     alt="img" className='size-20 rounded-full object-cover bg-black p-1 '/>
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

      {/* bio */}
      <div>
        <p>{activeProfile?.bio}</p>
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
        className={` py-1.5 bg-blue-500 font-semibold w-full rounded-lg hover:bg-blue-600 transition-colors duration-300 hover:cursor-pointer text-sm ${isFollowing ? "bg-slate-500" : ""}`}
        onClick={handleToggleFollow}
        >
          { isFollowing
           ? ( 
            <div className='flex items-center justify-center gap-1'><span>Following</span><ArrowDown size={14} /></div>)
            : "Follow"}
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