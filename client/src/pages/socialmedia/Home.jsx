import { Bookmark, EllipsisVertical, Heart, HomeIcon, Loader, MessageCircle, Plus, Search, Share, User2Icon, UserIcon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleCommentModal, toggleSearchOpen, toggleUploadPost } from '../../store/slices/popup.slice'
import AddPost from '../../components/popups/AddPost'
import { useEffect } from 'react'
import { clearFeed, fetchHomeFeed, getUserPosts, likeToggleOptimistic, toggleLike } from '../../store/slices/social-media/post.slice'
import { useCallback } from 'react'
import { optimisticFollowToggle, toggleFollow, seedFollowStatus, getProfile } from '../../store/slices/social-media/profile.slice'
import { fetchUsers } from '../../store/slices/social-media/user.slice'
import SearchSidebar from '../../components/popups/SearchSidebar'
import Comment from '../../components/popups/Comment'
import { fetchSavedPost, toggleSavePost } from '../../store/slices/social-media/save.slice'
import EcommerceSidebar from '../../components/UI/EcommerceSidebar'


const Home = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {isUploadPostModalOpen, isSearchOpen, isCommentOpen} = useSelector(state => state.popup)
  const {homeFeedPosts, nextCursor, status, isRefreshing, loading} = useSelector(state => state.post);
  const {followStatus} = useSelector(state => state.profile)
  const {library} = useSelector(state => state.save)
  const { items: users,  nextCursor: userNextCursor  } = useSelector(state => state.user);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([])
  const [search, setSearch] = useState("");
 const [currentPost, setCurrentPost] = useState(null);
// console.log(homeFeedPosts);
// console.log("user:",user);


// const getUserProfile = (id) => {
//   dispatch(getProfile())
// }

const handleToggleComments = (post) => {
 setCurrentPost(post);
  dispatch(toggleCommentModal())
}

  const handleToggleUpload = () => {
    dispatch(toggleUploadPost())
  }

  const toggleSearch =() => {
    dispatch(toggleSearchOpen())
  }

  useEffect(()=> {
  const delay = setTimeout(()=> {
    dispatch(fetchUsers({search: "", cursor: null }))  // ← always empty string!
  },400)
  return ()=> clearTimeout(delay);
},[dispatch, search])  // ← 'search' state changes but never gets passed
  

 useEffect(() => {
  if (homeFeedPosts.length === 0) {
    dispatch(fetchHomeFeed({ cursor: null })).then((action) => {
      if (action.payload?.followingSet) {
        dispatch(seedFollowStatus(action.payload.followingSet));
      }
    });
  }
}, [dispatch])


  const loadMore = useCallback(()=> {
    if(status !== 'loading' && nextCursor){
      dispatch(fetchHomeFeed({cursor: nextCursor}))
    }
  },[dispatch, nextCursor, status])

  const handleRefresh = () => {
    dispatch(clearFeed())
    dispatch(fetchHomeFeed({cursor: null}))
  }

//   const handleScroll = (e) => {
//  const bottom =
//   e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
//     if(bottom) loadMore()
//   }

  const handleFollowClick = (targetUserId) => {
    // const nextState = !isFollowing
    // dispatch(optimisticFollowToggle({isFollowing: !isFollowing}))
    dispatch(toggleFollow(targetUserId))
  }
  

  useEffect(()=> {
    const delay = setTimeout(()=> {
       dispatch(fetchUsers({search: "", cursor: null }))
    },400)

    return ()=> clearTimeout(delay);
  },[dispatch, search])

  const loadMoreUsers = () => {
    if(userNextCursor){
      dispatch(fetchUsers({search: "", cursor: userNextCursor}))
    }
  }

  const handleLike = (post) => {
    // 1. Instant UI update (Heart turns red, count goes up)
    dispatch(likeToggleOptimistic({postId: post._id}));

    // 2. Background sync with Server
    dispatch(toggleLike({postId: post._id}));
  }

  const handleSavePost = (post) => {
    dispatch(toggleSavePost(post))
  }

  // ✅ Add this useEffect instead
useEffect(() => {
  const handleScroll = () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 50;
    if (nearBottom) loadMore();
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [loadMore]);

  // useEffect(()=> {
  //   dispatch(fetchSavedPost({cursor : null }))
  // },[])

//   if(isRefreshing) {
//  return (
//   <div className='flex flex-col items-center justify-center h-screen'>
//     <Loader className='animate-spin size-8' />
//     <p className='font-semibold'>Loading...</p>
//   </div>
//  )
//   }
  
  return (
    <div className='bg-black min-h-screen text-white  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {/* navbar */}

      <div className=''>
      <EcommerceSidebar />
      </div>
        

      {/* posts */}
     <div className='space-y-2'>
       {
        isRefreshing && (
          <div className='flex items-center justify-center p-2 w-full'>
            <Loader className='animate-spin' />
          </div>
        )
       }

       {
        homeFeedPosts && homeFeedPosts.length > 0 ? (
        homeFeedPosts.map((post)=> 
          
          {
              const following = followStatus[post?.authorId] ?? false;

             const isSaved = post.isSaved;
return (

  
    <div
          key={post._id}
          className='p-4 space-y-4'
          >
            {/* head */}
            <div className='flex  items-center justify-between '>
              <div className='flex items-center gap-2'>
                <div className='bg-white inline-flex rounded-full'>
                  <img src={post?.author?.avatar ||'https://i.pravatar.cc/150?img=3'  } alt="img" className='object-cover size-8' />
                </div>
                <Link to={`/social/profile/${post?.author?.username}`}>
                <h3 >{post?.author?.displayName}</h3>
                </Link>
              </div>

              {/* buttons */}
              <div className='flex items-center gap-2'>
                <button
                className={`bg-slate-600 px-3 font-semibold py-1 rounded-lg ${following ? "hidden": "block"} `}
                onClick={()=> handleFollowClick(post?.authorId)}
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
                <button 
                className='flex items-center gap-1'
                >
                  <Heart active={post.likedByMe}  onClick={()=> handleLike(post)} className={`${post?.likedByMe ? "fill-red-500 text-red-500": ""}`}/>
                  <p>{post?.stats?.likeCount}</p>
                </button>
                {/* comments */}
                <button className='flex items-center gap-1'
                 onClick={() => handleToggleComments(post)}
                >
                  <MessageCircle/>
                  <p>{post?.stats?.commentCount}</p>
                </button>
                {/* share */}
                <button className='flex items-center gap-1'>
                  <Share />
                  <p>{post?.stats?.shareCount}</p>
                </button>
              </div>

              <button onClick={() => handleSavePost(post)}>
                <Bookmark className={`${isSaved ? "fill-white text-white" : ""}`} />
              </button>
            </div>
            
            {/* text content */}
            <div className='flex items-center gap-1'>
              <h3 className='font-semibold'>{post?.author?.displayName}</h3>
              <p>{post?.caption}</p>
            </div>
            </div>
          </div>)
        
})
        ) 
        : (<div>
            <p>No posts yet!!! Be the first one to upload the post </p>
        </div>)
       }
     </div>

     
      {/* message */}
     <div className='max-sm:hidden'>

     </div>

     {/* Upload modal */}
     {
      isUploadPostModalOpen && <AddPost />
     }

     {
      isSearchOpen && <SearchSidebar />
     }

     {/* comment model */}
     {
      isCommentOpen && (
        <div className=' '>
          <Comment  post={currentPost} />
        </div>
      )
     }

    </div>
  )
}

export default Home;