import { HomeIcon, MessageCircle, Plus, Search, User2Icon, Video, VideoIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleSearchOpen } from '../../store/slices/popup.slice'
import { createPost } from '../../store/slices/social-media/post.slice'

const Sidebar = () => {

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth)
  const {isSearchOpen} = useSelector(state => state.popup)

  const toggleSearch = () => {
    dispatch(toggleSearchOpen())
  }

  const handleToggleUpload = () => {
    dispatch(createPost())
  }

  return (
    <aside>


    </aside>
  )
}

export default Sidebar