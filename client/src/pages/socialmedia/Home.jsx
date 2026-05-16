import { Bookmark, EllipsisVertical, Heart, HomeIcon, Loader, MessageCircle, Plus, Search, Share, User2Icon, UserIcon, Video, VideoIcon } from 'lucide-react'
import React, { lazy, memo, Suspense, useRef } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleCommentModal, toggleSearchOpen, toggleUploadPost } from '../../store/slices/popup.slice'
import { useEffect } from 'react'
import { clearFeed, fetchHomeFeed, getUserPosts, likeToggleOptimistic, toggleLike } from '../../store/slices/social-media/post.slice'
import { useCallback } from 'react'
import { optimisticFollowToggle, toggleFollow, seedFollowStatus, getProfile } from '../../store/slices/social-media/profile.slice'
import { fetchUsers } from '../../store/slices/social-media/user.slice'
import { fetchSavedPost, toggleSavePost } from '../../store/slices/social-media/save.slice'
import EcommerceSidebar from '../../components/UI/EcommerceSidebar'


const AddPost = lazy(() => import('../../components/popups/AddPost'))
const SearchSidebar = lazy(() => import('../../components/popups/SearchSidebar'))
const Comment = lazy(() => import('../../components/popups/Comment'))


// Prevents every card from re-rendering when feed state or unrelated UI changes.
const PostCard = memo(({ post, currentUserId, isFollowing, onFollow, onLike, onComment, onSave }) => {
  const isSaved     = post.isSaved
  const isOwnPost   = post?.authorId === currentUserId
  const mediaItem   = post?.media?.[0]
  const avatar      = post?.author?.avatar || 'https://i.pravatar.cc/150?img=3'

  return (
    <div className="p-4 space-y-4">

      {/* HEAD */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white inline-flex rounded-full overflow-hidden">
            <img
              src={avatar}
              alt={post?.author?.displayName}
              loading="lazy"
              className="object-cover size-8"
            />
          </div>
          <Link to={`/social/profile/${post?.author?.username}`}>
            <h3>{post?.author?.displayName}</h3>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {!isFollowing && !isOwnPost && (
            <button
              className="bg-slate-600 px-3 font-semibold py-1 rounded-lg"
              onClick={() => onFollow(post?.authorId)}
            >
              Follow
            </button>
          )}
          <EllipsisVertical />
        </div>
      </div>

      {/* MEDIA */}
      {mediaItem?.type === 'images' && (
        <div className="bg-white">
          <img
            src={mediaItem.url}
            alt="post"
            loading="lazy"
            className="object-contain h-[500px] w-[450px]"
          />
        </div>
      )}

      {mediaItem?.type === 'videos' && (
        <div className="bg-white">
          <video
            src={mediaItem.url}
            className="h-[500px] w-[450px]"
            controls
            preload="none"        // don't preload video data for off-screen posts
          />
        </div>
      )}

      {/* BOTTOM */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">

            {/* LIKE */}
            <button className="flex items-center gap-1" onClick={() => onLike(post)}>
              <Heart className={post?.likedByMe ? 'fill-red-500 text-red-500' : ''} />
              <p>{post?.stats?.likeCount}</p>
            </button>

            {/* COMMENT */}
            <button className="flex items-center gap-1" onClick={() => onComment(post)}>
              <MessageCircle />
              <p>{post?.stats?.commentCount}</p>
            </button>

            {/* SHARE */}
            <button className="flex items-center gap-1">
              <Share />
              <p>{post?.stats?.shareCount}</p>
            </button>
          </div>

          {/* SAVE */}
          <button onClick={() => onSave(post)}>
            <Bookmark className={isSaved ? 'fill-white text-white' : ''} />
          </button>
        </div>

        {/* CAPTION */}
        <div className="flex items-center gap-1">
          <h3 className="font-semibold">{post?.author?.displayName}</h3>
          <p>{post?.caption}</p>
        </div>
      </div>

    </div>
  )
})
PostCard.displayName = 'PostCard'


const Home = () => {

  const dispatch = useDispatch();
  const currentUserId = useSelector(state => state.auth.user?.id)
  const isUploadPostModalOpen = useSelector(state => state.popup.isUploadPostModalOpen)
  const isSearchOpen = useSelector(state => state.popup.isSearchOpen)
  const isCommentOpen = useSelector(state => state.popup.isCommentOpen)
  const homeFeedPosts = useSelector(state => state.post.homeFeedPosts)
  const nextCursor = useSelector(state => state.post.nextCursor)
  const status = useSelector(state => state.post.status)
  const isRefreshing = useSelector(state => state.post.isRefreshing)
  const followStatus = useSelector(state => state.profile.followStatus)
  const userNextCursor = useSelector(state => state.user.nextCursor)


  const [currentPost, setCurrentPost] = useState(null);
  const [search, setSearch] = useState("");
console.log(homeFeedPosts);
// console.log("user:",user);
// console.log(activeProfile);

// const getUserProfile = (id) => {
//   dispatch(getProfile())
// }


 // INITAIL FEED LOAD

 useEffect(() => {
  if(homeFeedPosts.length === 0) {
    dispatch(fetchHomeFeed({cursor: null})).
    then(action => {
      if(action.payload?.followingSet) {
        dispatch(seedFollowStatus(action.payload.followingSet))
      }
    }) 
  }
 },[dispatch])// intentionally omit homeFeedPosts.length – only run on mount


  // ── Debounced user search – FIXED: passes `search` to the API call ──────────
  // The original always sent search: "" and had a duplicate of this effect.
 useEffect(() => {
  const delay = setTimeout(() => {
    dispatch(fetchUsers({search, cursor: null}))
  },400)
  return () => clearTimeout(delay)
 }, [dispatch, search])

  // ── Infinite scroll via scroll event 
  const loadMore = useCallback(() => {
    if(status !== 'loading' && nextCursor){
      dispatch(fetchHomeFeed({cursor: nextCursor}))
    }
  },[dispatch, nextCursor, status])


  // Stable ref so the scroll listener always sees the latest loadMore
  // without re-registering the listener on every render

  const loadMoreRef = useRef(loadMore)
  useEffect(()=> { loadMoreRef.current = loadMore}, [loadMore] )

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 50
      if(nearBottom) loadMoreRef.current()
    }
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
  },[])// empty deps – listener registered once, ref keeps it current


  // Stable callbacks

  const handleRefresh = useCallback(()=> {
    dispatch(clearFeed())
    dispatch(fetchHomeFeed({cursor: null}))
  },[dispatch])
  

  const handleFollowClick = useCallback((targetUserId)=> {
    dispatch(toggleFollow(targetUserId))
  },[dispatch])

  const handleLike = useCallback((post)=> {
    dispatch(likeToggleOptimistic({postId: post._id}))
    dispatch(toggleLike({postId: post._id}))
  },[dispatch])

  const handleToggleComments = useCallback((post)=> {
    setCurrentPost(post)
    dispatch(toggleCommentModal())
  },[dispatch])

  const handleSavePost = useCallback((post) => {
    dispatch(toggleSavePost(post))
  },[dispatch])

  const handleToggleSearch = useCallback(() => {
    dispatch(toggleSearchOpen())
  },[dispatch])

  return (
    <div className="bg-black min-h-screen text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* SIDEBAR */}
      <div>
        <EcommerceSidebar />
      </div>

      {/* FEED */}
      <div className="space-y-2 ml-2xl">
        {isRefreshing && (
          <div className="flex items-center justify-center p-2 w-full">
            <Loader className="animate-spin" />
          </div>
        )}

        {homeFeedPosts?.length > 0 ? (
          homeFeedPosts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              isFollowing={followStatus[post?.authorId] ?? false}
              onFollow={handleFollowClick}
              onLike={handleLike}
              onComment={handleToggleComments}
              onSave={handleSavePost}
            />
          ))
        ) : (
          <p className="text-center py-8">
            No posts yet! Be the first one to upload a post.
          </p>
        )}

        {status === 'loading' && !isRefreshing && (
          <div className="flex justify-center py-4">
            <Loader className="animate-spin" />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN PLACEHOLDER */}
      <div className="max-sm:hidden" />

      {/* MODALS – lazy, only mounted when open */}
      {isUploadPostModalOpen && (
        <Suspense fallback={null}>
          <AddPost />
        </Suspense>
      )}

      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchSidebar />
        </Suspense>
      )}

      {isCommentOpen && (
        <Suspense fallback={null}>
          <Comment post={currentPost} />
        </Suspense>
      )}

    </div>
  )
}

export default Home;