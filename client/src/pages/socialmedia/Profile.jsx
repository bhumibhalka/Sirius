import React, { lazy, Suspense, useCallback, useEffect, useMemo, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  Bookmark,
  Ellipsis,
  Grid,
  Plus,
  Settings,
  User2,
} from 'lucide-react'
import { useState } from 'react'
import {
  getProfile,
  optimisticFollowToggle,
  toggleFollow,
} from '../../store/slices/social-media/profile.slice'
import { toggleEditProfileModal } from '../../store/slices/popup.slice'
import { getUserPosts, resetProfilePosts } from '../../store/slices/social-media/post.slice'
import { fetchSavedPost } from '../../store/slices/social-media/save.slice'
import { fetchFollowData } from '../../store/slices/social-media/follow.slice'

// Lazy-load heavy modal 
const EditProfile = lazy(() => import('../../components/popups/EditProfile'))

// Static tab config at module scope 
const TABS = [
  { key: 'all',   Icon: Grid     },
  { key: 'saved', Icon: Bookmark },
  { key: 'tagged', Icon: User2   },
]

//Individual post tile – memo prevents re-renders across tab switches 
const PostTile = memo(({ post }) => {
  const mediaItem = post?.media?.[0]
  if (!mediaItem) return null

  return (
    <div className="bg-white flex aspect-square overflow-hidden">
      {mediaItem.type === 'images' && (
        <img
          src={mediaItem.url}
          alt={post?.caption || 'Post'}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
      {mediaItem.type === 'videos' && (
        <video
          src={mediaItem.url}
          className="w-full h-full object-cover"
          preload="none"
          muted
        />
      )}
    </div>
  )
})
PostTile.displayName = 'PostTile'

//Stat pill – pure display 
const StatPill = memo(({ value, label }) => (
  <div className="flex items-center gap-1">
    <p className="font-semibold">{value ?? 0}</p>
    <p className="text-sm">{label}</p>
  </div>
))
StatPill.displayName = 'StatPill'

//  Main component 
const Profile = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { username } = useParams()

  // Granular selectors – each subscribes to only what it needs
  const currentUserId    = useSelector(state => state.auth.user?.id)
  const activeProfile    = useSelector(state => state.profile.activeProfile)
  const loading          = useSelector(state => state.profile.loading)
  const userPosts        = useSelector(state => state.post.userPosts)
  const isEditProfileOpen = useSelector(state => state.popup.isEditProfileOpen)
  const library          = useSelector(state => state.save.library)

  const [activeTab, setActiveTab] = useState('all')

  const isSelf      = activeProfile?.relationship?.isSelf
  const isFollowing = activeProfile?.relationship?.isFollowing

  // Data fetching 
  useEffect(() => {
    if (!username) return
    dispatch(resetProfilePosts())
    dispatch(getProfile(username))
    dispatch(getUserPosts(username))
    dispatch(fetchSavedPost({ cursor: null }))
  }, [username, dispatch])

  useEffect(() => {
    if (!activeProfile?.accountId) return
    const id = activeProfile.accountId
    dispatch(fetchFollowData({ userId: id, type: 'followers', cursor: null }))
    dispatch(fetchFollowData({ userId: id, type: 'following', cursor: null }))
  }, [activeProfile?.accountId, dispatch])

  // ── Stable callbacks ────────────────────────────────────────────────────────
  const handleToggleFollow = useCallback(() => {
    dispatch(optimisticFollowToggle(activeProfile?.accountId))
    dispatch(toggleFollow(activeProfile?.accountId))
  }, [dispatch, activeProfile?.accountId])

  const openEditProfile = useCallback(() => {
    dispatch(toggleEditProfileModal())
  }, [dispatch])

  // Derived: filtered posts 
  // Memoised so switching tabs doesn't re-derive on unrelated renders
  const filteredPosts = useMemo(
    () => (activeTab === 'saved' ? library : userPosts) ?? [],
    [activeTab, library, userPosts]
  )

  const stats = activeProfile?.stats

  return (
    <div className="bg-black min-h-screen p-6 text-white">

      <div className="space-y-6 p-4 w-full max-w-2xl mx-auto">

        {/* PROFILE INFO */}
        <div className="space-y-1">
          <div className="flex gap-6">

            {/* AVATAR */}
            <div className="bg-linear-to-tr from-yellow-400 via-orange-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center p-1 shrink-0">
              <img
                src={activeProfile?.avatar?.url}
                alt={activeProfile?.displayName || 'Avatar'}
                loading="eager"     // profile picture is above the fold
                decoding="async"
                className="size-20 rounded-full object-cover bg-black p-1"
              />
            </div>

            {/* NAME + STATS */}
            <div className="space-y-2">
              <div>
                <div className="flex gap-2 items-center">
                  <h3 className="text-2xl font-bold">{activeProfile?.displayName}</h3>
                  {isSelf
                    ? <Settings className="size-5 cursor-pointer" onClick={() => navigate('/settings')} />
                    : <Ellipsis />
                  }
                </div>
                <p>{activeProfile?.username}</p>
              </div>

              <div className="flex gap-4 items-center">
                <StatPill value={stats?.posts}     label="posts"     />
                <StatPill value={stats?.followers} label="followers" />
                <StatPill value={stats?.following} label="following" />
              </div>
            </div>
          </div>

          {/* BIO */}
          {activeProfile?.bio && <p>{activeProfile.bio}</p>}
        </div>

        {/* ACTION BUTTONS */}
        {isSelf ? (
          <div className="flex gap-2 items-center">
            <button
              className="w-full bg-slate-400 font-semibold py-1 rounded hover:bg-slate-500 transition-colors duration-300"
              onClick={openEditProfile}
            >
              Edit Profile
            </button>
            <button className="w-full bg-slate-400 font-semibold py-1 rounded hover:bg-slate-500 transition-colors duration-300">
              Edit archive
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <button
              className={`py-1.5 font-semibold w-full rounded-lg transition-colors duration-300 text-sm ${
                isFollowing ? 'bg-slate-500 hover:bg-slate-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={handleToggleFollow}
            >
              {isFollowing
                ? <span className="flex items-center justify-center gap-1">Following <ArrowDown size={14} /></span>
                : 'Follow'
              }
            </button>
            <button className="py-1.5 bg-slate-500 font-semibold w-full rounded-lg hover:bg-slate-400 transition-colors duration-300 text-sm">
              Message
            </button>
          </div>
        )}

        {/* STORY HIGHLIGHT */}
        <div className="mb-2">
          <div className="relative inline-block">
            <div className="inline-flex border-2 border-slate-400 rounded-full p-1">
              <p className="bg-slate-400 p-3 rounded-full">
                <Plus className="size-7" />
              </p>
            </div>
            <p className="text-xs absolute left-5 -bottom-5">New</p>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="mt-12 flex items-center justify-evenly">
          {TABS.map(({ key, Icon }) => (
            <div
              key={key}
              className={`pb-2 cursor-pointer border-b-2 ${
                activeTab === key ? 'border-white' : 'border-transparent'
              }`}
              onClick={() => setActiveTab(key)}
            >
              <Icon />
            </div>
          ))}
        </div>

      </div>

      <hr className="-mt-3 w-full max-w-6xl mx-auto" />

      {/* POST GRID */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-3 mt-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostTile key={post._id} post={post} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p>No posts yet! <span className="underline cursor-pointer">Post now</span></p>
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <Suspense fallback={null}>
          <EditProfile />
        </Suspense>
      )}

    </div>
  )
}

export default Profile
