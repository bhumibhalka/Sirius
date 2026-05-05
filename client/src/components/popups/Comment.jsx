import { Ellipsis, EllipsisVertical, Heart, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createComment, fetchComments } from '../../store/slices/social-media/comment.slice';
import { toggleCommentModal } from '../../store/slices/popup.slice';

const Comment = ({post}) => {

  const dispatch = useDispatch();
  const {posts} = useSelector(state => state.post);
  const {items, isSubmitting} = useSelector(state => state.comment)
  const { isCommentOpen } = useSelector(state => state.popup)

  const [content , setContent] = useState('')

  console.log("COMMENTS:", items);

  
  const currentPost = post
  console.log('posgt:',post);
  const addComment = () => {
    dispatch(createComment({postId: post._id , content: content}));
      setContent('')
  }

  const handleToggleComment = () => {
    dispatch(toggleCommentModal())
  }

useEffect(()=>{
  if(post?._id){
    dispatch(fetchComments({postId: post._id}))
  }
},[post?._id])

  if (!post) return null;

  return (
    <div
    className='flex items-center justify-center fixed inset-0 bg-white/50 z-50 '
    >

      <X className='absolute top-3 right-3 text-black hover:scale-105 transition-all duration-300' 
      onClick={()=> handleToggleComment()}
      />
    <div className='bg-black rounded-lg text-white w-full max-w-md h-full max-h-[60vh] overflow-y-auto'>
      {/* user data  & comments*/}
      <div className='flex items-center justify-between p-4 ' >
        <div className='flex gap-1'>
      <div>
        <img src={currentPost?.author?.avatar} alt="img" className='size-6 object-cover rounded-full'/>
      </div>

      <div>
        <h3>{currentPost?.author?.displayName}</h3>
       </div>
       </div>

      <Ellipsis/>
       
     </div>

    {/* comments */}
    <div className='space-y-2 '>
      {
        items && items.length > 0 ? ( 
           items.map((item) => (
             <div key={item._id} className="flex gap-2 p-2 items-center justify-between">
               <div  className="flex gap-2 p-2">
              <img
                src={item?.author?.avatar}
                alt="img"
                className="size-8 rounded-full"
              />

              <div className='flex gap-2'>
                <h3 className="font-semibold">
                  {item?.author?.displayName || "User"}
                </h3>

                <p>{item?.content}</p>   {/* 👈 THIS WILL NOW SHOW "hey" */}
              </div>
            </div>

            <Heart size={16}/>
            </div>
            
          ))
        ) :
         (<div></div>)
      }
    </div>

    <hr className='text-slate-400' />

    {/* comment input and post */}
    <div className='flex items-center justify-end px-2'>
      <input 
      type="text"
      value={content}
      onChange={(e)=> setContent(e.target.value)}
      className=' w-full border-slate-500 text-sm px-2 py-4 focus:outline-none'
      placeholder='Add a comment'
      required
       />
       <button 
       className='text-sm disabled:cursor-not-allowed hover:scale-105 transition-all duration-300'
       onClick={addComment}
       disabled={isSubmitting}
       >
          {isSubmitting ? "Posting..." : "Post"}
       </button>
    </div>

    </div>

  </div>
  )
}

export default Comment