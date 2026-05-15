import { Ellipsis, Heart, X } from 'lucide-react';
import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { createComment, fetchComments } from '../../store/slices/social-media/comment.slice';
import { toggleCommentModal } from '../../store/slices/popup.slice';

const Comment = ({post}) => {

  const dispatch = useDispatch();
  const { items, isSubmitting, isCommentOpen } = useSelector((state) => ({
    items: state.comment.items,
    isSubmitting: state.comment.isSubmitting,
    isCommentOpen: state.popup.isCommentOpen
  }),
shallowEqual
)

  const [content , setContent] = useState('')

  console.log("COMMENTS:", items);

  const defferredComments = useDeferredValue(items);
  
  const currentPost = useMemo(()=> post, [post])
  // console.log('posgt:',post);

  const handleToggleComment = useCallback(() => {
    dispatch(toggleCommentModal())
  },[dispatch])

  const handleCommentChange = useCallback((e)=> {
    setContent(e.target.value)
  },[])

  const addComment = useCallback(()=>{
    
    if(!content.trim()) return;

    dispatch(
      createComment({
        postId: post._id,
        content: content.trim()
      })
    );

    setContent('')

  },[dispatch, content, post])

useEffect(()=>{
  if(post?._id){
    dispatch(fetchComments({postId: post._id}))
  }
},[post?._id, dispatch])

  if (!post || !isCommentOpen) return null;

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
        <img src={currentPost?.author?.avatar || "/men_essentails.jpeg" } alt="img" className='size-6 object-cover rounded-full'/>
      </div>

      <div>
        <h3>{currentPost?.author?.displayName}</h3>
       </div>
       </div>

      <Ellipsis/>
       
     </div>

    {/* COMMENTS */}
    <div className='space-y-2 '>
      {
         defferredComments?.length > 0 ? ( 
           defferredComments.map((item) => (
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

    {/* INPUT */}
    <div className='flex items-center justify-end px-2'>
      <input 
      type="text"
      value={content}
      onChange={handleCommentChange}
      className=' w-full border-slate-500 text-sm px-2 py-4 focus:outline-none'
      placeholder='Add a comment'
      required
       />
       <button 
       className='text-sm disabled:cursor-not-allowed hover:scale-105 transition-all duration-300'
       onClick={addComment}
       disabled={isSubmitting || !content.trim()}
       >
          {isSubmitting ? "Posting..." : "Post"}
       </button>
    </div>

    </div>

  </div>
  )
}

export default Comment