import { Bookmark, EllipsisVertical, Heart, HomeIcon, MessageCircle, Plus, Search, Share, User2Icon, UserIcon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleCommentModal, toggleSearchOpen, toggleUploadPost } from '../../store/slices/popup.slice'
import AddPost from '../../components/popups/AddPost'
import { useEffect } from 'react'
import { clearFeed, fetchHomeFeed, likeToggleOptimistic, toggleLike } from '../../store/slices/social-media/post.slice'
import { useCallback } from 'react'
import { optimisticFollowToggle, toggleFollow, seedFollowStatus } from '../../store/slices/social-media/profile.slice'
import { fetchUsers } from '../../store/slices/social-media/user.slice'
import SearchSidebar from '../../components/popups/SearchSidebar'
import Comment from '../../components/popups/Comment'
import { fetchSavedPost, toggleSavePost } from '../../store/slices/social-media/save.slice'


const Home = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {isUploadPostModalOpen, isSearchOpen, isCommentOpen} = useSelector(state => state.popup)
  const {posts, nextCursor, status, isRefreshing} = useSelector(state => state.post);
  const {followStatus} = useSelector(state => state.profile)
  const {library} = useSelector(state => state.save)
  const { items: users,  nextCursor: userNextCursor  } = useSelector(state => state.user);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([])
  const [search, setSearch] = useState("");
 const [currentPost, setCurrentPost] = useState(null);
console.log(posts);
console.log("user:",user);



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

 useEffect(() => {
  if (posts.length === 0) {
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

  useEffect(()=> {
    dispatch(fetchSavedPost({cursor : null }))
  },[])
  
  return (
    <div className='bg-black min-h-screen text-white  grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 gap-4'>
      {/* navbar */}
     <header className=' max-sm:hidden border-r border-right border-slate-500 p-6 max-w-sm w-full h-screen '>
      <nav className='space-y-3'>


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

          <div className=' hover:bg-slate-700 rounded-lg '
          onClick={toggleSearch}
          > 
          <Link className='flex gap-2 p-2 ' >
          <Search /> 
          <p>Search</p>
          </Link>
          </div>

          

          <div className=' hover:bg-slate-700 rounded-lg flex gap-2 p-2 '
          onClick={handleToggleUpload}
          > 
            <Plus />
            <p>Upload</p>
          </div>

          <div className=' hover:bg-slate-700  rounded-lg '> 
          <Link className='flex gap-2 p-2 ' to={'/social/posts'}>
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
          <Link className='flex gap-2 p-2 ' to={`/social/profile/${user?.username}`}>
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
        posts.map((post)=> 
          
          {
              const following = followStatus[post?.authorId] ?? false;

             const isSaved = post.isSaved;
return (  <div
          key={post._id}
          className='p-4 space-y-4'
          >
            {/* head */}
            <div className='flex  items-center justify-between '>
              <div className='flex items-center gap-2'>
                <div className='bg-white inline-flex rounded-full'>
                  <img src={post?.author?.avatar  } alt="img" className='object-cover size-8' />
                </div>
                <h3>{post?.author?.displayName}</h3>
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