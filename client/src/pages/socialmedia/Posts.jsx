import React from 'react'
import EcommerceSidebar from '../../components/UI/EcommerceSidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import { fetchAllPosts } from '../../store/slices/social-media/post.slice';

const Posts = () => {

  const dispatch = useDispatch();
  const {userPosts, loading} = useSelector(state => state.post);
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
          <div
          key={post._id}
          className=" bg-white border hover:scale-105 transition-all duration-300  h-[130px] "
          >
           {
            post?.media?.[0]?.type === "images" && (
              <img src={post?.media?.[0]?.url} alt="" className="w-full h-[220px] bg-white" />
            )
           }

          
           {
            post?.media?.[0]?.type === "videos" && (
             <video src={post?.media?.[0]?.url}></video>
            )
           }

          
          </div>
        ))
      ) : (<div>
        <p>No posts yet!!! Be the first one to post</p>
      </div>)
     }
    </div>
 
    </div>
  )
}

export default Posts