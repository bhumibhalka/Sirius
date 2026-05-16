import React, { memo } from 'react'
import EcommerceSidebar from '../../components/UI/EcommerceSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchAllPosts } from '../../store/slices/social-media/post.slice';

const PostTile = memo(({post}) => {
  const mediaItem = post?.media?.[0]
  return (
      <div className=" bg-white border hover:scale-105 transition-all duration-300  h-[130px] "
          >
           {
            post?.media?.[0]?.type === "images" && (
              <img src={mediaItem.url} alt="" className="w-full h-[220px] bg-white"
              loading='lazy'
              />
            )
           }

          
           {
            mediaItem?.type === "videos" && (
             <video src={mediaItem.url} 
             className='w-full h-full object-cover'
             preload='none' // don't buffer video data for off-screen tiles
             muted
             />
            )
           }

          
          </div>
  )
})
PostTile.displayName = 'PostTile'

const Posts = () => {

  const dispatch = useDispatch();
  const userPosts = useSelector(state => state.post.userPosts)
  const loading = useSelector(state => state.post.loading)
   console.log('POSTS FROM STORE:', userPosts);
console.log('LOADING:', loading);
  useEffect(()=>{
    dispatch(fetchAllPosts(null)).then((result) => {
    console.log('ACTION RESULT:', result);       // what redux got back
    console.log('PAYLOAD:', result.payload);     // the actual data
  });
  },[])

  return (
    <div className='bg-black min-h-screen flex'>

      <EcommerceSidebar  />
      
    <div className='grid grid-cols-3 flex-1'>
     {
      userPosts && userPosts.length > 0 ? (
        userPosts.map(post => (
          <PostTile 
          key={post._id}
          post={post}
          />
        ))
      ) : (<div className="col-span-3 flex items-center justify-center text-white py-8"> 
        <p>No posts yet!!! Be the first one to post</p>
      </div>)
     }
    </div>
 
    </div>
  )
}

export default Posts